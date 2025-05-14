
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CropCareService = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const featuresRef = useScrollAnimation();

  const services = [
    {
      title: language === 'en' ? 'Pest Management' : 'مكافحة الآفات',
      description: language === 'en' 
        ? 'Integrated pest management strategies that minimize chemical use while maximizing protection.' 
        : 'استراتيجيات متكاملة لإدارة الآفات تقلل من استخدام المواد الكيميائية مع تعزيز الحماية.'
    },
    {
      title: language === 'en' ? 'Disease Prevention' : 'الوقاية من الأمراض',
      description: language === 'en' 
        ? 'Early identification and treatment plans for common crop diseases.' 
        : 'خطط التعرف المبكر والعلاج للأمراض الشائعة للمحاصيل.'
    },
    {
      title: language === 'en' ? 'Fertilization Programs' : 'برامج التسميد',
      description: language === 'en' 
        ? 'Custom fertilization schedules based on crop type and growth stage.' 
        : 'جداول تسميد مخصصة بناءً على نوع المحصول ومرحلة النمو.'
    },
    {
      title: language === 'en' ? 'Harvesting Planning' : 'تخطيط الحصاد',
      description: language === 'en' 
        ? 'Optimal harvesting timing to ensure maximum yield and quality.' 
        : 'توقيت الحصاد الأمثل لضمان أقصى قدر من المحصول والجودة.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Crop Care Services' : 'خدمات رعاية المحاصيل'}
            </h1>
            <p className="text-xl mb-8">
              {language === 'en'
                ? 'Expert advice on crop management and protection for optimal yield and quality.'
                : 'نصائح خبيرة حول إدارة المحاصيل وحمايتها للحصول على محصول وجودة مثالية.'}
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100">
                {t('nav.book')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src="/src/assets/crop.jpg" 
                  alt={language === 'en' ? "Crop Care" : "رعاية المحاصيل"}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            
            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-800">
                {language === 'en' 
                  ? 'Professional Crop Management' 
                  : 'إدارة المحاصيل الاحترافية'}
              </h2>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'Our team of agronomists provides comprehensive crop care solutions tailored to your specific crops and growing conditions. With years of experience and the latest agricultural research, we help you maximize your yield while maintaining sustainable practices.'
                  : 'يقدم فريقنا من خبراء الزراعة حلولًا شاملة لرعاية المحاصيل مصممة خصيصًا لمحاصيلك وظروف النمو الخاصة بك. مع سنوات من الخبرة وأحدث الأبحاث الزراعية، نساعدك على زيادة محصولك إلى أقصى حد مع الحفاظ على الممارسات المستدامة.'}
              </p>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'We focus on integrated approaches that balance productivity with environmental responsibility, ensuring your farm remains productive for generations to come.'
                  : 'نركز على النهج المتكاملة التي توازن بين الإنتاجية والمسؤولية البيئية، مما يضمن بقاء مزرعتك منتجة للأجيال القادمة.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div ref={featuresRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800">
              {language === 'en' ? 'Our Crop Care Services' : 'خدمات رعاية المحاصيل لدينا'}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-green-700">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/book">
              <Button className="bg-green-700 hover:bg-green-800">
                {language === 'en' ? 'Schedule a Consultation' : 'جدولة استشارة'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to Improve Your Crop Yields?' 
              : 'هل أنت مستعد لتحسين غلة محاصيلك؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Contact our team today to schedule a field visit and get personalized recommendations for your crops.'
              : 'اتصل بفريقنا اليوم لجدولة زيارة ميدانية والحصول على توصيات مخصصة لمحاصيلك.'}
          </p>
          <Link to="/book">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
              {language === 'en' ? 'Get Started' : 'ابدأ الآن'}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default CropCareService;
