
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import farmBackground from '../../assets/farm-background.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <div 
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${farmBackground})` 
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
      
      <div className="relative z-10 text-center text-white p-4 max-w-3xl animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {t('home.hero.title')}
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          {t('home.hero.subtitle')}
        </p>
        <Link to="/services">
          <Button 
            size="lg" 
            className="bg-agri hover:bg-agri-dark text-white px-8 py-6 text-lg"
          >
            {t('common.explore')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
