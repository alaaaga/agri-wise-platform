
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const AgriTechService = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const technologiesRef = useScrollAnimation();

  const technologies = [
    {
      title: language === 'en' ? 'Precision Agriculture' : 'الزراعة الدقيقة',
      description: language === 'en' 
        ? 'GPS-guided equipment, variable rate application, and field mapping for precise resource management.' 
        : 'معدات موجهة بنظام تحديد المواقع العالمي، وتطبيق متغير المعدل، ورسم خرائط الحقول للإدارة الدقيقة للموارد.'
    },
    {
      title: language === 'en' ? 'IoT Monitoring' : 'مراقبة إنترنت الأشياء',
      description: language === 'en' 
        ? 'Real-time monitoring of soil moisture, temperature, and crop health with networked sensors.' 
        : 'مراقبة رطوبة التربة ودرجة الحرارة وصحة المحاصيل في الوقت الفعلي باستخدام أجهزة استشعار مرتبطة بالشبكة.'
    },
    {
      title: language === 'en' ? 'Drone Technology' : 'تكنولوجيا الطائرات بدون طيار',
      description: language === 'en' 
        ? 'Aerial imaging, crop scouting, and targeted application of inputs using advanced drones.' 
        : 'التصوير الجوي، واستكشاف المحاصيل، والتطبيق المستهدف للمدخلات باستخدام طائرات بدون طيار متطورة.'
    },
    {
      title: language === 'en' ? 'Automated Systems' : 'الأنظمة الآلية',
      description: language === 'en' 
        ? 'Smart irrigation, climate control, and automated feeding systems for livestock operations.' 
        : 'الري الذكي، والتحكم في المناخ، وأنظمة التغذية الآلية لعمليات تربية الماشية.'
    },
    {
      title: language === 'en' ? 'Data Analytics' : 'تحليلات البيانات',
      description: language === 'en' 
        ? 'Advanced agricultural analytics to turn farm data into actionable insights.' 
        : 'تحليلات زراعية متقدمة لتحويل بيانات المزرعة إلى رؤى قابلة للتنفيذ.'
    },
    {
      title: language === 'en' ? 'Mobile Applications' : 'تطبيقات الجوال',
      description: language === 'en' 
        ? 'Custom mobile solutions for farm management, monitoring, and decision support.' 
        : 'حلول الجوال المخصصة لإدارة المزرعة والمراقبة ودعم القرار.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Agricultural Technology Services' : 'خدمات التكنولوجيا الزراعية'}
            </h1>
            <p className="text-xl mb-8">
              {language === 'en'
                ? 'Modern farming technologies and implementation for improved efficiency and sustainability.'
                : 'تقنيات الزراعة الحديثة والتنفيذ لتحسين الكفاءة والاستدامة.'}
            </p>
            <Link to="/book">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-gray-100">
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
                  src="https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80" 
                  alt={language === 'en' ? "Agricultural Technology" : "التكنولوجيا الزراعية"}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            
            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-blue-800">
                {language === 'en' 
                  ? 'The Future of Farming Is Here' 
                  : 'مستقبل الزراعة هنا'}
              </h2>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'Agricultural technology is revolutionizing how farms operate, bringing unprecedented efficiency, sustainability, and profitability. Our team specializes in helping farmers integrate cutting-edge technologies into their operations, no matter the size or type of farm.'
                  : 'تقوم التكنولوجيا الزراعية بثورة في كيفية عمل المزارع، مما يحقق كفاءة واستدامة وربحية غير مسبوقة. يتخصص فريقنا في مساعدة المزارعين على دمج التقنيات المتطورة في عملياتهم، بغض النظر عن حجم المزرعة أو نوعها.'}
              </p>
              <p className="text-gray-700 mb-6">
                {language === 'en'
                  ? 'From precision agriculture and IoT solutions to drone technology and automated systems, we provide comprehensive guidance on selecting, implementing, and maximizing the return on your agricultural technology investments.'
                  : 'من الزراعة الدقيقة وحلول إنترنت الأشياء إلى تكنولوجيا الطائرات بدون طيار والأنظمة الآلية، نقدم إرشادات شاملة حول اختيار استثمارات التكنولوجيا الزراعية وتنفيذها وتعظيم العائد منها.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div ref={technologiesRef} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800">
              {language === 'en' ? 'Agricultural Technologies We Implement' : 'التقنيات الزراعية التي ننفذها'}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-blue-700">{tech.title}</h3>
                <p className="text-gray-700">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800">
              {language === 'en' ? 'Benefits of Agricultural Technology' : 'فوائد التكنولوجيا الزراعية'}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-4 text-blue-700">
                {language === 'en' ? 'Operational Efficiency' : 'كفاءة التشغيل'}
              </h3>
              <ul className="list-disc ml-6 rtl:mr-6 rtl:ml-0 space-y-2 text-gray-700">
                <li>
                  {language === 'en' 
                    ? 'Reduce labor costs through automation'
                    : 'تقليل تكاليف العمالة من خلال الأتمتة'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Optimize resource utilization with precision application'
                    : 'تحسين استخدام الموارد مع التطبيق الدقيق'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Streamline farm operations with integrated systems'
                    : 'تبسيط عمليات المزرعة باستخدام أنظمة متكاملة'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Make data-driven decisions for better outcomes'
                    : 'اتخاذ قرارات قائمة على البيانات لتحقيق نتائج أفضل'}
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-600">
              <h3 className="text-xl font-bold mb-4 text-blue-700">
                {language === 'en' ? 'Environmental Impact' : 'الأثر البيئي'}
              </h3>
              <ul className="list-disc ml-6 rtl:mr-6 rtl:ml-0 space-y-2 text-gray-700">
                <li>
                  {language === 'en' 
                    ? 'Reduce waste through targeted application of inputs'
                    : 'تقليل الهدر من خلال التطبيق المستهدف للمدخلات'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Lower water usage with smart irrigation systems'
                    : 'تقليل استخدام المياه مع أنظمة الري الذكية'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Minimize chemical use with precise pest management'
                    : 'تقليل استخدام المواد الكيميائية مع الإدارة الدقيقة للآفات'}
                </li>
                <li>
                  {language === 'en' 
                    ? 'Better soil health monitoring and preservation'
                    : 'مراقبة صحة التربة والحفاظ عليها بشكل أفضل'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to Transform Your Farm with Technology?' 
              : 'هل أنت مستعد لتحويل مزرعتك بالتكنولوجيا؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Contact our agricultural technology specialists today to discover how we can help modernize your farming operations.'
              : 'اتصل بمتخصصي التكنولوجيا الزراعية لدينا اليوم لاكتشاف كيف يمكننا المساعدة في تحديث عمليات الزراعة الخاصة بك.'}
          </p>
          <Link to="/book">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-800">
              {language === 'en' ? 'Get Started' : 'ابدأ الآن'}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default AgriTechService;
