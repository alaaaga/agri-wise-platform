
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ArticleCard from '../ArticleCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Placeholder images - would use actual images in production
import cropImage from '../../assets/crop.jpg';
import livestockImage from '../../assets/livestock.jpg';
import soilImage from '../../assets/soil.jpg';

const ArticlesSection = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  
  const articles = [
    {
      title: language === 'en' ? 'Modern Irrigation Techniques for Sustainable Farming' : 'تقنيات الري الحديثة للزراعة المستدامة',
      summary: language === 'en' 
        ? 'Discover the latest irrigation methods that conserve water while maximizing crop yield.' 
        : 'اكتشف أحدث طرق الري التي توفر المياه وتزيد من إنتاجية المحاصيل.',
      image: cropImage,
      date: language === 'en' ? 'May 15, 2023' : '١٥ مايو ٢٠٢٣',
      link: '/content/articles/modern-irrigation'
    },
    {
      title: language === 'en' ? 'Livestock Health: Prevention and Treatment of Common Diseases' : 'صحة الماشية: الوقاية وعلاج الأمراض الشائعة',
      summary: language === 'en'
        ? 'A comprehensive guide to keeping your livestock healthy through preventative care and early disease detection.'
        : 'دليل شامل للحفاظ على صحة ماشيتك من خلال الرعاية الوقائية والكشف المبكر عن الأمراض.',
      image: livestockImage,
      date: language === 'en' ? 'April 22, 2023' : '٢٢ أبريل ٢٠٢٣',
      link: '/content/articles/livestock-health'
    },
    {
      title: language === 'en' ? 'Soil Testing: The Foundation of Successful Farming' : 'اختبار التربة: أساس الزراعة الناجحة',
      summary: language === 'en'
        ? 'Learn why regular soil testing is critical and how to interpret test results for optimal fertilization.'
        : 'تعرف على سبب أهمية اختبار التربة المنتظم وكيفية تفسير نتائج الاختبار للتسميد الأمثل.',
      image: soilImage,
      date: language === 'en' ? 'March 10, 2023' : '١٠ مارس ٢٠٢٣',
      link: '/content/articles/soil-testing'
    }
  ];

  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.articles.title')}</h2>
          <div className="w-24 h-1 bg-agri mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              summary={article.summary}
              image={article.image}
              date={article.date}
              link={article.link}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/content/articles">
            <Button variant="outline" className="border-agri text-agri hover:bg-agri hover:text-white">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
