
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ArticleCard from '@/components/ArticleCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, FileText, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const AnimalArticles = () => {
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const animalCategories = [
    'livestock', 'animal-nutrition', 'veterinary', 'dairy-farming', 
    'poultry', 'animal-breeding', 'animal-health', 'pasture-management'
  ];

  const fetchAnimalArticles = async () => {
    try {
      setLoading(true);
      
      const { data: articlesData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .in('category', animalCategories)
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      setArticles(articlesData || []);
    } catch (err) {
      console.error('Error fetching animal articles:', err);
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
    fetchAnimalArticles();
  }, []);

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: { en: string; ar: string } } = {
      'livestock': { en: 'Livestock Care', ar: 'رعاية الماشية' },
      'animal-nutrition': { en: 'Animal Nutrition', ar: 'تغذية الحيوانات' },
      'veterinary': { en: 'Veterinary Care', ar: 'الرعاية البيطرية' },
      'dairy-farming': { en: 'Dairy Farming', ar: 'تربية الألبان' },
      'poultry': { en: 'Poultry Management', ar: 'إدارة الدواجن' },
      'animal-breeding': { en: 'Animal Breeding', ar: 'تربية الحيوانات' },
      'animal-health': { en: 'Animal Health', ar: 'صحة الحيوانات' },
      'pasture-management': { en: 'Pasture Management', ar: 'إدارة المراعي' }
    };
    
    return categories[category]?.[language as 'en' | 'ar'] || category;
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'en' ? 'Animal Care Articles' : 'مقالات الرعاية الحيوانية'}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Expert guidance on livestock management, animal health, and veterinary care.' 
                : 'إرشادات الخبراء في إدارة الماشية وصحة الحيوانات والرعاية البيطرية.'}
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
                placeholder={language === 'en' ? 'Search animal articles...' : 'البحث في المقالات الحيوانية...'}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                  image={article.image_url || 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'}
                  date={formatDate(article.published_at || article.created_at)}
                  link={`/content/articles/${article.id}`}
                  icon={<span className="text-xl">🐄</span>}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                {language === 'en' 
                  ? 'No animal articles found. Try adjusting your search.' 
                  : 'لم يتم العثور على مقالات حيوانية. حاول تعديل البحث.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AnimalArticles;
