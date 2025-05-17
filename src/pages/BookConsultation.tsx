
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConsultantCard } from '@/components/ConsultantCard';
import { BookingModal } from '@/components/BookingModal';
import { LoginPromptModal } from '@/components/LoginPromptModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// محاكاة بيانات المستشارين
const consultants = [
  {
    id: '1',
    name: 'أحمد حسين',
    title: 'أستاذ زراعي بجامعة طنطا',
    image: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    price: 140,
    originalPrice: 180,
    consultationsCount: '200+',
    specialty: 'الزراعة المستدامة',
    description: 'مستشار زراعي ذو خبرة في تحسين المحاصيل وإدارة المزارع'
  },
  {
    id: '2',
    name: 'محمد علي',
    title: 'خبير زراعي من جامعة طنطا',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    price: 150,
    originalPrice: 200,
    consultationsCount: '150+',
    specialty: 'رعاية المحاصيل',
    description: 'متخصص في أمراض النباتات وتقنيات الري الحديثة'
  },
  {
    id: '3',
    name: 'سامي فؤاد',
    title: 'باحث في الزراعة بجامعة طنطا',
    image: 'https://i.pravatar.cc/150?img=13',
    rating: 5,
    price: 170,
    originalPrice: 220,
    consultationsCount: '170+',
    specialty: 'التكنولوجيا الزراعية',
    description: 'باحث متخصص في أحدث التقنيات الزراعية وتطبيقاتها'
  },
  {
    id: '4',
    name: 'خالد مصطفى',
    title: 'خبير زراعي ومستشار من جامعة طنطا',
    image: 'https://i.pravatar.cc/150?img=14',
    rating: 5,
    price: 200,
    originalPrice: 250,
    consultationsCount: '200+',
    specialty: 'تحليل التربة',
    description: 'خبير في تحليل التربة وتحسين خصائصها للزراعة'
  }
];

const BookConsultation = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const titleRef = useScrollAnimation();
  
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
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
      
      {/* نافذة تسجيل الدخول المنبثقة */}
      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* نافذة نموذج الحجز */}
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
