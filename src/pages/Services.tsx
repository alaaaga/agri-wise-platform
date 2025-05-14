
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '@/components/ServiceCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Services = () => {
  const { t } = useLanguage();
  const titleRef = useScrollAnimation();
  
  // Using emoji icons for now, would be replaced with actual icons in production
  const services = [
    {
      icon: '🌱',
      title: t('services.crop.title'),
      description: t('services.crop.description'),
      link: '/services/crop-care',
      details: t('services.crop.description') + ' ' + 
        (t.language === 'en' 
          ? 'Our experts provide tailored advice on pest management, disease prevention, and optimal growing conditions.' 
          : 'يقدم خبراؤنا نصائح مخصصة حول إدارة الآفات والوقاية من الأمراض وظروف النمو المثلى.')
    },
    {
      icon: '🐄',
      title: t('services.livestock.title'),
      description: t('services.livestock.description'),
      link: '/services/livestock',
      details: t('services.livestock.description') + ' ' + 
        (t.language === 'en' 
          ? 'From nutrition planning to breeding programs and health protocols, we help maximize your livestock productivity.' 
          : 'من تخطيط التغذية إلى برامج التربية وبروتوكولات الصحة، نساعد في تعظيم إنتاجية ماشيتك.')
    },
    {
      icon: '🧪',
      title: t('services.soil.title'),
      description: t('services.soil.description'),
      link: '/services/soil-analysis',
      details: t('services.soil.description') + ' ' + 
        (t.language === 'en' 
          ? 'Our comprehensive soil testing identifies nutrient deficiencies and provides specific fertilization recommendations.' 
          : 'يحدد اختبار التربة الشامل لدينا نقص العناصر الغذائية ويقدم توصيات تسميد محددة.')
    },
    {
      icon: '🚜',
      title: t('services.tech.title'),
      description: t('services.tech.description'),
      link: '/services/agri-tech',
      details: t('services.tech.description') + ' ' + 
        (t.language === 'en' 
          ? 'We help you integrate precision agriculture tools, IoT sensors, and automated systems for improved efficiency.' 
          : 'نساعدك على دمج أدوات الزراعة الدقيقة وأجهزة استشعار إنترنت الأشياء والأنظمة الآلية لتحسين الكفاءة.')
    },
    {
      icon: '🌿',
      title: t.language === 'en' ? 'Organic Farming' : 'الزراعة العضوية',
      description: t.language === 'en' 
        ? 'Guidance on organic certification and sustainable practices' 
        : 'إرشادات حول الشهادات العضوية والممارسات المستدامة',
      link: '/services/organic',
      details: t.language === 'en' 
        ? 'Guidance on organic certification and sustainable practices. We provide complete support for transitioning to organic methods and maintaining certification.' 
        : 'إرشادات حول الشهادات العضوية والممارسات المستدامة. نقدم دعمًا كاملاً للانتقال إلى الطرق العضوية والحفاظ على الشهادة.'
    },
    {
      icon: '🚰',
      title: t.language === 'en' ? 'Water Management' : 'إدارة المياه',
      description: t.language === 'en' 
        ? 'Water conservation and irrigation system optimization' 
        : 'الحفاظ على المياه وتحسين نظام الري',
      link: '/services/water',
      details: t.language === 'en' 
        ? 'Water conservation and irrigation system optimization. Our experts design efficient irrigation systems that save water while ensuring optimal crop hydration.' 
        : 'الحفاظ على المياه وتحسين نظام الري. يصمم خبراؤنا أنظمة ري فعالة توفر المياه مع ضمان الترطيب الأمثل للمحاصيل.'
    }
  ];

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto">{t('services.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.details}
                icon={<span className="text-3xl">{service.icon}</span>}
                link={service.link}
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
