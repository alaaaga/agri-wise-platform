
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '../ServiceCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ServicesSection = () => {
  const { t } = useLanguage();
  const titleRef = useScrollAnimation();
  
  // Using emoji icons for now, would be replaced with actual icons in production
  const services = [
    {
      icon: '🌱',
      title: t('services.crop.title'),
      description: t('services.crop.description'),
      link: '/services/crop-care'
    },
    {
      icon: '🐄',
      title: t('services.livestock.title'),
      description: t('services.livestock.description'),
      link: '/services/livestock'
    },
    {
      icon: '🧪',
      title: t('services.soil.title'),
      description: t('services.soil.description'),
      link: '/services/soil-analysis'
    },
    {
      icon: '🚜',
      title: t('services.tech.title'),
      description: t('services.tech.description'),
      link: '/services/agri-tech'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.services.title')}</h2>
          <div className="w-24 h-1 bg-agri mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={<span className="text-3xl">{service.icon}</span>}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="default" className="bg-agri hover:bg-agri-dark">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
