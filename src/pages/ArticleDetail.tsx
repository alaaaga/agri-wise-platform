
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// سيتم استبدال هذا بيانات حقيقية من واجهة برمجة التطبيقات
const articlesData = {
  '1': {
    title: {
      en: 'Modern Irrigation Techniques for Sustainable Farming',
      ar: 'تقنيات الري الحديثة للزراعة المستدامة'
    },
    content: {
      en: `
        <p>Water scarcity is becoming an increasingly pressing issue in agriculture worldwide. With climate change affecting rainfall patterns and growing population demands, farmers must adopt more efficient irrigation methods to ensure sustainable production.</p>
        
        <h2>Drip Irrigation Systems</h2>
        <p>Drip irrigation is one of the most efficient water delivery methods available. By delivering water directly to the plant's root zone, drip systems can reduce water usage by up to 60% compared to traditional flooding methods. Additionally, these systems can be automated and paired with soil moisture sensors to deliver water only when needed.</p>
        
        <h2>Precision Sprinklers</h2>
        <p>Modern sprinkler systems have evolved significantly from their predecessors. Today's precision sprinklers can be programmed to deliver specific amounts of water to different zones in a field based on crop needs, soil conditions, and topography. This level of control minimizes runoff and evaporation while ensuring optimal plant growth.</p>
        
        <h2>Subsurface Irrigation</h2>
        <p>Subsurface drip irrigation (SDI) takes water conservation even further by placing irrigation lines below ground, directly in the root zone. This method virtually eliminates evaporation losses and can reduce weed growth since the soil surface remains dry. While installation costs are higher, many farmers find the water savings and yield improvements justify the investment.</p>
        
        <h2>Smart Irrigation Controllers</h2>
        <p>The integration of IoT technology has revolutionized irrigation management. Smart controllers can access weather forecasts, analyze soil moisture data, and adjust watering schedules automatically. Some advanced systems even incorporate satellite or drone imagery to detect crop stress and apply water precisely where needed.</p>
        
        <h2>Conclusion</h2>
        <p>Adopting modern irrigation technologies is no longer optional for farmers facing water constraints. The initial investment in these systems typically pays for itself through water savings, reduced labor costs, and improved crop yields. As technology continues to advance, we can expect even more efficient irrigation solutions to help address global food security challenges in a water-scarce world.</p>
      `,
      ar: `
        <p>أصبحت ندرة المياه مشكلة متزايدة الأهمية في الزراعة في جميع أنحاء العالم. مع تأثير تغير المناخ على أنماط هطول الأمطار وتزايد متطلبات السكان، يجب على المزارعين اعتماد طرق ري أكثر كفاءة لضمان الإنتاج المستدام.</p>
        
        <h2>أنظمة الري بالتنقيط</h2>
        <p>يعد الري بالتنقيط أحد أكثر طرق توصيل المياه كفاءة المتاحة. من خلال توصيل المياه مباشرة إلى منطقة جذور النبات، يمكن لأنظمة التنقيط تقليل استخدام المياه بنسبة تصل إلى 60٪ مقارنة بطرق الغمر التقليدية. بالإضافة إلى ذلك، يمكن أتمتة هذه الأنظمة وإقرانها بأجهزة استشعار رطوبة التربة لتوصيل المياه فقط عند الحاجة.</p>
        
        <h2>رشاشات الدقة</h2>
        <p>تطورت أنظمة الرش الحديثة بشكل كبير عن أسلافها. يمكن برمجة رشاشات الدقة اليوم لتوصيل كميات محددة من المياه إلى مناطق مختلفة في حقل بناءً على احتياجات المحاصيل وظروف التربة والطبوغرافيا. يقلل هذا المستوى من التحكم من الجريان السطحي والتبخر مع ضمان النمو الأمثل للنبات.</p>
        
        <h2>الري تحت السطحي</h2>
        <p>يأخذ الري بالتنقيط تحت السطح (SDI) الحفاظ على المياه إلى أبعد من ذلك من خلال وضع خطوط الري تحت الأرض، مباشرة في منطقة الجذر. تقضي هذه الطريقة عمليًا على خسائر التبخر ويمكن أن تقلل من نمو الأعشاب الضارة لأن سطح التربة يظل جافًا. على الرغم من ارتفاع تكاليف التركيب، إلا أن العديد من المزارعين يجدون أن توفير المياه وتحسين الغلة يبرران الاستثمار.</p>
        
        <h2>وحدات تحكم الري الذكية</h2>
        <p>أحدث دمج تكنولوجيا إنترنت الأشياء ثورة في إدارة الري. يمكن لوحدات التحكم الذكية الوصول إلى توقعات الطقس، وتحليل بيانات رطوبة التربة، وضبط جداول الري تلقائيًا. تتضمن بعض الأنظمة المتقدمة حتى صور الأقمار الصناعية أو الطائرات بدون طيار لاكتشاف إجهاد المحاصيل وتطبيق المياه بدقة حيث تكون هناك حاجة إليها.</p>
        
        <h2>الخلاصة</h2>
        <p>لم يعد اعتماد تقنيات الري الحديثة اختياريًا للمزارعين الذين يواجهون قيودًا على المياه. عادة ما يدفع الاستثمار الأولي في هذه الأنظمة ثمنه من خلال توفير المياه، وانخفاض تكاليف العمالة، وتحسين غلة المحاصيل. مع استمرار تقدم التكنولوجيا، يمكننا أن نتوقع حلول ري أكثر كفاءة للمساعدة في معالجة تحديات الأمن الغذائي العالمي في عالم يعاني من ندرة المياه.</p>
      `
    },
    author: {
      en: 'Dr. Ahmed Al-Mansour',
      ar: 'د. أحمد المنصور'
    },
    date: {
      en: 'May 15, 2023',
      ar: '١٥ مايو ٢٠٢٣'
    },
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    category: {
      en: 'Crop Care',
      ar: 'رعاية المحاصيل'
    }
  },
  
  '2': {
    title: {
      en: 'Livestock Health: Prevention and Treatment of Common Diseases',
      ar: 'صحة الماشية: الوقاية وعلاج الأمراض الشائعة'
    },
    content: {
      en: `
        <p>Maintaining livestock health is crucial for productivity and profitability in any agricultural operation. Prevention is always better than treatment, and understanding common diseases can help farmers take proactive measures to protect their animals.</p>
        
        <h2>Preventative Health Practices</h2>
        <p>Implementing a comprehensive vaccination program is the foundation of livestock disease prevention. Work with a veterinarian to develop a schedule appropriate for your region and specific disease risks. Regular health checks, proper nutrition, and clean housing are equally important in preventing disease outbreaks.</p>
        
        <h2>Common Cattle Diseases and Prevention</h2>
        <p>Bovine Respiratory Disease (BRD) remains one of the most significant health challenges for cattle producers worldwide. Early vaccination, stress reduction during transportation and handling, and proper ventilation in housing facilities can significantly reduce BRD incidence. Other common conditions like mastitis can be prevented through proper milking hygiene and regular udder health monitoring.</p>
        
        <h2>Sheep and Goat Health Management</h2>
        <p>Small ruminants are susceptible to internal parasites, which can cause significant production losses if not properly managed. Strategic deworming programs, rotational grazing, and selective breeding for parasite resistance can help control these issues. Vaccines for clostridial diseases are also essential for sheep and goat health management.</p>
        
        <h2>Biosecurity Measures</h2>
        <p>Implementing strict biosecurity protocols is essential for preventing disease introduction and spread. This includes isolating new animals before introducing them to the herd, controlling visitor access, properly disposing of dead animals, and disinfecting equipment and vehicles that move between farms.</p>
        
        <h2>Early Disease Detection</h2>
        <p>Recognizing the early signs of illness allows for prompt treatment and better outcomes. Train farm staff to observe animals daily for changes in behavior, appetite, water consumption, and physical appearance. Modern technology like automated health monitoring systems can provide early warnings of potential health issues.</p>
        
        <h2>Conclusion</h2>
        <p>Investing in preventative health practices yields significant returns through improved productivity and reduced treatment costs. By focusing on nutrition, vaccination, biosecurity, and early detection, farmers can maintain healthier livestock and more profitable operations.</p>
      `,
      ar: `
        <p>الحفاظ على صحة الماشية أمر بالغ الأهمية للإنتاجية والربحية في أي عملية زراعية. الوقاية دائمًا أفضل من العلاج، وفهم الأمراض الشائعة يمكن أن يساعد المزارعين في اتخاذ تدابير استباقية لحماية حيواناتهم.</p>
        
        <h2>ممارسات الصحة الوقائية</h2>
        <p>يعد تنفيذ برنامج تطعيم شامل أساس الوقاية من أمراض الماشية. اعمل مع طبيب بيطري لتطوير جدول مناسب لمنطقتك ومخاطر الأمراض المحددة. الفحوصات الصحية المنتظمة والتغذية المناسبة والسكن النظيف لها نفس القدر من الأهمية في منع تفشي الأمراض.</p>
        
        <h2>أمراض الأبقار الشائعة والوقاية منها</h2>
        <p>لا يزال مرض الجهاز التنفسي البقري (BRD) أحد أكبر التحديات الصحية لمنتجي الأبقار في جميع أنحاء العالم. يمكن أن يؤدي التطعيم المبكر، وتقليل الإجهاد أثناء النقل والمناولة، والتهوية المناسبة في مرافق الإسكان إلى تقليل حدوث BRD بشكل كبير. يمكن الوقاية من حالات شائعة أخرى مثل التهاب الضرع من خلال نظافة الحلب المناسبة والمراقبة المنتظمة لصحة الضرع.</p>
        
        <h2>إدارة صحة الأغنام والماعز</h2>
        <p>المجترات الصغيرة معرضة للطفيليات الداخلية، والتي يمكن أن تسبب خسائر كبيرة في الإنتاج إذا لم تتم إدارتها بشكل صحيح. يمكن أن تساعد برامج إزالة الديدان الاستراتيجية، والرعي الدوراني، والتربية الانتقائية لمقاومة الطفيليات في السيطرة على هذه المشكلات. تعتبر اللقاحات ضد أمراض المطثية ضرورية أيضًا لإدارة صحة الأغنام والماعز.</p>
        
        <h2>تدابير الأمن البيولوجي</h2>
        <p>يعد تنفيذ بروتوكولات صارمة للأمن البيولوجي أمرًا ضروريًا لمنع إدخال الأمراض وانتشارها. يتضمن ذلك عزل الحيوانات الجديدة قبل إدخالها إلى القطيع، والتحكم في وصول الزوار، والتخلص السليم من الحيوانات النافقة، وتطهير المعدات والمركبات التي تنتقل بين المزارع.</p>
        
        <h2>الكشف المبكر عن الأمراض</h2>
        <p>يتيح التعرف على العلامات المبكرة للمرض العلاج الفوري ونتائج أفضل. قم بتدريب العاملين في المزرعة على مراقبة الحيوانات يوميًا للتغيرات في السلوك والشهية واستهلاك الماء والمظهر الجسدي. يمكن للتكنولوجيا الحديثة مثل أنظمة المراقبة الصحية الآلية أن توفر إنذارات مبكرة بمشاكل صحية محتملة.</p>
        
        <h2>الخلاصة</h2>
        <p>يؤدي الاستثمار في ممارسات الصحة الوقائية إلى عائدات كبيرة من خلال تحسين الإنتاجية وتقليل تكاليف العلاج. من خلال التركيز على التغذية والتطعيم والأمن البيولوجي والكشف المبكر، يمكن للمزارعين الحفاظ على ماشية أكثر صحة وعمليات أكثر ربحية.</p>
      `
    },
    author: {
      en: 'Dr. Sarah Al-Khalidi',
      ar: 'د. سارة الخالدي'
    },
    date: {
      en: 'April 22, 2023',
      ar: '٢٢ أبريل ٢٠٢٣'
    },
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    category: {
      en: 'Livestock',
      ar: 'الثروة الحيوانية'
    }
  }
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();
  
  const article = id ? articlesData[id as keyof typeof articlesData] : null;
  
  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Article not found' : 'المقال غير موجود'}
          </h1>
          <p className="mb-8">
            {language === 'en' ? 'The article you are looking for does not exist or has been removed.' : 'المقال الذي تبحث عنه غير موجود أو تمت إزالته.'}
          </p>
          <Button asChild>
            <Link to="/content/articles">
              <ArrowLeft className="mr-2" />
              {language === 'en' ? 'Back to Articles' : 'العودة إلى المقالات'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div ref={titleRef} className="relative h-[40vh] min-h-[300px] flex items-end bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url(${article.image})` }}>
        <div className="container mx-auto px-4 pb-8 text-white">
          <div className="flex items-center mb-2">
            <span className="bg-agri text-white text-sm px-3 py-1 rounded-full">
              {article.category[language as 'en' | 'ar']}
            </span>
            <span className="mx-2">•</span>
            <span>{article.date[language as 'en' | 'ar']}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{article.title[language as 'en' | 'ar']}</h1>
          <div className="mt-2">
            {language === 'en' ? 'By ' : 'بواسطة '}{article.author[language as 'en' | 'ar']}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="outline" className="mb-8" asChild>
            <Link to="/content/articles">
              <ArrowLeft className="mr-2" />
              {language === 'en' ? 'Back to Articles' : 'العودة إلى المقالات'}
            </Link>
          </Button>
          
          <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content[language as 'en' | 'ar'] }}></div>
          
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">
              {language === 'en' ? 'About the Author' : 'عن الكاتب'}
            </h3>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-agri-light rounded-full flex items-center justify-center text-white font-bold text-xl">
                {article.author[language as 'en' | 'ar'].charAt(0)}
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <div className="font-semibold text-lg">{article.author[language as 'en' | 'ar']}</div>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Agricultural specialist with expertise in sustainable farming practices and modern agricultural technologies.' 
                    : 'متخصص زراعي ذو خبرة في ممارسات الزراعة المستدامة وتقنيات الزراعة الحديثة.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArticleDetail;
