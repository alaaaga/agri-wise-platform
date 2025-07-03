
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ArticleCard from '../ArticleCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
  published_at: string | null;
}

const ArticlesSection = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLatestArticles = async () => {
    try {
      setLoading(true);
      
      const { data: articlesData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      setArticles(articlesData || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  return (
    <section className="section-padding bg-gray-50 py-16">
      <div className="container mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${language === 'ar' ? 'rtl' : ''}`}>
            {language === 'en' ? 'Latest Articles' : 'أحدث المقالات'}
          </h2>
          <div className="w-24 h-1 bg-agri mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}
            </span>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                summary={article.excerpt || article.content.substring(0, 150) + '...'}
                image={article.image_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'}
                date={formatDate(article.published_at || article.created_at)}
                link={`/content/articles/${article.id}`}
                icon={<FileText className="w-6 h-6" />}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {language === 'en' ? 'No articles available yet.' : 'لا توجد مقالات متاحة حتى الآن.'}
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/content/articles">
            <Button variant="outline" className="border-agri text-agri hover:bg-agri hover:text-white px-8 py-2">
              {language === 'en' ? 'View All' : 'عرض الكل'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
