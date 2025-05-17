
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
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const missionRef = useScrollAnimation();
  
  return (
    <Layout>
      <section className="bg-green-800 text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'About Us' : 'من نحن'}
            </h1>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div ref={missionRef} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 ${language === 'ar' ? 'rtl' : ''}`}>
            <div className={`order-2 ${language === 'ar' ? 'md:order-2' : 'md:order-1'}`}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Our Mission' : 'مهمتنا'}</h2>
                <p className="text-gray-700">
                  {language === 'en' 
                    ? 'Empowering farmers with knowledge and technology for sustainable and profitable agriculture.' 
                    : 'تمكين المزارعين بالمعرفة والتكنولوجيا للزراعة المستدامة والمربحة.'}
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">{language === 'en' ? 'Our Vision' : 'رؤيتنا'}</h2>
                <p className="text-gray-700">
                  {language === 'en'
                    ? 'To be the leading agricultural consultancy platform that combines traditional knowledge with modern innovations.'
                    : 'أن نكون المنصة الاستشارية الزراعية الرائدة التي تجمع بين المعرفة التقليدية والابتكارات الحديثة.'}
                </p>
              </div>
            </div>
            <div className={`order-1 ${language === 'ar' ? 'md:order-1' : 'md:order-2'}`}>
              <img 
                src="https://images.unsplash.com/photo-1620200423727-8127f75d7f6c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybWVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60" 
                alt="Farmer in Field" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{language === 'en' ? 'Our Team' : 'فريقنا'}</h2>
            <div className="w-24 h-1 bg-agri mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => {
              const memberRef = useScrollAnimation();
              return (
                <div key={index} ref={memberRef}>
                  <Card className="h-full overflow-hidden card-hover">
                    <div className="h-64 overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name[language as keyof typeof member.name]} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-1">{member.name[language as keyof typeof member.name]}</h3>
                      <p className="text-agri mb-3">{member.role[language as keyof typeof member.role]}</p>
                      <p className="text-gray-600 text-sm">{member.bio[language as keyof typeof member.bio]}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
          
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">
                {language === 'en' ? 'Our Approach' : 'نهجنا'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🔍
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {language === 'en' ? 'Research Based' : 'مبني على البحث'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'All our recommendations are backed by scientific research and field testing.' 
                    : 'جميع توصياتنا مدعومة بالبحث العلمي والاختبار الميداني.'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ♻️
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {language === 'en' ? 'Sustainable Focus' : 'تركيز مستدام'}
                </h3>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'We balance productivity with environmental responsibility in all our practices.' 
                    : 'نوازن بين الإنتاجية والمسؤولية البيئية في جميع ممارساتنا.'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🌍
                </div>
                <h3 className="text-xl font-bold mb-2">
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
