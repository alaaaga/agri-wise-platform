
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
  const [selectedType, setSelectedType] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = [
    { id: 'all', name: { en: 'All Articles', ar: 'كل المقالات' }, type: 'all' },
    
    // التصنيفات الزراعية
    { id: 'irrigation', name: { en: 'Irrigation', ar: 'الري' }, type: 'agricultural' },
    { id: 'organic-farming', name: { en: 'Organic Farming', ar: 'الزراعة العضوية' }, type: 'agricultural' },
    { id: 'pest-control', name: { en: 'Pest Control', ar: 'مكافحة الآفات' }, type: 'agricultural' },
    { id: 'sustainability', name: { en: 'Sustainability', ar: 'الاستدامة' }, type: 'agricultural' },
    { id: 'water-management', name: { en: 'Water Management', ar: 'إدارة المياه' }, type: 'agricultural' },
    { id: 'crops', name: { en: 'Crops', ar: 'المحاصيل' }, type: 'agricultural' },
    { id: 'soil', name: { en: 'Soil Analysis', ar: 'تحليل التربة' }, type: 'agricultural' },
    { id: 'technology', name: { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' }, type: 'agricultural' },
    { id: 'seeds', name: { en: 'Seeds & Planting', ar: 'البذور والزراعة' }, type: 'agricultural' },
    { id: 'greenhouse', name: { en: 'Greenhouse Management', ar: 'إدارة البيوت المحمية' }, type: 'agricultural' },
    
    // التصنيفات الحيوانية
    { id: 'livestock', name: { en: 'Livestock Care', ar: 'رعاية الماشية' }, type: 'livestock' },
    { id: 'animal-nutrition', name: { en: 'Animal Nutrition', ar: 'تغذية الحيوانات' }, type: 'livestock' },
    { id: 'veterinary', name: { en: 'Veterinary Care', ar: 'الرعاية البيطرية' }, type: 'livestock' },
    { id: 'dairy-farming', name: { en: 'Dairy Farming', ar: 'تربية الألبان' }, type: 'livestock' },
    { id: 'poultry', name: { en: 'Poultry Management', ar: 'إدارة الدواجن' }, type: 'livestock' },
    { id: 'animal-breeding', name: { en: 'Animal Breeding', ar: 'تربية الحيوانات' }, type: 'livestock' },
    { id: 'animal-health', name: { en: 'Animal Health', ar: 'صحة الحيوانات' }, type: 'livestock' },
    { id: 'pasture-management', name: { en: 'Pasture Management', ar: 'إدارة المراعي' }, type: 'livestock' }
  ];

  const typeFilters = [
    { id: 'all', name: { en: 'All Types', ar: 'كل الأنواع' } },
    { id: 'agricultural', name: { en: 'Agricultural', ar: 'زراعية' } },
    { id: 'livestock', name: { en: 'Livestock', ar: 'حيوانية' } }
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      const { data: articlesData, error } = await query;
      
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
  
  // تصفية المقالات
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    let matchesType = true;
    if (selectedType !== 'all') {
      const category = categories.find(cat => cat.id === article.category);
      matchesType = category?.type === selectedType;
    }
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj?.type === 'livestock' ? '🐄' : '🌱';
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('content.articles.title')}</h1>
            <p className="text-xl max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Discover the latest knowledge and insights in agricultural science and livestock management.' 
                : 'اكتشف أحدث المعارف والرؤى في العلوم الزراعية وإدارة الثروة الحيوانية.'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* فلاتر البحث والنوع */}
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
            
            {/* فلتر النوع */}
            <div className="flex gap-2">
              {typeFilters.map(type => (
                <Button 
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className={selectedType === type.id ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => {
                    setSelectedType(type.id);
                    setSelectedCategory('all');
                  }}
                >
                  {type.name[language as 'en' | 'ar']}
                </Button>
              ))}
            </div>
          </div>

          {/* فلاتر التصنيفات */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {categories
              .filter(cat => selectedType === 'all' || cat.type === selectedType || cat.id === 'all')
              .map(category => (
                <Button 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={selectedCategory === category.id ? "bg-agri hover:bg-agri-dark whitespace-nowrap" : "whitespace-nowrap"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.id !== 'all' && getCategoryIcon(category.id)} {category.name[language as 'en' | 'ar']}
                </Button>
              ))
            }
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
              {filteredArticles.map((article) => {
                const categoryObj = categories.find(cat => cat.id === article.category);
                return (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    summary={article.excerpt || article.content.substring(0, 150) + '...'}
                    image={article.image_url || `https://images.unsplash.com/photo-${categoryObj?.type === 'livestock' ? '1570042225831-d98fa7577f1e' : '1625246333195-78d9c38ad449'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80`}
                    date={formatDate(article.published_at || article.created_at)}
                    link={`/content/articles/${article.id}`}
                    icon={<span className="text-xl">{getCategoryIcon(article.category)}</span>}
                  />
                );
              })}
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
