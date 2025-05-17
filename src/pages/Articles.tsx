import React from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, FileText, Dog, Leaf, Tractor } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// سيتم استبدال هذا بيانات حقيقية من واجهة برمجة التطبيقات
const articlesData = [
  {
    id: '1',
    title: {
      en: 'Modern Irrigation Techniques for Sustainable Farming',
      ar: 'تقنيات الري الحديثة للزراعة المستدامة'
    },
    summary: {
      en: 'Discover the latest irrigation methods that conserve water while maximizing crop yield.',
      ar: 'اكتشف أحدث طرق الري التي توفر المياه وتزيد من إنتاجية المحاصيل.'
    },
    date: {
      en: 'May 15, 2023',
      ar: '١٥ مايو ٢٠٢٣'
    },
    category: 'crop',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: '2',
    title: {
      en: 'Livestock Health: Prevention and Treatment of Common Diseases',
      ar: 'صحة الماشية: الوقاية وعلاج الأمراض الشائعة'
    },
    summary: {
      en: 'A comprehensive guide to keeping your livestock healthy through preventative care and early disease detection.',
      ar: 'دليل شامل للحفاظ على صحة ماشيتك من خلال الرعاية الوقائية والكشف المبكر عن الأمراض.'
    },
    date: {
      en: 'April 22, 2023',
      ar: '٢٢ أبريل ٢٠٢٣'
    },
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: <Dog className="w-6 h-6" />
  },
  {
    id: '3',
    title: {
      en: 'Soil Testing: The Foundation of Successful Farming',
      ar: 'اختبار التربة: أساس الزراعة الناجحة'
    },
    summary: {
      en: 'Learn why regular soil testing is critical and how to interpret test results for optimal fertilization.',
      ar: 'تعرف على سبب أهمية اختبار التربة المنتظم وكيفية تفسير نتائج الاختبار للتسميد الأمثل.'
    },
    date: {
      en: 'March 10, 2023',
      ar: '١٠ مارس ٢٠٢٣'
    },
    category: 'soil',
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
    icon: <Tractor className="w-6 h-6" />
  },
  {
    id: '4',
    title: {
      en: 'Smart Farming: IoT Applications in Agriculture',
      ar: 'الزراعة الذكية: تطبيقات إنترنت الأشياء في الزراعة'
    },
    summary: {
      en: 'Explore how Internet of Things technology is revolutionizing farm management and productivity.',
      ar: 'استكشف كيف تغير تقنية إنترنت الأشياء من إدارة المزارع وإنتاجيتها.'
    },
    date: {
      en: 'February 5, 2023',
      ar: '٥ فبراير ٢٠٢٣'
    },
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: '5',
    title: {
      en: 'Sustainable Pest Management Strategies',
      ar: 'استراتيجيات مستدامة لإدارة الآفات'
    },
    summary: {
      en: 'Discover eco-friendly approaches to control pests and protect your crops without harmful chemicals.',
      ar: 'اكتشف طرق صديقة للبيئة للسيطرة على الآفات وحماية محاصيلك دون مواد كيميائية ضارة.'
    },
    date: {
      en: 'January 18, 2023',
      ar: '١٨ يناير ٢٠٢٣'
    },
    category: 'crop',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: '6',
    title: {
      en: 'Efficient Water Management for Desert Agriculture',
      ar: 'إدارة المياه بكفاءة للزراعة في الصحراء'
    },
    summary: {
      en: 'Innovative techniques for growing crops in arid regions with minimal water resources.',
      ar: 'تقنيات مبتكرة لزراعة المحاصيل في المناطق القاحلة مع موارد مائية محدودة.'
    },
    date: {
      en: 'December 3, 2022',
      ar: '٣ ديسمبر ٢٠٢٢'
    },
    category: 'soil',
    image: 'https://images.unsplash.com/photo-1551976796-c25191af0ffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    icon: <Tractor className="w-6 h-6" />
  },
  {
    id: '7',
    title: {
      en: 'Animal Nutrition: Essential Diet for Healthy Livestock',
      ar: 'تغذية الحيوان: النظام الغذائي الأساسي للماشية الصحية'
    },
    summary: {
      en: 'Learn about proper nutrition for different livestock animals to improve health and productivity.',
      ar: 'تعرف على التغذية المناسبة لمختلف حيوانات المزرعة لتحسين الصحة والإنتاجية.'
    },
    date: {
      en: 'November 12, 2022',
      ar: '١٢ نوفمبر ٢٠٢٢'
    },
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y293JTIwZmVlZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    icon: <Dog className="w-6 h-6" />
  },
  {
    id: '8',
    title: {
      en: 'Breeding Techniques for Livestock Improvement',
      ar: 'تقنيات التربية لتحسين الماشية'
    },
    summary: {
      en: 'Explore modern breeding methods to enhance livestock genetics and improve production traits.',
      ar: 'استكشف طرق التربية الحديثة لتعزيز وراثة الماشية وتحسين سمات الإنتاج.'
    },
    date: {
      en: 'October 5, 2022',
      ar: '٥ أكتوبر ٢٠٢٢'
    },
    category: 'livestock',
    image: 'https://images.unsplash.com/photo-1516222338250-863216ce01ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y293fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    icon: <Dog className="w-6 h-6" />
  }
];

const Articles = () => {
  const { language, t } = useLanguage();
  const titleRef = useScrollAnimation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  
  const categories = [
    { id: 'all', name: { en: 'All Articles', ar: 'كل المقالات' } },
    { id: 'crop', name: { en: 'Crop Care', ar: 'رعاية المحاصيل' } },
    { id: 'livestock', name: { en: 'Livestock', ar: 'الثروة الحيوانية' } },
    { id: 'soil', name: { en: 'Soil Analysis', ar: 'تحليل التربة' } },
    { id: 'tech', name: { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' } },
  ];
  
  // تصفية المقالات حسب البحث والفئة
  const filteredArticles = articlesData.filter(article => {
    const matchesSearch = article.title[language as 'en' | 'ar'].toLowerCase().includes(searchTerm.toLowerCase()) || 
                        article.summary[language as 'en' | 'ar'].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('content.articles.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Discover the latest knowledge and insights in agricultural science and practices.' 
                : 'اكتشف أحدث المعارف والرؤى في العلوم والممارسات الزراعية.'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                placeholder={language === 'en' ? 'Search articles...' : 'البحث في المقالات...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={selectedCategory === category.id ? "bg-agri hover:bg-agri-dark" : ""}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name[language as 'en' | 'ar']}
                </Button>
              ))}
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title[language as 'en' | 'ar']}
                  summary={article.summary[language as 'en' | 'ar']}
                  image={article.image}
                  date={article.date[language as 'en' | 'ar']}
                  link={`/content/articles/${article.id}`}
                  icon={article.icon}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                {language === 'en' 
                  ? 'No articles found. Try adjusting your search.' 
                  : 'لم يتم العثور على مقالات. حاول تعديل البحث.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
