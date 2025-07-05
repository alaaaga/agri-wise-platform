import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useToast } from '@/hooks/use-toast';
import { ConsultantCard } from '@/components/ConsultantCard';
import { BookingModal } from '@/components/BookingModal';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Consultant {
  id: string;
  name: string;
  title: string;
  image: string;
  rating: number;
  price: number;
  originalPrice: number;
  consultationsCount?: string;
  specialty?: string;
  description?: string;
}

const BookConsultation = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const titleRef = useScrollAnimation();
  
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      
      // إنشاء بيانات وهمية للمستشارين إذا لم تكن متوفرة من قاعدة البيانات
      const dummyConsultants: Consultant[] = [
        {
          id: '1',
          name: 'د. أحمد المنصور',
          title: 'أستاذ الزراعة بجامعة طنطا',
          image: 'https://i.pravatar.cc/150?img=11',
          rating: 5,
          price: 150,
          originalPrice: 200,
          consultationsCount: '200+',
          specialty: 'الزراعة المستدامة',
          description: 'خبير في تحسين المحاصيل وإدارة المزارع بطرق مستدامة'
        },
        {
          id: '2',
          name: 'د. فاطمة عبدالله',
          title: 'خبيرة الثروة الحيوانية',
          image: 'https://i.pravatar.cc/150?img=12',
          rating: 5,
          price: 140,
          originalPrice: 180,
          consultationsCount: '150+',
          specialty: 'رعاية الحيوانات',
          description: 'متخصصة في أمراض الحيوانات والتغذية السليمة'
        },
        {
          id: '3',
          name: 'م. محمد حسن',
          title: 'مهندس زراعي متخصص',
          image: 'https://i.pravatar.cc/150?img=13',
          rating: 4.8,
          price: 130,
          originalPrice: 170,
          consultationsCount: '120+',
          specialty: 'التكنولوجيا الزراعية',
          description: 'خبير في أنظمة الري الحديثة والزراعة الذكية'
        },
        {
          id: '4',
          name: 'د. سارة إبراهيم',
          title: 'استشارية التغذية النباتية',
          image: 'https://i.pravatar.cc/150?img=14',
          rating: 4.9,
          price: 160,
          originalPrice: 210,
          consultationsCount: '180+',
          specialty: 'تغذية النباتات',
          description: 'متخصصة في الأسمدة العضوية وتحسين جودة التربة'
        }
      ];

      // محاولة جلب البيانات من قاعدة البيانات أولاً
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .limit(10);
      
      if (error) {
        console.error('خطأ في جلب المستشارين:', error);
        // استخدم البيانات الوهمية في حالة وجود خطأ
        setConsultants(dummyConsultants);
      } else if (profilesData && profilesData.length > 0) {
        // تحويل البيانات الحقيقية إلى التنسيق المطلوب
        const realConsultants: Consultant[] = profilesData.map((profile, index) => ({
          id: profile.id,
          name: `${profile.first_name || 'مستشار'} ${profile.last_name || 'زراعي'}`,
          title: profile.role === 'admin' 
            ? 'أستاذ زراعي بجامعة طنطا' 
            : profile.role === 'moderator'
            ? 'خبير زراعي من جامعة طنطا'
            : 'باحث في الزراعة بجامعة طنطا',
          image: profile.avatar_url || `https://i.pravatar.cc/150?img=${11 + (index % 10)}`,
          rating: 4.5 + (Math.random() * 0.5),
          price: 140 + (index * 10),
          originalPrice: 180 + (index * 20),
          consultationsCount: `${100 + (index * 50)}+`,
          specialty: getSpecialtyByRole(profile.role),
          description: profile.bio || getDescriptionByRole(profile.role)
        }));
        
        // دمج البيانات الحقيقية مع الوهمية
        setConsultants([...realConsultants, ...dummyConsultants]);
      } else {
        // استخدم البيانات الوهمية إذا لم توجد بيانات حقيقية
        setConsultants(dummyConsultants);
      }
    } catch (err) {
      console.error('خطأ عام في جلب المستشارين:', err);
      // استخدم البيانات الوهمية في حالة حدوث خطأ
      const dummyConsultants: Consultant[] = [
        {
          id: '1',
          name: 'د. أحمد المنصور',
          title: 'أستاذ الزراعة بجامعة طنطا',
          image: 'https://i.pravatar.cc/150?img=11',
          rating: 5,
          price: 150,
          originalPrice: 200,
          consultationsCount: '200+',
          specialty: 'الزراعة المستدامة',
          description: 'خبير في تحسين المحاصيل وإدارة المزارع بطرق مستدامة'
        },
        {
          id: '2',
          name: 'د. فاطمة عبدالله',
          title: 'خبيرة الثروة الحيوانية',
          image: 'https://i.pravatar.cc/150?img=12',
          rating: 5,
          price: 140,
          originalPrice: 180,
          consultationsCount: '150+',
          specialty: 'رعاية الحيوانات',
          description: 'متخصصة في أمراض الحيوانات والتغذية السليمة'
        },
        {
          id: '3',
          name: 'م. محمد حسن',
          title: 'مهندس زراعي متخصص',
          image: 'https://i.pravatar.cc/150?img=13',
          rating: 4.8,
          price: 130,
          originalPrice: 170,
          consultationsCount: '120+',
          specialty: 'التكنولوجيا الزراعية',
          description: 'خبير في أنظمة الري الحديثة والزراعة الذكية'
        },
        {
          id: '4',
          name: 'د. سارة إبراهيم',
          title: 'استشارية التغذية النباتية',
          image: 'https://i.pravatar.cc/150?img=14',
          rating: 4.9,
          price: 160,
          originalPrice: 210,
          consultationsCount: '180+',
          specialty: 'تغذية النباتات',
          description: 'متخصصة في الأسمدة العضوية وتحسين جودة التربة'
        }
      ];
      setConsultants(dummyConsultants);
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'الزراعة المستدامة';
      case 'moderator':
        return 'رعاية المحاصيل';
      default:
        return 'التكنولوجيا الزراعية';
    }
  };

  const getDescriptionByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'مستشار زراعي ذو خبرة في تحسين المحاصيل وإدارة المزارع';
      case 'moderator':
        return 'متخصص في أمراض النباتات وتقنيات الري الحديثة';
      default:
        return 'باحث متخصص في أحدث التقنيات الزراعية وتطبيقاتها';
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);
  
  const handleBookNow = (consultant) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    } else {
      setSelectedConsultant(consultant);
      setShowBookingForm(true);
    }
  };
  
  const handleLoginSuccess = () => {
    setShowLoginPrompt(false);
    if (selectedConsultant) {
      setShowBookingForm(true);
    }
  };
  
  const handleBookingSuccess = () => {
    toast({
      title: language === 'en' ? 'Consultation Booked!' : 'تم حجز الاستشارة!',
      description: language === 'en' 
        ? 'We will contact you to confirm your appointment.' 
        : 'سنتصل بك لتأكيد موعدك.',
    });
    setShowBookingForm(false);
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === 'en' 
                ? 'Book Your Agricultural Consultation' 
                : 'استشارتك الزراعية مع افضل المتخصصين'}
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              {language === 'en' 
                ? 'Get personalized advice from our agricultural experts' 
                : 'افضل المتخصصين الزراعيين، متاحون لتقديم الاستشارات عبر الفيديو أو المكالمات الهاتفية. احصل على استشارتك الزراعية بكل سهولة.'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {language === 'en' ? 'Loading consultants...' : 'جاري تحميل المستشارين...'}
            </span>
          </div>
        ) : consultants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {consultants.map((consultant) => (
              <ConsultantCard 
                key={consultant.id}
                consultant={consultant} 
                onBookNow={() => handleBookNow(consultant)}
                buttonText={language === 'en' ? 'Book Now' : 'احجز الآن'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              {language === 'en' ? 'No consultants available at the moment' : 'لا يوجد مستشارين متاحين حالياً'}
            </p>
            <Button 
              onClick={fetchConsultants}
              variant="outline"
            >
              {language === 'en' ? 'Refresh' : 'تحديث'}
            </Button>
          </div>
        )}
        
        <Card className="mt-8 border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'en' 
                ? 'Need a specialized consultation?' 
                : 'تحتاج استشارة متخصصة؟'}
            </h3>
            <p className="mb-6 text-gray-600">
              {language === 'en' 
                ? 'Contact our support team to arrange a custom consultation with our experts.' 
                : 'تواصل مع فريق الدعم لترتيب استشارة مخصصة مع خبرائنا.'}
            </p>
            <Button 
              className="bg-agri hover:bg-agri-dark"
              onClick={() => navigate('/content/ask-us')}
            >
              {language === 'en' ? 'Contact Us' : 'تواصل معنا'}
            </Button>
          </CardContent>
        </Card>
      </section>
      
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <BookingModal 
        isOpen={showBookingForm} 
        onClose={() => setShowBookingForm(false)} 
        consultant={selectedConsultant}
        onBookingSuccess={handleBookingSuccess}
      />
    </Layout>
  );
};

export default BookConsultation;
