
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
      <span key={i} className="text-yellow-400 text-xl">
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
          <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {language === 'en' ? 'Agricultural Consultant' : 'مستشار زراعي'}
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold text-center mb-1">{consultant.name}</h3>
        <p className="text-gray-600 text-center text-sm mb-3">{consultant.title}</p>
        
        {consultant.specialty && (
          <div className="mb-3 flex justify-center">
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs">
              {consultant.specialty}
            </span>
          </div>
        )}
        
        <div className="flex justify-center mb-4">
          {renderStars(consultant.rating)}
        </div>
        
        <div className="flex justify-center items-center gap-2 mb-5">
          <p className="text-gray-900 font-bold">
            {language === 'ar' ? `${consultant.price} ج` : `EGP ${consultant.price}`}
          </p>
          <p className="text-gray-500 line-through text-sm">
            {language === 'ar' ? `${consultant.originalPrice} ج` : `EGP ${consultant.originalPrice}`}
          </p>
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
