
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '@/components/ServiceCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, Leaf, Beaker, Sprout, Tractor, Users, Award, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image_url: string | null;
}

interface ServiceStats {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const Services = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setServices(servicesData || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load services' : 'فشل في تحميل الخدمات',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getServiceIcon = (index: number) => {
    const icons = [
      <Sprout className="h-8 w-8" />,
      <Beaker className="h-8 w-8" />,
      <Users className="h-8 w-8" />,
      <Tractor className="h-8 w-8" />,
      <Leaf className="h-8 w-8" />,
      <Award className="h-8 w-8" />
    ];
    return icons[index % icons.length];
  };

  const filteredServices = services.filter(service => {
    const name = language === 'ar' ? service.name_ar : service.name;
    const description = language === 'ar' ? service.description_ar || service.description : service.description;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const serviceStats: ServiceStats[] = [
    {
      title: language === 'en' ? 'Expert Consultants' : 'استشاريون خبراء',
      value: '50+',
      icon: <Users className="h-6 w-6 text-green-600" />
    },
    {
      title: language === 'en' ? 'Years Experience' : 'سنوات خبرة',
      value: '15+',
      icon: <Award className="h-6 w-6 text-blue-600" />
    },
    {
      title: language === 'en' ? 'Happy Farmers' : 'مزارعون راضون',
      value: '1000+',
      icon: <CheckCircle className="h-6 w-6 text-yellow-600" />
    },
    {
      title: language === 'en' ? 'Success Rate' : 'معدل النجاح',
      value: '95%',
      icon: <Leaf className="h-6 w-6 text-green-600" />
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">{t('services.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {language === 'en' ? 'Professional Services' : 'خدمات مهنية'}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {language === 'en' ? 'Expert Consultation' : 'استشارة خبراء'}
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {language === 'en' ? '24/7 Support' : 'دعم 24/7'}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {serviceStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={language === 'en' ? 'Search services...' : 'البحث في الخدمات...'}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' ? 'Our Agricultural Services' : 'خدماتنا الزراعية'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'We provide comprehensive agricultural consultation services to help you maximize your farm productivity and profitability.'
                : 'نقدم خدمات استشارة زراعية شاملة لمساعدتك في زيادة إنتاجية وربحية مزرعتك.'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {language === 'en' ? 'Loading services...' : 'جاري تحميل الخدمات...'}
              </span>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  title={language === 'ar' ? service.name_ar : service.name}
                  description={language === 'ar' ? service.description_ar || service.description || '' : service.description || service.description_ar || ''}
                  icon={getServiceIcon(index)}
                  link={`/services/${service.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'No services found matching your search' : 'لم يتم العثور على خدمات تطابق بحثك'}
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                {language === 'en' ? 'Clear Search' : 'مسح البحث'}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' ? 'Why Choose AgriWise?' : 'لماذا تختار أجريوايز؟'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>
                  {language === 'en' ? 'Expert Team' : 'فريق خبراء'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Our team consists of certified agricultural engineers and specialists with years of field experience.'
                    : 'فريقنا يتكون من مهندسين زراعيين معتمدين ومتخصصين بسنوات من الخبرة الميدانية.'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Beaker className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>
                  {language === 'en' ? 'Modern Technology' : 'تكنولوجيا حديثة'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'We use the latest agricultural technologies and scientific methods to provide accurate analysis and recommendations.'
                    : 'نستخدم أحدث التقنيات الزراعية والطرق العلمية لتقديم تحليل وتوصيات دقيقة.'}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle>
                  {language === 'en' ? 'Proven Results' : 'نتائج مثبتة'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {language === 'en' 
                    ? 'Our clients have achieved significant improvements in crop yield and farm profitability through our services.'
                    : 'حقق عملاؤنا تحسينات كبيرة في إنتاج المحاصيل وربحية المزرعة من خلال خدماتنا.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to Transform Your Farm?' : 'مستعد لتحويل مزرعتك؟'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Get started with a consultation today and see the difference expert guidance can make.'
              : 'ابدأ بالاستشارة اليوم وشاهد الفرق الذي يمكن أن يحدثه التوجيه الخبير.'}
          </p>
          <Button size="lg" variant="secondary">
            {language === 'en' ? 'Contact Us Now' : 'اتصل بنا الآن'}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
