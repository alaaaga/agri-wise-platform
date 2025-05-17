
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ArticleCardProps {
  title: string;
  summary: string;
  image: string;
  date: string;
  link: string;
  icon?: React.ReactNode;
}

const ArticleCard = ({ title, summary, image, date, link, icon }: ArticleCardProps) => {
  const { t, language } = useLanguage();
  const animationRef = useScrollAnimation();

  return (
    <div ref={animationRef}>
      <Card className="h-full overflow-hidden card-hover">
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardHeader>
          <div className="text-sm text-gray-500 mb-2">{date}</div>
          <CardTitle className="line-clamp-2 flex items-center gap-2">
            {icon && <span className="text-agri">{icon}</span>}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{summary}</CardDescription>
        </CardContent>
        <CardFooter className={`flex ${language === 'ar' ? 'justify-start' : 'justify-between'}`}>
          <Link to={link}>
            <Button variant="ghost" className="text-agri hover:text-agri-dark">
              {language === 'en' ? 'Read More' : 'اقرأ المزيد'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ArticleCard;
