
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const SoilAnalysisService = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const processRef = useScrollAnimation();

  const analysisTypes = [
    {
      title: language === 'en' ? 'Basic Soil Testing' : 'اختبار التربة الأساسي',
      description: language === 'en' 
        ? 'pH levels, nutrient content, organic matter percentage, and basic recommendations.' 
        : 'مستويات الرقم الهيدروجيني، محتوى المغذيات، نسبة المواد العضوية، والتوصيات الأساسية.'
    },
    {
      title: language === 'en' ? 'Comprehensive Analysis' : 'تحليل شامل',
      description: language === 'en' 
        ? 'Detailed soil structure, micronutrient levels, biological activity, and custom improvement plan.' 
        : 'بنية التربة التفصيلية، مستويات المغذيات الدقيقة، النشاط البيولوجي، وخطة تحسين مخصصة.'
    },
    {
      title: language === 'en' ? 'Contaminant Screening' : 'فحص الملوثات',
      description: language === 'en' 
        ? 'Testing for heavy metals, pesticide residues, and other potential contaminants.' 
        : 'اختبار المعادن الثقيلة وبقايا المبيدات وغيرها من الملوثات المحتملة.'
    },
    {
      title: language === 'en' ? 'Water Retention Analysis' : 'تحليل احتباس المياه',
      description: language === 'en' 
        ? 'Evaluation of soil drainage and water holding capacity with improvement strategies.' 
        : 'تقييم تصريف التربة وقدرة احتفاظ المياه مع استراتيجيات التحسين.'
    }
  ];

  const process = [
    {
      step: language === 'en' ? 'Step 1: Sampling' : 'الخطوة 1: أخذ العينات',
      description: language === 'en'
        ? 'Our technicians collect representative soil samples from various areas of your land.'
        : 'يقوم فنيونا بجمع عينات تربة تمثيلية من مختلف مناطق أرضك.'
    },
    {
      step: language === 'en' ? 'Step 2: Laboratory Analysis' : 'الخطوة 2: التحليل المختبري',
      description: language === 'en'
        ? 'Samples are tested in our state-of-the-art laboratory for various parameters.'
        : 'يتم اختبار العينات في مختبرنا المتطور لمختلف المعايير.'
    },
    {
      step: language === 'en' ? 'Step 3: Results & Interpretation' : 'الخطوة 3: النتائج والتفسير',
      description: language === 'en'
        ? 'Our agronomists analyze the results and prepare detailed reports.'
        : 'يقوم خبراء الزراعة لدينا بتحليل النتائج وإعداد تقارير مفصلة.'
    },
    {
      step: language === 'en' ? 'Step 4: Recommendations' : 'الخطوة 4: التوصيات',
      description: language === 'en'
        ? 'We provide tailored recommendations for soil improvement based on your specific needs.'
        : 'نقدم توصيات مخصصة لتحسين التربة بناءً على احتياجاتك الخاصة.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Soil Analysis Services' : 'خدمات تحليل التربة'}
            </h1>
            <p className="text-xl mb-8">
              {language === 'en'
                ? 'Detailed soil testing and improvement recommendations for optimal crop growth.'
                : 'اختبار تفصيلي للتربة وتوصيات التحسين للنمو الأمثل للمحاصيل.'}
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-white text-amber-800 hover:bg-gray-100">
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
            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-amber-800">
                {language === 'en' 
                  ? 'Know Your Soil, Grow Better Crops' 
                  : 'اعرف تربتك، انمِ محاصيل أفضل'}
              </h2>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'Soil is the foundation of successful agriculture. Our comprehensive soil analysis services help you understand the exact composition and health of your soil, enabling you to make informed decisions about amendments, fertilization, and crop selection.'
                  : 'التربة هي أساس الزراعة الناجحة. تساعدك خدمات تحليل التربة الشاملة لدينا على فهم التركيبة الدقيقة وصحة تربتك، مما يمكنك من اتخاذ قرارات مستنيرة بشأن التعديلات والتسميد واختيار المحاصيل.'}
              </p>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'With our scientific approach, you can optimize your soil conditions, reduce unnecessary inputs, and maximize your agricultural productivity for years to come.'
                  : 'من خلال نهجنا العلمي، يمكنك تحسين ظروف التربة، وتقليل المدخلات غير الضرورية، وزيادة إنتاجيتك الزراعية إلى أقصى حد للسنوات القادمة.'}
              </p>
            </div>
            
            {/* Image */}
            <div className="rounded-lg overflow-hidden shadow-xl">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src="/src/assets/soil.jpg" 
                  alt={language === 'en' ? "Soil Analysis" : "تحليل التربة"}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800">
              {language === 'en' ? 'Our Soil Analysis Services' : 'خدمات تحليل التربة لدينا'}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {analysisTypes.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-amber-700">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div ref={processRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-800">
              {language === 'en' ? 'Our Soil Analysis Process' : 'عملية تحليل التربة لدينا'}
            </h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="flex mb-8">
                <div className="mr-6 rtl:ml-6 rtl:mr-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-700 text-white text-xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-amber-700">{item.step}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/book">
              <Button className="bg-amber-700 hover:bg-amber-800">
                {language === 'en' ? 'Schedule a Soil Analysis' : 'جدولة تحليل التربة'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-amber-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to Understand Your Soil Better?' 
              : 'هل أنت مستعد لفهم تربتك بشكل أفضل؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Contact our team of soil specialists today to schedule a comprehensive soil analysis for your farm or garden.'
              : 'اتصل بفريق متخصصي التربة لدينا اليوم لجدولة تحليل شامل للتربة لمزرعتك أو حديقتك.'}
          </p>
          <Link to="/book">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800">
              {language === 'en' ? 'Get Started' : 'ابدأ الآن'}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default SoilAnalysisService;
