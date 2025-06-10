
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
  
  // Initialize authentication state and listeners
  useEffect(() => {
    console.log('تهيئة حالة المصادقة...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('تغيير في حالة المصادقة:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('تم تسجيل دخول المستخدم:', currentSession?.user?.id);
          toast.success('تم تسجيل الدخول بنجاح');
          
          // Defer the admin check to avoid race conditions
          setTimeout(async () => {
            await checkAdminRole();
          }, 100);
        } 
        else if (event === 'SIGNED_OUT') {
          console.log('تم تسجيل خروج المستخدم');
          toast.info('تم تسجيل الخروج');
          setIsAdmin(false);
          setUser(null);
          setSession(null);
        }
        else if (event === 'TOKEN_REFRESHED') {
          console.log('تم تحديث الرمز');
        }
      }
    );
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('خطأ في استرجاع الجلسة:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('التحقق من الجلسة الحالية:', currentSession?.user?.id || 'لا توجد جلسة');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer admin check to avoid race conditions
          setTimeout(async () => {
            await checkAdminRole();
          }, 100);
        }
      } catch (error) {
        console.error('خطأ غير متوقع أثناء التحقق من الجلسة:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check the session
    checkSession();
    
    // Clean up subscription when component unmounts
    return () => {
      console.log('تنظيف اشتراك المصادقة');
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  // Function to refresh the session manually
  const refreshSession = async () => {
    try {
      console.log('جاري تحديث الجلسة...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('خطأ في تحديث الجلسة:', error);
        return;
      }
      
      if (data.session) {
        console.log('تم تحديث الجلسة بنجاح للمستخدم:', data.session.user.id);
        setSession(data.session);
        setUser(data.session.user);
        await checkAdminRole();
      }
    } catch (error) {
      console.error('فشل في تحديث الجلسة:', error);
    }
  };
  
  // Login function with improved error handling - Fixed return type
  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('محاولة تسجيل الدخول للمستخدم:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('خطأ في تسجيل الدخول:', error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('بيانات تسجيل الدخول غير صحيحة، يرجى التحقق وإعادة المحاولة');
        } else {
          toast.error('حدث خطأ أثناء تسجيل الدخول: ' + error.message);
        }
        throw error;
      }
      
      console.log('تم تسجيل الدخول بنجاح:', data.user?.id);
      
      // Update admin role after login
      if (data.user) {
        await checkAdminRole();
      }
    } catch (error) {
      // Error already handled above
      throw error;
    }
  };
  
  // Register function with improved error handling
  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('محاولة إنشاء حساب جديد للمستخدم:', email);
      
      const { data, error } = await supabase.auth.signUp({
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
      
      if (error) {
        console.error('خطأ في إنشاء الحساب:', error.message);
        
        if (error.message.includes('User already registered')) {
          toast.error('المستخدم مسجل بالفعل، يرجى تسجيل الدخول');
        } else {
          toast.error('حدث خطأ أثناء إنشاء الحساب: ' + error.message);
        }
        throw error;
      }
      
      console.log('تم إنشاء الحساب بنجاح:', data.user?.id);
      toast.success('تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني');
    } catch (error) {
      // Error already handled above
      throw error;
    }
  };
  
  // Password reset function with improved error handling
  const forgotPassword = async (email: string) => {
    try {
      console.log('إرسال طلب إعادة تعيين كلمة المرور للمستخدم:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        console.error('خطأ في إرسال طلب إعادة تعيين كلمة المرور:', error.message);
        toast.error('حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور: ' + error.message);
        throw error;
      }
      
      console.log('تم إرسال طلب إعادة تعيين كلمة المرور بنجاح');
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (error) {
      // Error already handled above
      throw error;
    }
  };
  
  // Logout function with improved error handling
  const logout = async () => {
    try {
      console.log('محاولة تسجيل الخروج');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('خطأ في تسجيل الخروج:', error.message);
        toast.error('حدث خطأ أثناء تسجيل الخروج: ' + error.message);
        throw error;
      }
      
      console.log('تم تسجيل الخروج بنجاح');
      // The toast is already shown in the auth state change listener
      
      // Reset all auth states manually
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      // Error already handled above
      throw error;
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
