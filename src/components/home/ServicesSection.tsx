
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from '../ServiceCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  image_url: string | null;
}

const ServicesSection = () => {
  const { t, language } = useLanguage();
  const titleRef = useScrollAnimation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      
      const { data: servicesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(4);
      
      if (error) throw error;
      
      setServices(servicesData || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getServiceIcon = (index: number) => {
    const icons = ['🌱', '🐄', '🧪', '🚜'];
    return icons[index % icons.length];
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.services.title')}</h2>
          <div className="w-24 h-1 bg-agri mx-auto"></div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {language === 'en' ? 'Loading services...' : 'جاري تحميل الخدمات...'}
            </span>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            <p className="text-gray-600">
              {language === 'en' ? 'No services available yet.' : 'لا توجد خدمات متاحة حتى الآن.'}
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/services">
            <Button variant="default" className="bg-agri hover:bg-agri-dark">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
