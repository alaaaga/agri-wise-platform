
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkAdminRole: () => Promise<void>;
  refreshSession: () => Promise<void>;
  getUserDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkAdminRole();
      } else {
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async () => {
    try {
      if (!user && !session?.user) return;
      
      console.log('التحقق من دور المسؤول...');
      
      // التحقق من جدول profiles مباشرة
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session?.user?.id || user?.id)
        .single();
        
      if (error) {
        console.error('خطأ في التحقق من دور المسؤول:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(profile?.role === 'admin');
      }
      
      console.log('نتيجة فحص المسؤول:', profile?.role === 'admin');
    } catch (error) {
      console.error('خطأ غير متوقع في فحص دور المسؤول:', error);
      setIsAdmin(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('تم تسجيل الدخول بنجاح:', data);
      
      // سيتم استدعاء checkAdminRole تلقائياً من خلال onAuthStateChange
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: any = {}) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;

      console.log('تم إنشاء الحساب بنجاح:', data);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const userData = {
      first_name: firstName,
      last_name: lastName,
      role: 'user'
    };
    
    return await signup(email, password, userData);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAdmin(false);
      console.log('تم تسجيل الخروج بنجاح');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    return await resetPassword(email);
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        await checkAdminRole();
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'مستخدم';
    
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return user.email?.split('@')[0] || 'مستخدم';
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    login,
    signup,
    register,
    logout,
    resetPassword,
    forgotPassword,
    checkAdminRole,
    refreshSession,
    getUserDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
