
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import ProfileSettings from '@/components/ProfileSettings';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

const Account = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Check if user is not authenticated and loading has finished
    if (!isAuthenticated && !isLoading) {
      toast.error(language === 'en' ? 'You must be logged in to view this page' : 'يجب تسجيل الدخول لعرض هذه الصفحة');
    }
  }, [isAuthenticated, isLoading, language, t]);

  // Show loading state while auth status is being determined
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>{language === 'en' ? 'Loading account...' : 'جار تحميل الحساب...'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">{language === 'en' ? 'My Account' : 'حسابي'}</h1>
        <ProfileSettings />
      </div>
    </Layout>
  );
};

export default Account;
