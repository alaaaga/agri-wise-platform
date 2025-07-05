
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder team data - in production, this would come from an API
const team = [
  {
    name: { en: 'Dr. Ahmed Al-Mansour', ar: 'د. أحمد المنصور' },
    role: { en: 'Agricultural Scientist', ar: 'عالم زراعي' },
    bio: { 
      en: 'Ph.D in Agricultural Sciences with over 15 years of experience in soil management and crop development.', 
      ar: 'دكتوراه في العلوم الزراعية مع أكثر من 15 عامًا من الخبرة في إدارة التربة وتطوير المحاصيل.' 
    },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
  },
  {
    name: { en: 'Layla Karim', ar: 'ليلى كريم' },
    role: { en: 'Livestock Specialist', ar: 'متخصصة في الثروة الحيوانية' },
    bio: { 
      en: 'M.Sc in Animal Science specializing in dairy and meat production systems with sustainable farming practices.', 
      ar: 'ماجستير في علوم الحيوان متخصصة في أنظمة إنتاج الألبان واللحوم مع ممارسات الزراعة المستدامة.' 
    },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmVzc2lvbmFsJTIwd29tYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
  },
  {
    name: { en: 'Ibrahim Qasim', ar: 'إبراهيم قاسم' },
    role: { en: 'Agricultural Technology Expert', ar: 'خبير التكنولوجيا الزراعية' },
    bio: { 
      en: 'Agricultural engineer specializing in precision farming technologies and IoT applications in agriculture.', 
      ar: 'مهندس زراعي متخصص في تقنيات الزراعة الدقيقة وتطبيقات إنترنت الأشياء في الزراعة.' 
    },
    image: 'https://images.unsplash.com/photo-1563132337-f159f484226c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2Zlc3Npb25hbCUyMG1pZGRsZSUyMGVhc3Rlcm4lMjBtYW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60'
  },
  {
    name: { en: 'Nour Al-Fadli', ar: 'نور الفضلي' },
    role: { en: 'Sustainable Farming Consultant', ar: 'مستشارة الزراعة المستدامة' },
    bio: { 
      en: 'Specialist in organic farming methods and sustainable agricultural practices with a focus on water conservation.', 
      ar: 'متخصصة في طرق الزراعة العضوية والممارسات الزراعية المستدامة مع التركيز على الحفاظ على المياه.' 
    },
    image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmVzc2lvbmFsJTIwYXJhYiUyMHdvbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
  }
];

const About = () => {
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  
  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'About Us' : 'من نحن'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Your trusted partner in agricultural excellence and innovation' 
                : 'شريكك الموثوق في التميز والابتكار الزراعي'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div ref={missionRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 ${language === 'ar' ? 'rtl' : ''}`}>
            <div className={`${language === 'ar' ? 'order-2' : 'order-1'}`}>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {language === 'en' ? 'Our Mission' : 'مهمتنا'}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {language === 'en' 
                    ? 'Empowering farmers with cutting-edge knowledge, innovative technology, and personalized guidance for sustainable and profitable agriculture that benefits both communities and the environment.' 
                    : 'تمكين المزارعين بالمعرفة المتطورة والتكنولوجيا المبتكرة والإرشاد المخصص للزراعة المستدامة والمربحة التي تفيد المجتمعات والبيئة.'}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  {language === 'en' ? 'Our Vision' : 'رؤيتنا'}
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {language === 'en'
                    ? 'To be the leading agricultural consultancy platform in the Middle East, bridging the gap between traditional farming wisdom and modern agricultural innovations.'
                    : 'أن نكون المنصة الاستشارية الزراعية الرائدة في الشرق الأوسط، ونسد الفجوة بين حكمة الزراعة التقليدية والابتكارات الزراعية الحديثة.'}
                </p>
              </div>
            </div>
            <div className={`${language === 'ar' ? 'order-1' : 'order-2'}`}>
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Modern Agriculture" 
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">
              {language === 'en' ? 'Meet Our Expert Team' : 'تعرف على فريقنا الخبير'}
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              {language === 'en' 
                ? 'Our team of agricultural experts brings decades of combined experience in various agricultural disciplines.' 
                : 'يجمع فريقنا من الخبراء الزراعيين عقودًا من الخبرة المشتركة في مختلف التخصصات الزراعية.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {team.map((member, index) => {
              const memberRef = useScrollAnimation();
              return (
                <div key={index} ref={memberRef}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name[language as keyof typeof member.name]} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {member.name[language as keyof typeof member.name]}
                      </h3>
                      <p className="text-green-600 font-semibold mb-3">
                        {member.role[language as keyof typeof member.role]}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.bio[language as keyof typeof member.bio]}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {language === 'en' ? 'Our Approach' : 'نهجنا'}
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                {language === 'en' 
                  ? 'We combine scientific research, practical experience, and cutting-edge technology to deliver comprehensive agricultural solutions.' 
                  : 'نجمع بين البحث العلمي والخبرة العملية والتكنولوجيا المتطورة لتقديم حلول زراعية شاملة.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🔬
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {language === 'en' ? 'Research Based' : 'مبني على البحث'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'All our recommendations are backed by the latest scientific research and field testing.' 
                    : 'جميع توصياتنا مدعومة بأحدث البحوث العلمية والاختبارات الميدانية.'}
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🌱
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {language === 'en' ? 'Sustainable Focus' : 'تركيز مستدام'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'We balance productivity with environmental responsibility in all our practices.' 
                    : 'نوازن بين الإنتاجية والمسؤولية البيئية في جميع ممارساتنا.'}
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🌍
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {language === 'en' ? 'Locally Adapted' : 'متكيف محليًا'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'We customize our solutions to suit regional climates, soil types, and farming traditions.' 
                    : 'نخصص حلولنا لتناسب المناخات الإقليمية وأنواع التربة وتقاليد الزراعة.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
