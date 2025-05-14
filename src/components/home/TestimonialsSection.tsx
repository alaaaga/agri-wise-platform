
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  
  const testimonials = [
    {
      quote: language === 'en' 
        ? "The soil analysis service completely transformed my farm's productivity. Their expert recommendations were spot on!" 
        : 'خدمة تحليل التربة حولت إنتاجية مزرعتي تمامًا. كانت توصيات الخبراء في محلها!',
      name: language === 'en' ? 'Ahmed Hassan' : 'أحمد حسن',
      role: language === 'en' ? 'Crop Farmer' : 'مزارع المحاصيل',
      location: language === 'en' ? 'Jordan' : 'الأردن'
    },
    {
      quote: language === 'en' 
        ? "I've been using their livestock management consultancy for two years now and have seen a significant improvement in my animals' health." 
        : 'لقد استخدمت استشارات إدارة الثروة الحيوانية لمدة عامين الآن وقد شهدت تحسنًا كبيرًا في صحة حيواناتي.',
      name: language === 'en' ? 'Fatima Al-Sayed' : 'فاطمة السيد',
      role: language === 'en' ? 'Dairy Farm Owner' : 'صاحبة مزرعة ألبان',
      location: language === 'en' ? 'Egypt' : 'مصر'
    },
    {
      quote: language === 'en' 
        ? 'The agricultural technology recommendations helped me modernize my farm and increase efficiency while reducing costs.' 
        : 'ساعدتني توصيات التكنولوجيا الزراعية على تحديث مزرعتي وزيادة الكفاءة مع تقليل التكاليف.',
      name: language === 'en' ? 'Mohammed Al-Farsi' : 'محمد الفارسي',
      role: language === 'en' ? 'Agricultural Entrepreneur' : 'رائد أعمال زراعي',
      location: language === 'en' ? 'UAE' : 'الإمارات'
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials.title')}</h2>
          <div className="w-24 h-1 bg-agri mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => {
            const cardRef = useScrollAnimation();
            return (
              <div key={index} ref={cardRef}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl text-agri mb-4">"</div>
                    <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-agri-light rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="ml-4 rtl:mr-4 rtl:ml-0">
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">
                          {testimonial.role}, {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
