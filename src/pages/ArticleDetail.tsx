
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
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
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  };
}

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const fetchArticle = async () => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data: articleData, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      if (!articleData) {
        setNotFound(true);
      } else {
        setArticle(articleData);
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setNotFound(true);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load article' : 'فشل في تحميل المقال',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const getAuthorName = (article: Article) => {
    if (article.profiles?.first_name || article.profiles?.last_name) {
      return `${article.profiles.first_name || ''} ${article.profiles.last_name || ''}`.trim();
    }
    return article.profiles?.email || (language === 'en' ? 'Anonymous' : 'مجهول');
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: { en: string; ar: string } } = {
      'crop': { en: 'Crop Care', ar: 'رعاية المحاصيل' },
      'livestock': { en: 'Livestock', ar: 'الثروة الحيوانية' },
      'soil': { en: 'Soil Analysis', ar: 'تحليل التربة' },
      'tech': { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' },
      'irrigation': { en: 'Irrigation', ar: 'الري' },
      'organic-farming': { en: 'Organic Farming', ar: 'الزراعة العضوية' },
      'pest-control': { en: 'Pest Control', ar: 'مكافحة الآفات' },
      'animal-nutrition': { en: 'Animal Nutrition', ar: 'تغذية الحيوانات' },
      'veterinary': { en: 'Veterinary Care', ar: 'الرعاية البيطرية' },
      'dairy-farming': { en: 'Dairy Farming', ar: 'تربية الألبان' },
      'poultry': { en: 'Poultry Management', ar: 'إدارة الدواجن' }
    };
    
    return categories[category]?.[language as 'en' | 'ar'] || category;
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>{language === 'en' ? 'Loading article...' : 'جاري تحميل المقال...'}</p>
        </div>
      </Layout>
    );
  }
  
  if (notFound || !article) {
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
      <div ref={titleRef} className="relative h-[40vh] min-h-[300px] flex items-end bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7)), url(${article.image_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'})` }}>
        <div className="container mx-auto px-4 pb-8 text-white">
          <div className="flex items-center mb-2">
            <span className="bg-agri text-white text-sm px-3 py-1 rounded-full">
              {getCategoryName(article.category)}
            </span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
          <div className="mt-2">
            {language === 'en' ? 'By ' : 'بواسطة '}{getAuthorName(article)}
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
          
          <div className="prose lg:prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">
              {language === 'en' ? 'About the Author' : 'عن الكاتب'}
            </h3>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-agri-light rounded-full flex items-center justify-center text-white font-bold text-xl">
                {getAuthorName(article).charAt(0)}
              </div>
              <div className="ml-4 rtl:mr-4 rtl:ml-0">
                <div className="font-semibold text-lg">{getAuthorName(article)}</div>
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
