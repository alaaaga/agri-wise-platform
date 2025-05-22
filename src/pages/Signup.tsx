
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Signup = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: language === 'en' ? 'Passwords do not match' : 'كلمات المرور غير متطابقة',
        description: language === 'en' 
          ? 'Please make sure both passwords match.' 
          : 'يرجى التأكد من تطابق كلمتي المرور.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(email, password, firstName, lastName);
      toast({
        title: language === 'en' ? 'Account Created!' : 'تم إنشاء الحساب!',
        description: language === 'en' 
          ? 'Your account has been successfully created.' 
          : 'تم إنشاء حسابك بنجاح.'
      });
      navigate('/');
    } catch (error) {
      toast({
        title: language === 'en' ? 'Registration Failed' : 'فشل التسجيل',
        description: language === 'en' 
          ? 'There was an error creating your account. Please try again.' 
          : 'حدث خطأ أثناء إنشاء حسابك. يرجى المحاولة مرة أخرى.',
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
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {language === 'en' ? 'Create an Account' : 'إنشاء حساب'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {language === 'en' ? 'First Name' : 'الاسم الأول'}
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={language === 'en' ? 'Enter your first name' : 'أدخل اسمك الأول'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {language === 'en' ? 'Last Name' : 'اسم العائلة'}
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={language === 'en' ? 'Enter your last name' : 'أدخل اسم العائلة'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      {language === 'en' ? 'Password' : 'كلمة المرور'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'en' ? 'Create a password' : 'إنشاء كلمة مرور'}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {language === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === 'en' ? 'Confirm your password' : 'تأكيد كلمة المرور'}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-agri hover:bg-agri-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (language === 'en' ? 'Creating Account...' : 'جاري إنشاء الحساب...') 
                      : (language === 'en' ? 'Sign Up' : 'إنشاء حساب')}
                  </Button>
                </form>
                
                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">
                    {language === 'en' ? 'Already have an account? ' : 'هل لديك حساب بالفعل؟ '}
                  </span>
                  <Link to="/login" className="text-agri hover:underline">
                    {language === 'en' ? 'Login' : 'تسجيل الدخول'}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
