
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { LogIn, Mail, Lock, ArrowRight, UserPlus } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // استخراج المسار السابق إن وجد
  const from = location.state?.from || '/';
  const callback = location.state?.callback;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: language === 'en' ? 'Welcome back!' : 'مرحبًا بعودتك!',
        description: language === 'en' 
          ? 'You have successfully logged in.' 
          : 'لقد قمت بتسجيل الدخول بنجاح.'
      });
      
      // تنفيذ الدالة المرجعية في حال وجودها
      if (typeof callback === 'function') {
        callback();
      }
      
      // التنقل إلى الصفحة السابقة
      navigate(from);
    } catch (error) {
      toast({
        title: language === 'en' ? 'Login Failed' : 'فشل تسجيل الدخول',
        description: language === 'en' 
          ? 'Invalid email or password. Please try again.' 
          : 'البريد الإلكتروني أو كلمة المرور غير صالحة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-agri/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-agri" />
                </div>
                <CardTitle className="text-2xl">
                  {language === 'en' ? 'Login to Your Account' : 'تسجيل الدخول إلى حسابك'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="flex items-center">
                        <Lock className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                        {language === 'en' ? 'Password' : 'كلمة المرور'}
                      </Label>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm text-agri hover:underline"
                      >
                        {language === 'en' ? 'Forgot Password?' : 'نسيت كلمة المرور؟'}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-agri hover:bg-agri-dark flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      language === 'en' ? 'Logging in...' : 'جاري تسجيل الدخول...'
                    ) : (
                      <>
                        {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                        <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    {language === 'en' ? "Don't have an account? " : 'ليس لديك حساب؟ '}
                  </span>
                  <Link to="/signup" className="text-agri hover:underline flex items-center justify-center gap-1 inline-flex">
                    <UserPlus className="h-3 w-3" />
                    {language === 'en' ? 'Sign up' : 'إنشاء حساب'}
                  </Link>
                </div>
                
                <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                  <p>
                    {language === 'en' 
                      ? 'For demo, use email: user@example.com / password: password' 
                      : 'للعرض، استخدم البريد: user@example.com / كلمة المرور: password'}
                  </p>
                  <p className="mt-1">
                    {language === 'en' 
                      ? 'Admin access: admin@example.com / password: password' 
                      : 'وصول المدير: admin@example.com / كلمة المرور: password'}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
