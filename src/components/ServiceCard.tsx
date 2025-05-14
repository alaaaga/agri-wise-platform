
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const ServiceCard = ({ title, description, icon, link }: ServiceCardProps) => {
  const { t } = useLanguage();
  const animationRef = useScrollAnimation();

  return (
    <div ref={animationRef}>
      <Card className="h-full card-hover">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to={link}>
            <Button variant="outline">{t('common.readMore')}</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServiceCard;
