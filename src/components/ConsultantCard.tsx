
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Video, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface ConsultantCardProps {
  consultant: Consultant;
  onBookNow: () => void;
  buttonText: string;
}

export const ConsultantCard = ({ consultant, onBookNow, buttonText }: ConsultantCardProps) => {
  const { language } = useLanguage();
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className="text-yellow-400 text-lg">
        {i < rating ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={consultant.image} 
          alt={consultant.name} 
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
            {language === 'en' ? 'Agricultural Consultant' : 'مستشار زراعي'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-center mb-1">{consultant.name}</h3>
        <p className="text-gray-600 text-center text-sm mb-3">{consultant.title}</p>
        
        {consultant.specialty && (
          <div className="mb-3 flex justify-center">
            <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200">
              {consultant.specialty}
            </Badge>
          </div>
        )}
        
        <div className="flex justify-center mb-3">
          {renderStars(consultant.rating)}
        </div>
        
        <div className="flex justify-center items-center gap-2 mb-3">
          <p className="text-gray-900 font-bold text-lg">
            {language === 'ar' ? `${consultant.price} ج` : `EGP ${consultant.price}`}
          </p>
          <p className="text-gray-500 line-through text-sm">
            {language === 'ar' ? `${consultant.originalPrice} ج` : `EGP ${consultant.originalPrice}`}
          </p>
        </div>
        
        <div className="flex justify-center gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            {language === 'en' ? 'Video' : 'فيديو'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {language === 'en' ? 'Call' : 'مكالمة'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {language === 'en' ? '30 min' : '30 دقيقة'}
          </Badge>
        </div>
        
        <Button 
          onClick={onBookNow} 
          className="w-full bg-agri hover:bg-agri-dark"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
