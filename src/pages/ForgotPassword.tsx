
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Mail, ArrowRight, LogIn } from 'lucide-react';

const ForgotPassword = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call an API to send a reset password email
      // For demo purposes, we'll just simulate success after a short delay
      setTimeout(() => {
        setResetSent(true);
        toast({
          title: language === 'en' 
            ? 'Reset Link Sent' 
            : 'تم إرسال رابط إعادة التعيين',
          description: language === 'en' 
            ? 'Please check your email for a link to reset your password.' 
            : 'يرجى التحقق من بريدك الإلكتروني للحصول على رابط لإعادة تعيين كلمة المرور.',
        });
      }, 1500);
    } catch (error) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' 
          ? 'An error occurred. Please try again.' 
          : 'حدث خطأ. يرجى المحاولة مرة أخرى.',
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
                <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl">
                  {language === 'en' ? 'Forgot Password' : 'نسيت كلمة المرور'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!resetSent ? (
                  <>
                    <p className="text-gray-600 mb-4 text-center">
                      {language === 'en' 
                        ? 'Enter your email address and we will send you a link to reset your password.' 
                        : 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.'}
                    </p>
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
                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-xl mb-2">
                      {language === 'en' ? 'Check Your Email' : 'تحقق من بريدك الإلكتروني'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === 'en' 
                        ? `We've sent a password reset link to ${email}` 
                        : `لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}`}
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
                  <span className="text-gray-600">
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
