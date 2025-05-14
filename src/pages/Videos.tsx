
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Videos = () => {
  const { language } = useLanguage();
  const titleRef = useScrollAnimation();

  // Mock video data - would typically come from an API
  const videos = [
    {
      id: 1,
      title: language === 'en' ? 'Modern Irrigation Techniques' : 'تقنيات الري الحديثة',
      thumbnail: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '12:34',
      date: language === 'en' ? 'May 15, 2024' : '١٥ مايو ٢٠٢٤',
      description: language === 'en' 
        ? 'Learn about efficient water management systems for your crops.' 
        : 'تعرف على أنظمة إدارة المياه الفعالة لمحاصيلك.',
      videoId: 'abc123'
    },
    {
      id: 2,
      title: language === 'en' ? 'Sustainable Pest Control' : 'مكافحة الآفات المستدامة',
      thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '8:45',
      date: language === 'en' ? 'April 23, 2024' : '٢٣ أبريل ٢٠٢٤',
      description: language === 'en' 
        ? 'Natural and eco-friendly approaches to managing pests in your fields.' 
        : 'طرق طبيعية وصديقة للبيئة لإدارة الآفات في حقولك.',
      videoId: 'def456'
    },
    {
      id: 3,
      title: language === 'en' ? 'Soil Health Management' : 'إدارة صحة التربة',
      thumbnail: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '15:21',
      date: language === 'en' ? 'March 10, 2024' : '١٠ مارس ٢٠٢٤',
      description: language === 'en' 
        ? 'Maintaining and improving your soil for long-term fertility.' 
        : 'الحفاظ على تربتك وتحسينها من أجل خصوبة طويلة المدى.',
      videoId: 'ghi789'
    },
    {
      id: 4,
      title: language === 'en' ? 'Livestock Nutrition Fundamentals' : 'أساسيات تغذية الماشية',
      thumbnail: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '18:07',
      date: language === 'en' ? 'February 27, 2024' : '٢٧ فبراير ٢٠٢٤',
      description: language === 'en' 
        ? 'Understanding the dietary needs of your livestock for optimal health and production.' 
        : 'فهم الاحتياجات الغذائية لماشيتك من أجل الصحة والإنتاج الأمثل.',
      videoId: 'jkl012'
    },
    {
      id: 5,
      title: language === 'en' ? 'Drone Technology in Agriculture' : 'تكنولوجيا الطائرات بدون طيار في الزراعة',
      thumbnail: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '10:52',
      date: language === 'en' ? 'January 15, 2024' : '١٥ يناير ٢٠٢٤',
      description: language === 'en' 
        ? 'How drones are revolutionizing farming through aerial monitoring and applications.' 
        : 'كيف تحدث الطائرات بدون طيار ثورة في الزراعة من خلال المراقبة الجوية والتطبيقات.',
      videoId: 'mno345'
    },
    {
      id: 6,
      title: language === 'en' ? 'Crop Rotation Strategies' : 'استراتيجيات تناوب المحاصيل',
      thumbnail: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80',
      duration: '14:33',
      date: language === 'en' ? 'December 5, 2023' : '٥ ديسمبر ٢٠٢٣',
      description: language === 'en' 
        ? 'Planning effective crop rotations for soil health and disease prevention.' 
        : 'تخطيط تناوب محاصيل فعال لصحة التربة والوقاية من الأمراض.',
      videoId: 'pqr678'
    }
  ];

  const playVideo = (videoId: string) => {
    console.log(`Playing video with ID: ${videoId}`);
    // In a real implementation, this would open a modal or navigate to a video player page
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
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=800&q=80" 
                    alt={language === 'en' ? "Seasonal Farming Guide" : "دليل الزراعة الموسمية"}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      onClick={() => playVideo('featured123')}
                      className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </AspectRatio>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">
                {language === 'en' ? 'Seasonal Farming Guide: Maximizing Your Yield' : 'دليل الزراعة الموسمية: تعظيم محصولك'}
              </h3>
              <p className="text-gray-600 mt-2">
                {language === 'en' 
                  ? 'A comprehensive guide to planning your farming calendar for optimal results throughout the year.' 
                  : 'دليل شامل لتخطيط تقويمك الزراعي للحصول على نتائج مثلى على مدار العام.'}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>{language === 'en' ? 'Duration: 24:18' : 'المدة: ٢٤:١٨'}</span>
                <span className="mx-2">•</span>
                <span>{language === 'en' ? 'May 28, 2024' : '٢٨ مايو ٢٠٢٤'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === 'en' ? 'Latest Videos' : 'أحدث الفيديوهات'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      onClick={() => playVideo(video.videoId)}
                      className="bg-purple-600/80 hover:bg-purple-700 rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 rtl:left-2 rtl:right-auto bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{video.description}</p>
                  <div className="text-gray-500 text-sm">{video.date}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-purple-700 hover:bg-purple-800">
              {language === 'en' ? 'Load More Videos' : 'تحميل المزيد من الفيديوهات'}
            </Button>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {language === 'en' ? 'Video Topics' : 'مواضيع الفيديو'}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              language === 'en' ? 'Crop Management' : 'إدارة المحاصيل',
              language === 'en' ? 'Livestock Care' : 'رعاية الماشية',
              language === 'en' ? 'Soil Health' : 'صحة التربة',
              language === 'en' ? 'Water Management' : 'إدارة المياه',
              language === 'en' ? 'Sustainable Farming' : 'الزراعة المستدامة',
              language === 'en' ? 'Farm Technology' : 'تكنولوجيا المزرعة',
              language === 'en' ? 'Pest Control' : 'مكافحة الآفات',
              language === 'en' ? 'Organic Methods' : 'الطرق العضوية'
            ].map((topic, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="text-center p-4 h-auto"
              >
                {topic}
              </Button>
            ))}
          </div>
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
