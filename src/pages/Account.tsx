
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import ProfileSettings from '@/components/ProfileSettings';
import { toast } from '@/components/ui/sonner';

const Account = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error(t('auth.must_login'));
    }
  }, [isAuthenticated, t]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">{t('account.title')}</h1>
        <ProfileSettings />
      </div>
    </Layout>
  );
};

export default Account;
