
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Mail, ArrowRight, LogIn, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { language } = useLanguage();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await forgotPassword(email);
      setResetSent(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        language === 'en' ? 'An error occurred. Please try again.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-2xl">
                  {language === 'en' ? 'Forgot Password' : 'نسيت كلمة المرور'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!resetSent ? (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                      {language === 'en' 
                        ? 'Enter your email address and we will send you a link to reset your password.' 
                        : 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.'}
                    </p>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </div>
                    )}
                    
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
                          className="bg-gray-50 dark:bg-gray-800"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-agri hover:bg-agri-dark flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          language === 'en' ? 'Sending...' : 'جاري الإرسال...'
                        ) : (
                          <>
                            {language === 'en' ? 'Send Reset Link' : 'إرسال رابط إعادة التعيين'}
                            <ArrowRight className="ml-2 h-4 w-4 rtl:mr-2 rtl:ml-0" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-xl mb-2">
                      {language === 'en' ? 'Check Your Email' : 'تحقق من بريدك الإلكتروني'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {language === 'en' 
                        ? `We've sent a password reset link to ${email}` 
                        : `لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}`}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                      {language === 'en' 
                        ? "Please check your spam folder if you don't see the email in your inbox." 
                        : "يرجى التحقق من مجلد الرسائل غير المرغوب فيها إذا لم تر البريد الإلكتروني في صندوق الوارد الخاص بك."}
                    </p>
                    <Button 
                      onClick={() => navigate('/login')} 
                      variant="outline" 
                      className="mt-2"
                    >
                      {language === 'en' ? 'Back to Login' : 'العودة إلى تسجيل الدخول'}
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    {language === 'en' ? "Remember your password? " : 'هل تتذكر كلمة المرور؟ '}
                  </span>
                  <Link to="/login" className="text-agri hover:underline flex items-center justify-center gap-1 inline-flex">
                    <LogIn className="h-3 w-3" />
                    {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
