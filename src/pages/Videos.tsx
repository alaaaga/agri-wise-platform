
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  category: string;
  duration: number | null;
  created_at: string;
  views: number | null;
}

const Videos = () => {
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: { en: 'All Videos', ar: 'كل الفيديوهات' } },
    { id: 'Growing', name: { en: 'Growing', ar: 'الزراعة' } },
    { id: 'Soil', name: { en: 'Soil', ar: 'التربة' } },
    { id: 'Pest Control', name: { en: 'Pest Control', ar: 'مكافحة الآفات' } },
    { id: 'Structures', name: { en: 'Structures', ar: 'الهياكل' } },
    { id: 'Water Management', name: { en: 'Water Management', ar: 'إدارة المياه' } },
    { id: 'Livestock', name: { en: 'Livestock', ar: 'الثروة الحيوانية' } }
  ];

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const { data: videosData, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVideos(videosData || []);
      if (videosData && videosData.length > 0) {
        setFeaturedVideo(videosData[0]);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load videos' : 'فشل في تحميل الفيديوهات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'all' || video.category === selectedCategory
  );

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '0:00';
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'ar' 
      ? date.toLocaleDateString('ar-EG')
      : date.toLocaleDateString('en-US');
  };

  const playVideo = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div ref={titleRef} className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' ? 'Agricultural Education Videos' : 'فيديوهات تعليمية زراعية'}
            </h1>
            <p className="text-xl mb-4">
              {language === 'en'
                ? 'Watch and learn from our expert agricultural consultants'
                : 'شاهد وتعلم من خبراء الاستشارات الزراعية لدينا'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Video */}
      {featuredVideo && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {language === 'en' ? 'Featured Video' : 'الفيديو المميز'}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <AspectRatio ratio={16 / 9}>
                  <div className="relative w-full h-full">
                    <img 
                      src={featuredVideo.thumbnail_url || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80'} 
                      alt={featuredVideo.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        onClick={() => playVideo(featuredVideo.video_url)}
                        className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16 flex items-center justify-center"
                      >
                        <Play className="h-8 w-8 ml-1" />
                      </Button>
                    </div>
                  </div>
                </AspectRatio>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">{featuredVideo.title}</h3>
                <p className="text-gray-600 mt-2">{featuredVideo.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>{language === 'en' ? 'Duration: ' : 'المدة: '}{formatDuration(featuredVideo.duration)}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(featuredVideo.created_at)}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredVideo.views || 0} {language === 'en' ? 'views' : 'مشاهدة'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={selectedCategory === category.id ? "bg-purple-700 hover:bg-purple-800" : ""}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name[language as 'en' | 'ar']}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === 'en' ? 'Latest Videos' : 'أحدث الفيديوهات'}
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {language === 'en' ? 'Loading videos...' : 'جاري تحميل الفيديوهات...'}
              </span>
            </div>
          ) : filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={video.thumbnail_url || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1563514227147-6d2ff665a6a0' : '1530836369250-ef72a3f5cda8'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80`} 
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button 
                        onClick={() => playVideo(video.video_url)}
                        className="bg-purple-600/80 hover:bg-purple-700 rounded-full w-12 h-12 flex items-center justify-center"
                      >
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto bg-black/70 text-white px-2 py-1 rounded text-sm">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex justify-between items-center text-gray-500 text-sm">
                      <span>{formatDate(video.created_at)}</span>
                      <span>{video.views || 0} {language === 'en' ? 'views' : 'مشاهدة'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {language === 'en' ? 'No videos available yet.' : 'لا توجد فيديوهات متاحة حتى الآن.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' 
              ? 'Have questions about farming techniques?' 
              : 'هل لديك أسئلة حول تقنيات الزراعة؟'}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Our agricultural experts are ready to provide personalized guidance for your specific situation.'
              : 'خبراؤنا الزراعيون مستعدون لتقديم إرشادات مخصصة لوضعك المحدد.'}
          </p>
          <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
            {language === 'en' ? 'Ask Our Experts' : 'اسأل خبراءنا'}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Videos;
