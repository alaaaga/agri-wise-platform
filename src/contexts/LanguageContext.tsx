import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.content': 'Content Hub',
    'nav.book': 'Book a Consultation',
    'nav.about': 'About Us',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.account': 'My Account',
    'common.readMore': 'Read More',
    'common.viewAll': 'View All',
    'common.submit': 'Submit',
    'common.explore': 'Explore Services',

    // Home Page
    'home.hero.title': 'Expertise in the Agricultural Field',
    'home.hero.subtitle': 'Professional agricultural consultancy for modern farming',
    'home.services.title': 'Our Services',
    'home.articles.title': 'Latest Articles',
    'home.testimonials.title': 'What Our Clients Say',
    'home.newsletter.title': 'Join Our Newsletter',
    'home.newsletter.placeholder': 'Your email address',
    'home.newsletter.button': 'Subscribe',
    
    // Services Page
    'services.title': 'Our Agricultural Services',
    'services.subtitle': 'Professional solutions for all your farming needs',
    'services.crop.title': 'Crop Care',
    'services.crop.description': 'Expert advice on crop management and protection',
    'services.livestock.title': 'Livestock Management',
    'services.livestock.description': 'Comprehensive solutions for animal husbandry',
    'services.soil.title': 'Soil Analysis',
    'services.soil.description': 'Detailed soil testing and improvement recommendations',
    'services.tech.title': 'Agricultural Technology',
    'services.tech.description': 'Modern farming technologies and implementation',

    // Content Hub
    'content.articles.title': 'Agricultural Articles',
    'content.videos.title': 'Videos',
    'content.animal.title': 'Animal Articles',
    'content.case.title': 'Farming Case Studies',
    'content.ask.title': 'Ask Us',

    // Book Consultation
    'book.title': 'Book a Consultation',
    'book.subtitle': 'Schedule a session with our agricultural experts',
    'book.name': 'Full Name',
    'book.email': 'Email Address',
    'book.phone': 'Phone Number',
    'book.date': 'Preferred Date',
    'book.time': 'Preferred Time',
    'book.topic': 'Consultation Topic',
    'book.message': 'Message',
    'book.button': 'Book Now',

    // About Us
    'about.title': 'About Us',
    'about.mission.title': 'Our Mission',
    'about.mission.text': 'To empower farmers with knowledge and technology for sustainable and profitable agriculture',
    'about.vision.title': 'Our Vision',
    'about.vision.text': 'To be the leading agricultural consultancy platform bridging traditional knowledge with modern innovations',
    'about.team.title': 'Our Team'
  },
  ar: {
    // Common
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.content': 'محتوى المعرفة',
    'nav.book': 'حجز استشارة',
    'nav.about': 'من نحن',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.account': 'حسابي',
    'common.readMore': 'اقرأ المزيد',
    'common.viewAll': 'عرض الكل',
    'common.submit': 'إرسال',
    'common.explore': 'استكشف الخدمات',

    // Home Page
    'home.hero.title': 'خبرة في المجال الزراعي',
    'home.hero.subtitle': 'استشارات زراعية احترافية للزراعة الحديثة',
    'home.services.title': 'خدماتنا',
    'home.articles.title': 'أحدث المقالات',
    'home.testimonials.title': 'ماذا يقول عملاؤنا',
    'home.newsletter.title': 'انضم إلى نشرتنا الإخبارية',
    'home.newsletter.placeholder': 'عنوان بريدك الإلكتروني',
    'home.newsletter.button': 'اشتراك',
    
    // Services Page
    'services.title': 'خدماتنا الزراعية',
    'services.subtitle': 'حلول احترافية لجميع احتياجاتك الزراعية',
    'services.crop.title': 'رعاية المحاصيل',
    'services.crop.description': 'نصائح خبيرة في إدارة المحاصيل وحمايتها',
    'services.livestock.title': 'إدارة الثروة الحيوانية',
    'services.livestock.description': 'حلول شاملة لتربية الحيوانات',
    'services.soil.title': 'تحليل التربة',
    'services.soil.description': 'اختبار تفصيلي للتربة وتوصيات التحسين',
    'services.tech.title': 'التكنولوجيا الزراعية',
    'services.tech.description': 'تقنيات الزراعة الحديثة والتنفيذ',

    // Content Hub
    'content.articles.title': 'مقالات زراعية',
    'content.videos.title': 'فيديوهات',
    'content.animal.title': 'مقالات عن الحيوانات',
    'content.case.title': 'دراسات حالة زراعية',
    'content.ask.title': 'اسألنا',

    // Book Consultation
    'book.title': 'حجز استشارة',
    'book.subtitle': 'جدولة جلسة مع خبراء الزراعة لدينا',
    'book.name': 'الاسم الكامل',
    'book.email': 'البريد الإلكتروني',
    'book.phone': 'رقم الهاتف',
    'book.date': 'التاريخ المفضل',
    'book.time': 'الوقت المفضل',
    'book.topic': 'موضوع الاستشارة',
    'book.message': 'الرسالة',
    'book.button': 'احجز الآن',

    // About Us
    'about.title': 'من نحن',
    'about.mission.title': 'مهمتنا',
    'about.mission.text': 'تمكين المزارعين بالمعرفة والتكنولوجيا للزراعة المستدامة والمربحة',
    'about.vision.title': 'رؤيتنا',
    'about.vision.text': 'أن نكون المنصة الاستشارية الزراعية الرائدة التي تجمع بين المعرفة التقليدية والابتكارات الحديثة',
    'about.team.title': 'فريقنا'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // تعيين اللغة العربية كلغة افتراضية
  const [language, setLanguage] = useState<Language>('ar');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
