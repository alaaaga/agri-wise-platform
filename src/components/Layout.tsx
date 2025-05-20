
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  return (
    <div className={`${language === 'ar' ? 'rtl font-tajawal' : 'ltr font-poppins'} ${theme === 'dark' ? 'dark' : ''} min-h-screen flex flex-col`}>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
