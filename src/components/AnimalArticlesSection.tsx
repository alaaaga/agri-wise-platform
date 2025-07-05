
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnimalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
  views: number;
  likes: number;
}

const AnimalArticlesSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AnimalArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // مقالات وهمية عن الحيوانات
  const dummyAnimalArticles: AnimalArticle[] = [
    {
      id: 'animal-1',
      title: 'أساسيات تربية الأبقار الحلوب',
      excerpt: 'دليل شامل لتربية الأبقار الحلوب وزيادة إنتاج الحليب بطرق علمية حديثة',
      content: 'تربية الأبقار الحلوب تتطلب معرفة عميقة بالتغذية السليمة والرعاية الصحية...',
      image_url: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'livestock',
      created_at: '2024-01-15T10:00:00Z',
      views: 245,
      likes: 32
    },
    {
      id: 'animal-2', 
      title: 'التغذية السليمة للدواجن',
      excerpt: 'كيفية تحضير العلف المناسب للدجاج والطيور المنزلية لضمان النمو الصحي',
      content: 'التغذية السليمة للدواجن هي أساس نجاح مشروع تربية الدجاج...',
      image_url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'poultry',
      created_at: '2024-01-12T08:30:00Z',
      views: 189,
      likes: 28
    },
    {
      id: 'animal-3',
      title: 'الوقاية من أمراض الأغنام',
      excerpt: 'أهم الأمراض التي تصيب الأغنام وطرق الوقاية والعلاج المبكر',
      content: 'تصاب الأغنام بعدة أمراض يمكن الوقاية منها باتباع برنامج وقائي صحيح...',
      image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'livestock',
      created_at: '2024-01-10T14:20:00Z',
      views: 156,
      likes: 21
    },
    {
      id: 'animal-4',
      title: 'إدارة المراعي الطبيعية',
      excerpt: 'كيفية استغلال المراعي الطبيعية بأفضل طريقة لتغذية الماشية',
      content: 'المراعي الطبيعية مصدر غذائي مهم للماشية ويجب إدارتها بحكمة...',
      image_url: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'pasture-management',
      created_at: '2024-01-08T16:45:00Z',
      views: 203,
      likes: 35
    },
    {
      id: 'animal-5',
      title: 'تربية الماعز في المناطق الجافة',
      excerpt: 'دليل عملي لتربية الماعز في البيئات الصحراوية والمناطق قليلة المطر',
      content: 'الماعز من الحيوانات التي تتأقلم مع البيئات الجافة بشكل ممتاز...',
      image_url: 'https://images.unsplash.com/photo-1551376347-075b0121a65b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'livestock',
      created_at: '2024-01-05T12:15:00Z',
      views: 167,
      likes: 24
    },
    {
      id: 'animal-6',
      title: 'الرعاية البيطرية الوقائية',
      excerpt: 'أهمية الفحص الدوري والتطعيمات في الحفاظ على صحة الحيوانات',
      content: 'الرعاية البيطرية الوقائية تساعد في منع الأمراض قبل حدوثها...',
      image_url: 'https://images.unsplash.com/photo-1581929197977-b756e6ede3b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      category: 'veterinary',
      created_at: '2024-01-03T09:30:00Z',
      views: 278,
      likes: 41
    }
  ];

  const fetchAnimalArticles = async () => {
    try {
      setLoading(true);
      
      // محاولة جلب المقالات من قاعدة البيانات
      const animalCategories = [
        'livestock', 'animal-nutrition', 'veterinary', 'dairy-farming', 
        'poultry', 'animal-breeding', 'animal-health', 'pasture-management'
      ];

      const { data: articlesData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .in('category', animalCategories)
        .order('published_at', { ascending: false })
        .limit(6);
      
      if (error) {
        console.error('خطأ في جلب مقالات الحيوانات:', error);
      }
      
      // دمج البيانات الحقيقية مع الوهمية
      const realArticles = articlesData || [];
      const combinedArticles = [...realArticles, ...dummyAnimalArticles].slice(0, 6);
      
      setArticles(combinedArticles);
    } catch (err) {
      console.error('خطأ عام في جلب المقالات:', err);
      setArticles(dummyAnimalArticles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalArticles();
  }, []);

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'livestock': 'رعاية الماشية',
      'animal-nutrition': 'تغذية الحيوانات',
      'veterinary': 'الرعاية البيطرية',
      'dairy-farming': 'تربية الألبان',
      'poultry': 'إدارة الدواجن',
      'animal-breeding': 'تربية الحيوانات',
      'animal-health': 'صحة الحيوانات',
      'pasture-management': 'إدارة المراعي'
    };
    return categories[category] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            مقالات الثروة الحيوانية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            دليلك الشامل لتربية ورعاية الحيوانات بأحدث الطرق العلمية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryName(article.category)}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {article.likes}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.created_at)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => navigate(`/content/articles/${article.id}`)}
                    className="text-primary hover:text-primary-dark"
                  >
                    اقرأ المزيد
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/content/animal')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            size="lg"
          >
            عرض جميع مقالات الحيوانات
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AnimalArticlesSection;
