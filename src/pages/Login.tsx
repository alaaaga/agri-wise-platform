
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth(); // Changed from signIn to login
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      const errorMsg = language === 'en' 
        ? 'Please fill in all fields' 
        : 'يرجى ملء جميع الحقول';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('محاولة تسجيل الدخول:', { email });
      await login(email, password); // Changed from signIn to login
      
      console.log('تم تسجيل الدخول بنجاح');
      toast.success(language === 'en' ? 'Welcome back!' : 'مرحباً بعودتك!');
      navigate('/');
      
    } catch (error: any) {
      console.error('خطأ في تسجيل الدخول:', error);
      
      let errorMessage = '';
      const errorMsg = error.message || '';
      
      if (errorMsg.includes('Invalid login credentials') || 
          errorMsg.includes('invalid_credentials')) {
        errorMessage = language === 'en' 
          ? 'Invalid email or password. Please check your credentials and try again.' 
          : 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من البيانات والمحاولة مرة أخرى.';
      } else if (errorMsg.includes('Email not confirmed')) {
        errorMessage = language === 'en' 
          ? 'Please confirm your email address before signing in.' 
          : 'يرجى تأكيد عنوان البريد الإلكتروني قبل تسجيل الدخول.';
      } else if (errorMsg.includes('Too many requests')) {
        errorMessage = language === 'en' 
          ? 'Too many login attempts. Please wait a moment and try again.' 
          : 'محاولات تسجيل دخول كثيرة. يرجى الانتظار قليلاً والمحاولة مرة أخرى.';
      } else {
        errorMessage = language === 'en' 
          ? 'Login failed. Please try again.' 
          : 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="password">
                  {language === 'en' ? 'Password' : 'كلمة المرور'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading 
                  ? (language === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...') 
                  : (language === 'en' ? 'Sign In' : 'تسجيل الدخول')
                }
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {language === 'en' ? 'Forgot your password?' : 'هل نسيت كلمة المرور؟'}
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟'}{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  {language === 'en' ? 'Sign up' : 'إنشاء حساب'}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
