
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LivestockService = () => {
  const { language, t } = useLanguage();
  const titleRef = useScrollAnimation();
  const contentRef = useScrollAnimation();
  
  const livestockImage = 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80';
  
  const services = [
    {
      title: language === 'en' ? 'Animal Health Management' : 'إدارة صحة الحيوان',
      description: language === 'en' 
        ? 'Comprehensive health monitoring, disease prevention, vaccination programs, and treatment plans for all types of livestock.' 
        : 'مراقبة صحية شاملة، والوقاية من الأمراض، وبرامج التطعيم، وخطط العلاج لجميع أنواع الماشية.',
      icon: '🩺'
    },
    {
      title: language === 'en' ? 'Breeding and Genetics' : 'التربية والوراثة',
      description: language === 'en' 
        ? 'Expert advice on breeding programs, genetic selection, artificial insemination, and embryo transfer to improve herd quality.' 
        : 'نصائح الخبراء حول برامج التربية، والاختيار الجيني، والتلقيح الاصطناعي، ونقل الأجنة لتحسين جودة القطيع.',
      icon: '🧬'
    },
    {
      title: language === 'en' ? 'Nutrition and Feed Management' : 'التغذية وإدارة العلف',
      description: language === 'en' 
        ? 'Customized feeding programs, ration formulation, feed quality assessment, and nutritional problem solving for optimal performance.' 
        : 'برامج تغذية مخصصة، وتركيب الحصص، وتقييم جودة العلف، وحل مشاكل التغذية للحصول على الأداء الأمثل.',
      icon: '🌾'
    },
    {
      title: language === 'en' ? 'Housing and Infrastructure' : 'الإسكان والبنية التحتية',
      description: language === 'en' 
        ? 'Design and implementation of efficient housing systems, ventilation, waste management, and handling facilities.' 
        : 'تصميم وتنفيذ أنظمة إسكان فعالة، والتهوية، وإدارة النفايات، ومرافق التعامل.',
      icon: '🏚️'
    },
    {
      title: language === 'en' ? 'Production Analysis and Optimization' : 'تحليل وتحسين الإنتاج',
      description: language === 'en' 
        ? 'Performance tracking, benchmark comparison, data analysis, and strategies to increase productivity and profitability.' 
        : 'تتبع الأداء، ومقارنة المعايير، وتحليل البيانات، واستراتيجيات زيادة الإنتاجية والربحية.',
      icon: '📈'
    },
    {
      title: language === 'en' ? 'Regulatory Compliance' : 'الامتثال التنظيمي',
      description: language === 'en' 
        ? 'Guidance on meeting local and international standards, certification requirements, and documentation processes.' 
        : 'التوجيه بشأن تلبية المعايير المحلية والدولية، ومتطلبات الشهادات، وعمليات التوثيق.',
      icon: '📋'
    }
  ];
  
  const testimonials = [
    {
      quote: language === 'en' 
        ? "The livestock management consultancy transformed my dairy farm. Milk production increased by 20% in just six months following their recommendations." 
        : 'حولت استشارات إدارة الثروة الحيوانية مزرعة الألبان الخاصة بي. زاد إنتاج الحليب بنسبة 20٪ في ستة أشهر فقط بعد توصياتهم.',
      name: language === 'en' ? 'Mohammad Al-Harbi' : 'محمد الحربي',
      farm: language === 'en' ? 'Al-Baraka Dairy Farm' : 'مزرعة البركة للألبان'
    },
    {
      quote: language === 'en' 
        ? "Their breeding program advice has significantly improved the genetics of my cattle herd. The calves are healthier and grow faster than before." 
        : 'لقد حسنت نصائح برنامج التربية الخاص بهم بشكل كبير من الوراثة في قطيع الأبقار لدي. العجول أكثر صحة وتنمو بشكل أسرع من ذي قبل.',
      name: language === 'en' ? 'Fatima Al-Qassim' : 'فاطمة القاسم',
      farm: language === 'en' ? 'Green Valley Ranch' : 'مزرعة الوادي الأخضر'
    }
  ];
  
  const expertTeam = [
    {
      name: language === 'en' ? 'Dr. Khalid Al-Abri' : 'د. خالد العبري',
      title: language === 'en' ? 'Veterinary Specialist' : 'أخصائي بيطري',
      description: language === 'en'
        ? 'Specializes in large animal medicine with over 15 years of experience in livestock health management.'
        : 'متخصص في طب الحيوانات الكبيرة مع أكثر من 15 عامًا من الخبرة في إدارة صحة الماشية.'
    },
    {
      name: language === 'en' ? 'Dr. Noura Al-Otaibi' : 'د. نورة العتيبي',
      title: language === 'en' ? 'Animal Nutrition Expert' : 'خبيرة تغذية الحيوان',
      description: language === 'en'
        ? 'PhD in Animal Nutrition with expertise in formulating balanced diets for optimal livestock productivity.'
        : 'دكتوراه في تغذية الحيوان مع خبرة في صياغة نظم غذائية متوازنة لإنتاجية مثلى للماشية.'
    },
    {
      name: language === 'en' ? 'Eng. Sami Al-Rashid' : 'م. سامي الرشيد',
      title: language === 'en' ? 'Livestock Infrastructure Engineer' : 'مهندس بنية تحتية للماشية',
      description: language === 'en'
        ? 'Specializes in designing efficient housing and handling systems for all types of livestock operations.'
        : 'متخصص في تصميم أنظمة إسكان ومعالجة فعالة لجميع أنواع عمليات الماشية.'
    }
  ];

  return (
    <Layout>
      {/* قسم الترويسة */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${livestockImage})` }}>
        <div className="container mx-auto px-4 text-white text-center" ref={titleRef}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('services.livestock.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            {t('services.livestock.description')}
          </p>
          <Button asChild size="lg" className="bg-agri hover:bg-agri-dark">
            <Link to="/book">{t('nav.book')}</Link>
          </Button>
        </div>
      </section>

      {/* نظرة عامة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center" ref={contentRef}>
            <h2 className="text-3xl font-bold mb-6">
              {language === 'en' ? 'Comprehensive Livestock Management Services' : 'خدمات شاملة لإدارة الثروة الحيوانية'}
            </h2>
            <p className="text-lg mb-6">
              {language === 'en' 
                ? 'Our team of livestock specialists provides expert consultation for all aspects of animal husbandry, from health management and nutrition to breeding and infrastructure planning.' 
                : 'يقدم فريقنا من المتخصصين في الثروة الحيوانية استشارات خبيرة لجميع جوانب تربية الحيوانات، من إدارة الصحة والتغذية إلى التربية وتخطيط البنية التحتية.'}
            </p>
            <p className="text-lg">
              {language === 'en'
                ? 'Whether you operate a small family farm or a large commercial enterprise, our customized solutions will help optimize your livestock productivity, health, and profitability.'
                : 'سواء كنت تدير مزرعة عائلية صغيرة أو مؤسسة تجارية كبيرة، ستساعدك حلولنا المخصصة على تحسين إنتاجية ماشيتك وصحتها وربحيتها.'}
            </p>
          </div>
        </div>
      </section>

      {/* خدماتنا */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Our Livestock Services' : 'خدمات الثروة الحيوانية لدينا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const cardRef = useScrollAnimation();
              return (
                <div ref={cardRef} key={index}>
                  <Card className="h-full">
                    <CardHeader>
                      <div className="text-4xl mb-4">{service.icon}</div>
                      <CardTitle>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* الفوائد */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              {language === 'en' ? 'Benefits of Our Livestock Consultancy' : 'فوائد استشارات الثروة الحيوانية لدينا'}
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 rtl:ml-4 rtl:mr-0 text-agri text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'en' ? 'Improved Animal Health and Welfare' : 'تحسين صحة ورفاهية الحيوان'}
                  </h3>
                  <p>
                    {language === 'en'
                      ? 'Lower disease incidence, reduced mortality rates, and better overall animal welfare through preventative health programs.'
                      : 'انخفاض معدل حدوث الأمراض، وتقليل معدلات النفوق، وتحسين الرفاهية العامة للحيوان من خلال برامج الصحة الوقائية.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 rtl:ml-4 rtl:mr-0 text-agri text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'en' ? 'Enhanced Productivity' : 'تعزيز الإنتاجية'}
                  </h3>
                  <p>
                    {language === 'en'
                      ? 'Increased growth rates, better feed conversion, higher milk production, and improved reproductive performance.'
                      : 'زيادة معدلات النمو، وتحسين تحويل الأعلاف، وزيادة إنتاج الحليب، وتحسين الأداء التناسلي.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 rtl:ml-4 rtl:mr-0 text-agri text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'en' ? 'Cost Optimization' : 'تحسين التكلفة'}
                  </h3>
                  <p>
                    {language === 'en'
                      ? 'Reduced veterinary expenses, optimized feed costs, and more efficient use of labor and resources.'
                      : 'تقليل النفقات البيطرية، وتحسين تكاليف الأعلاف، واستخدام أكثر كفاءة للعمالة والموارد.'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 rtl:ml-4 rtl:mr-0 text-agri text-xl">✓</div>
                <div>
                  <h3 className="font-bold text-lg">
                    {language === 'en' ? 'Sustainable Practices' : 'ممارسات مستدامة'}
                  </h3>
                  <p>
                    {language === 'en'
                      ? 'Environmentally responsible management strategies that comply with regulations and enhance farm sustainability.'
                      : 'استراتيجيات إدارة مسؤولة بيئيًا تتوافق مع اللوائح وتعزز استدامة المزرعة.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* شهادات العملاء */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'What Our Clients Say' : 'ماذا يقول عملاؤنا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => {
              const cardRef = useScrollAnimation();
              return (
                <div ref={cardRef} key={index}>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="text-4xl text-agri mb-4">"</div>
                      <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.farm}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* فريق الخبراء */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Our Expert Team' : 'فريق الخبراء لدينا'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertTeam.map((expert, index) => {
              const cardRef = useScrollAnimation();
              return (
                <div ref={cardRef} key={index}>
                  <Card className="h-full">
                    <CardHeader className="text-center">
                      <div className="w-24 h-24 rounded-full bg-agri-light mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                        {expert.name.charAt(0)}
                      </div>
                      <CardTitle>{expert.name}</CardTitle>
                      <CardDescription className="text-base font-medium">
                        {expert.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p>{expert.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-agri text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {language === 'en' ? 'Ready to Improve Your Livestock Operation?' : 'هل أنت مستعد لتحسين عملية الثروة الحيوانية الخاصة بك؟'}
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            {language === 'en'
              ? 'Schedule a consultation with our livestock specialists to discuss your specific needs and challenges.'
              : 'جدول استشارة مع متخصصي الثروة الحيوانية لدينا لمناقشة احتياجاتك وتحدياتك المحددة.'}
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-agri">
            <Link to="/book">{t('book.button')}</Link>
          </Button>
        </div>
      </section>

      {/* الأسئلة الشائعة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en'
                    ? 'How often should I schedule livestock health consultations?'
                    : 'ما هو عدد المرات التي يجب أن أجدول فيها استشارات صحة الماشية؟'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {language === 'en'
                    ? 'We recommend quarterly consultations for routine health management, with additional visits during critical periods such as breeding seasons or disease outbreaks. However, the frequency can be adjusted based on your specific operation and needs.'
                    : 'نوصي بإجراء استشارات ربع سنوية للإدارة الصحية الروتينية، مع زيارات إضافية خلال الفترات الحرجة مثل مواسم التربية أو تفشي الأمراض. ومع ذلك، يمكن تعديل التكرار بناءً على عملية واحتياجاتك المحددة.'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en'
                    ? 'Do you offer emergency veterinary services?'
                    : 'هل تقدمون خدمات بيطرية طارئة؟'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {language === 'en'
                    ? 'Yes, we provide emergency consultation services for our clients. Our team of veterinarians is available 24/7 for urgent situations, and we can coordinate with local veterinary clinics when necessary.'
                    : 'نعم، نقدم خدمات استشارية طارئة لعملائنا. فريق الأطباء البيطريين لدينا متاح على مدار الساعة طوال أيام الأسبوع للحالات العاجلة، ويمكننا التنسيق مع العيادات البيطرية المحلية عند الضرورة.'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en'
                    ? 'Can you help with regulatory compliance and certifications?'
                    : 'هل يمكنكم المساعدة في الامتثال التنظيمي والشهادات؟'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {language === 'en'
                    ? 'Absolutely. Our team stays current with local and international regulations affecting livestock operations. We can guide you through compliance requirements, help prepare for inspections, and assist with certification processes for various standards and quality assurance programs.'
                    : 'بالتأكيد. يظل فريقنا على اطلاع دائم باللوائح المحلية والدولية التي تؤثر على عمليات الثروة الحيوانية. يمكننا إرشادك خلال متطلبات الامتثال، والمساعدة في التحضير للتفتيش، والمساعدة في عمليات الحصول على الشهادات لمختلف المعايير وبرامج ضمان الجودة.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* مقالات ذات صلة */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Related Articles' : 'مقالات ذات صلة'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/content/articles/2" className="no-underline">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt={language === 'en' ? 'Livestock Health' : 'صحة الماشية'} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    {language === 'en' 
                      ? 'Livestock Health: Prevention and Treatment of Common Diseases' 
                      : 'صحة الماشية: الوقاية وعلاج الأمراض الشائعة'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3">
                    {language === 'en'
                      ? 'A comprehensive guide to keeping your livestock healthy through preventative care and early disease detection.'
                      : 'دليل شامل للحفاظ على صحة ماشيتك من خلال الرعاية الوقائية والكشف المبكر عن الأمراض.'}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/content/articles">
              <div className="h-full flex items-center justify-center px-6">
                <Button className="text-agri hover:text-agri-dark">
                  {language === 'en' ? 'View More Articles' : 'عرض المزيد من المقالات'}
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LivestockService;
