
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '@/components/ServiceCard';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image_url: string | null;
}

const Services = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

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
    const icons = ['🌱', '🐄', '🧪', '🚜', '🌿', '🚰'];
    return icons[index % icons.length];
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('services.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto">{t('services.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {language === 'en' ? 'Loading services...' : 'جاري تحميل الخدمات...'}
              </span>
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  title={language === 'ar' ? service.name_ar : service.name}
                  description={language === 'ar' ? service.description_ar || service.description || '' : service.description || service.description_ar || ''}
                  icon={<span className="text-3xl">{getServiceIcon(index)}</span>}
                  link={`/services/${service.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                {language === 'en' ? 'No services available at the moment' : 'لا توجد خدمات متاحة حالياً'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
