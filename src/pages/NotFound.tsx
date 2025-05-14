
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <h2 className="text-3xl font-bold mt-4 mb-6 text-gray-800">
          {language === 'en' ? 'Oops! Page not found' : 'عفوًا! الصفحة غير موجودة'}
        </h2>
        <p className="max-w-md text-gray-600 mb-8">
          {language === 'en' 
            ? 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.' 
            : 'الصفحة التي تبحث عنها ربما تمت إزالتها، أو تم تغيير اسمها، أو أنها غير متاحة مؤقتًا.'}
        </p>
        <Link to="/">
          <Button className="bg-agri hover:bg-agri-dark">
            {language === 'en' ? 'Return to Home' : 'العودة إلى الصفحة الرئيسية'}
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
