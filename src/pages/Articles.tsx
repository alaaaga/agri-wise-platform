
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  created_at: string;
  published_at: string | null;
  author_id: string | null;
}

const Articles = () => {
  const { language, t } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { id: 'all', name: { en: 'All Articles', ar: 'كل المقالات' } },
    { id: 'crop', name: { en: 'Crop Care', ar: 'رعاية المحاصيل' } },
    { id: 'livestock', name: { en: 'Livestock', ar: 'الثروة الحيوانية' } },
    { id: 'soil', name: { en: 'Soil Analysis', ar: 'تحليل التربة' } },
    { id: 'tech', name: { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' } },
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      const { data: articlesData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      setArticles(articlesData || []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load articles' : 'فشل في تحميل المقالات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);
  
  // تصفية المقالات حسب البحث والفئة
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

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

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}
              </span>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
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
