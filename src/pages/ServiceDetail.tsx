
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  Users, 
  Award,
  Phone,
  Video,
  MessageSquare,
  Loader2,
  ArrowRight
} from 'lucide-react';
import BookingModal from '@/components/BookingModal';

interface Service {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image_url: string | null;
}

interface ServiceFeature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ConsultationType {
  id: string;
  title: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedConsultationType, setSelectedConsultationType] = useState<ConsultationType | null>(null);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setService(data);
    } catch (err) {
      console.error('Error fetching service:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load service details' : 'فشل في تحميل تفاصيل الخدمة',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceFeatures = (serviceName: string): ServiceFeature[] => {
    const features: Record<string, ServiceFeature[]> = {
      'استشارة المحاصيل': [
        {
          title: language === 'en' ? 'Crop Analysis' : 'تحليل المحاصيل',
          description: language === 'en' ? 'Comprehensive crop health assessment' : 'تقييم شامل لصحة المحاصيل',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />
        },
        {
          title: language === 'en' ? 'Growth Optimization' : 'تحسين النمو',
          description: language === 'en' ? 'Strategies to maximize yield' : 'استراتيجيات لزيادة الإنتاج',
          icon: <Star className="h-6 w-6 text-yellow-600" />
        },
        {
          title: language === 'en' ? 'Disease Prevention' : 'الوقاية من الأمراض',
          description: language === 'en' ? 'Identify and prevent plant diseases' : 'تحديد ومنع أمراض النباتات',
          icon: <Award className="h-6 w-6 text-blue-600" />
        }
      ],
      'تحليل التربة': [
        {
          title: language === 'en' ? 'Soil Testing' : 'فحص التربة',
          description: language === 'en' ? 'Complete soil composition analysis' : 'تحليل شامل لتركيب التربة',
          icon: <CheckCircle className="h-6 w-6 text-green-600" />
        },
        {
          title: language === 'en' ? 'Nutrient Management' : 'إدارة العناصر الغذائية',
          description: language === 'en' ? 'Optimize soil fertility' : 'تحسين خصوبة التربة',
          icon: <Star className="h-6 w-6 text-yellow-600" />
        },
        {
          title: language === 'en' ? 'pH Balance' : 'توازن الحموضة',
          description: language === 'en' ? 'Maintain optimal soil pH' : 'المحافظة على حموضة التربة المثلى',
          icon: <Award className="h-6 w-6 text-blue-600" />
        }
      ]
    };

    return features[serviceName] || [
      {
        title: language === 'en' ? 'Expert Consultation' : 'استشارة خبير',
        description: language === 'en' ? 'Professional agricultural advice' : 'نصائح زراعية مهنية',
        icon: <Users className="h-6 w-6 text-green-600" />
      },
      {
        title: language === 'en' ? 'Customized Solutions' : 'حلول مخصصة',
        description: language === 'en' ? 'Tailored recommendations' : 'توصيات مخصصة',
        icon: <Star className="h-6 w-6 text-yellow-600" />
      },
      {
        title: language === 'en' ? 'Follow-up Support' : 'دعم متابعة',
        description: language === 'en' ? 'Ongoing guidance and support' : 'إرشاد ودعم مستمر',
        icon: <Award className="h-6 w-6 text-blue-600" />
      }
    ];
  };

  const getConsultationTypes = (serviceName: string): ConsultationType[] => {
    return [
      {
        id: 'phone',
        title: language === 'en' ? 'Phone Consultation' : 'استشارة هاتفية',
        duration: language === 'en' ? '30 minutes' : '30 دقيقة',
        price: 100,
        description: language === 'en' ? 'Direct phone consultation with expert' : 'استشارة هاتفية مباشرة مع الخبير',
        features: [
          language === 'en' ? 'Immediate response' : 'رد فوري',
          language === 'en' ? 'Expert advice' : 'نصائح خبير',
          language === 'en' ? 'Problem solving' : 'حل المشاكل'
        ]
      },
      {
        id: 'video',
        title: language === 'en' ? 'Video Consultation' : 'استشارة مرئية',
        duration: language === 'en' ? '45 minutes' : '45 دقيقة',
        price: 150,
        description: language === 'en' ? 'Face-to-face video consultation' : 'استشارة مرئية وجهاً لوجه',
        features: [
          language === 'en' ? 'Visual inspection' : 'فحص بصري',
          language === 'en' ? 'Screen sharing' : 'مشاركة الشاشة',
          language === 'en' ? 'Detailed analysis' : 'تحليل مفصل'
        ]
      },
      {
        id: 'field',
        title: language === 'en' ? 'Field Visit' : 'زيارة ميدانية',
        duration: language === 'en' ? '2 hours' : '2 ساعة',
        price: 300,
        description: language === 'en' ? 'On-site farm visit and consultation' : 'زيارة المزرعة والاستشارة في الموقع',
        features: [
          language === 'en' ? 'Physical inspection' : 'فحص جسدي',
          language === 'en' ? 'Soil sampling' : 'أخذ عينات التربة',
          language === 'en' ? 'Comprehensive report' : 'تقرير شامل'
        ]
      }
    ];
  };

  const handleBookConsultation = (consultationType: ConsultationType) => {
    if (!isAuthenticated) {
      toast({
        title: language === 'en' ? 'Login Required' : 'مطلوب تسجيل الدخول',
        description: language === 'en' ? 'Please login to book a consultation' : 'يرجى تسجيل الدخول لحجز الاستشارة',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    setSelectedConsultationType(consultationType);
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Service Not Found' : 'الخدمة غير موجودة'}
          </h1>
          <Button onClick={() => navigate('/services')}>
            {language === 'en' ? 'Back to Services' : 'العودة للخدمات'}
          </Button>
        </div>
      </Layout>
    );
  }

  const serviceName = language === 'ar' ? service.name_ar : service.name;
  const serviceDescription = language === 'ar' ? service.description_ar || service.description : service.description;
  const features = getServiceFeatures(service.name_ar);
  const consultationTypes = getConsultationTypes(service.name_ar);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{serviceName}</h1>
            <p className="text-xl mb-8">{serviceDescription}</p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {language === 'en' ? 'Professional Agricultural Service' : 'خدمة زراعية مهنية'}
            </Badge>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Service Features' : 'مميزات الخدمة'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Consultation Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'en' ? 'Consultation Options' : 'خيارات الاستشارة'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {consultationTypes.map((type) => (
              <Card key={type.id} className="relative hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    {type.id === 'phone' && <Phone className="h-8 w-8 text-green-600" />}
                    {type.id === 'video' && <Video className="h-8 w-8 text-green-600" />}
                    {type.id === 'field' && <Users className="h-8 w-8 text-green-600" />}
                  </div>
                  <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{type.duration}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {type.price} {language === 'en' ? 'EGP' : 'جنيه'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <ul className="space-y-2 text-sm">
                    {type.features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    onClick={() => handleBookConsultation(type)}
                  >
                    {language === 'en' ? 'Book Now' : 'احجز الآن'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to Get Started?' : 'مستعد للبدء؟'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Our agricultural experts are here to help you achieve the best results for your farm.' 
              : 'خبراؤنا الزراعيون هنا لمساعدتك في تحقيق أفضل النتائج لمزرعتك.'}
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/services')}
          >
            {language === 'en' ? 'View All Services' : 'عرض جميع الخدمات'}
          </Button>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedConsultationType && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          serviceType={`${serviceName} - ${selectedConsultationType.title}`}
          price={selectedConsultationType.price}
          duration={selectedConsultationType.duration}
        />
      )}
    </Layout>
  );
};

export default ServiceDetail;
