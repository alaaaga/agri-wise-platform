
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserDisplayName: () => string;
  refreshSession: () => Promise<void>;
  checkAdminRole: () => Promise<boolean>;
}

// Helper function to get user display name
const getUserDisplayNameFromUser = (user: User | null): string => {
  if (!user) return '';
  
  // Try to get name from metadata
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  
  if (firstName || lastName) {
    return `${firstName} ${lastName}`.trim();
  }
  
  // Fallback to email
  return user.email || '';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // التحقق من دور المسؤول
  const checkAdminRole = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }
    
    try {
      console.log('جاري التحقق من دور المسؤول للمستخدم:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('خطأ في استرجاع الملف الشخصي للمستخدم:', error);
        setIsAdmin(false);
        return false;
      }

      const hasAdminRole = profile?.role === 'admin';
      console.log('نتيجة التحقق من دور المسؤول:', hasAdminRole, 'للمستخدم:', user.id);
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (error) {
      console.error('خطأ غير متوقع أثناء التحقق من دور المسؤول:', error);
      setIsAdmin(false);
      return false;
    }
  }, [user]);
  
  useEffect(() => {
    // إعداد مستمع لحالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('تم تسجيل دخول المستخدم:', currentSession?.user?.id);
          toast.success('تم تسجيل الدخول بنجاح');
          // تأخير استدعاء checkAdminRole لتجنب تعارضات الاستعلامات المتزامنة
          setTimeout(() => {
            checkAdminRole();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          console.log('تم تسجيل خروج المستخدم');
          toast.info('تم تسجيل الخروج');
          setIsAdmin(false);
        }
      }
    );
    
    // التحقق من وجود جلسة
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('التحقق من الجلسة الحالية:', currentSession?.user?.id || 'لا توجد جلسة');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        // تأخير استدعاء checkAdminRole لتجنب تعارضات الاستعلامات المتزامنة
        setTimeout(() => {
          checkAdminRole();
        }, 0);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const refreshSession = async () => {
    try {
      console.log('جاري تحديث الجلسة...');
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('خطأ في تحديث الجلسة:', error);
        return;
      }
      
      if (refreshedSession) {
        console.log('تم تحديث الجلسة بنجاح للمستخدم:', refreshedSession.user.id);
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        checkAdminRole();
      }
    } catch (error) {
      console.error('فشل في تحديث الجلسة:', error);
    }
  };
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // تحديث حالة المسؤول بعد تسجيل الدخول
      if (data.user) {
        await checkAdminRole();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الدخول';
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'user'
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      toast.success('تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إنشاء الحساب';
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور';
      toast.error(errorMessage);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء تسجيل الخروج';
      toast.error(errorMessage);
    }
  };
  
  const getUserDisplayName = () => {
    return getUserDisplayNameFromUser(user);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated: !!user, 
      isLoading,
      isAdmin,
      login, 
      register, 
      forgotPassword,
      logout,
      getUserDisplayName,
      refreshSession,
      checkAdminRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
