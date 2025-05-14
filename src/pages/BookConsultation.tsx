
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const BookConsultation = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const titleRef = useScrollAnimation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const topics = [
    { value: 'crop-care', label: t('services.crop.title') },
    { value: 'livestock', label: t('services.livestock.title') },
    { value: 'soil-analysis', label: t('services.soil.title') },
    { value: 'agri-tech', label: t('services.tech.title') },
  ];
  
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: language === 'en' ? 'Consultation Booked!' : 'تم حجز الاستشارة!',
        description: language === 'en' 
          ? 'We will contact you to confirm your appointment.' 
          : 'سنتصل بك لتأكيد موعدك.',
      });
      
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setDate(undefined);
      setTime('');
      setTopic('');
      setMessage('');
    }, 1500);
  };

  return (
    <Layout>
      <section className="bg-gradient-to-r from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div ref={titleRef}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('book.title')}</h1>
            <p className="text-xl max-w-3xl mx-auto">{t('book.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <h2 className="text-2xl font-bold mb-6">
                    {language === 'en' ? 'Why Book a Consultation?' : 'لماذا تحجز استشارة؟'}
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-4 rtl:ml-4 rtl:mr-0 mt-1 text-agri text-xl">✓</div>
                      <p>
                        {language === 'en' 
                          ? 'Get personalized advice from agricultural experts' 
                          : 'احصل على نصائح مخصصة من خبراء الزراعة'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 rtl:ml-4 rtl:mr-0 mt-1 text-agri text-xl">✓</div>
                      <p>
                        {language === 'en' 
                          ? 'Solve specific problems affecting your farm or livestock' 
                          : 'حل مشاكل محددة تؤثر على مزرعتك أو ماشيتك'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 rtl:ml-4 rtl:mr-0 mt-1 text-agri text-xl">✓</div>
                      <p>
                        {language === 'en' 
                          ? 'Develop a strategic plan for improving productivity' 
                          : 'وضع خطة استراتيجية لتحسين الإنتاجية'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 rtl:ml-4 rtl:mr-0 mt-1 text-agri text-xl">✓</div>
                      <p>
                        {language === 'en' 
                          ? 'Learn about the latest agricultural techniques and technologies' 
                          : 'تعرف على أحدث التقنيات والتكنولوجيا الزراعية'}
                      </p>
                    </li>
                  </ul>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">
                      {language === 'en' ? 'Our Consultation Process' : 'عملية الاستشارة لدينا'}
                    </h3>
                    <ol className="space-y-4">
                      <li className="flex items-start">
                        <div className="mr-4 rtl:ml-4 rtl:mr-0 w-8 h-8 rounded-full bg-agri text-white flex items-center justify-center font-bold">1</div>
                        <div>
                          <p className="font-semibold">
                            {language === 'en' ? 'Book Your Appointment' : 'احجز موعدك'}
                          </p>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'Fill out the form with your details and consultation needs.' 
                              : 'املأ النموذج بتفاصيلك واحتياجات الاستشارة.'}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-4 rtl:ml-4 rtl:mr-0 w-8 h-8 rounded-full bg-agri text-white flex items-center justify-center font-bold">2</div>
                        <div>
                          <p className="font-semibold">
                            {language === 'en' ? 'Confirmation' : 'التأكيد'}
                          </p>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? "We'll contact you to confirm your appointment and collect any additional information." 
                              : 'سنتصل بك لتأكيد موعدك وجمع أي معلومات إضافية.'}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-4 rtl:ml-4 rtl:mr-0 w-8 h-8 rounded-full bg-agri text-white flex items-center justify-center font-bold">3</div>
                        <div>
                          <p className="font-semibold">
                            {language === 'en' ? 'Consultation Session' : 'جلسة الاستشارة'}
                          </p>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'Meet with our expert for a detailed discussion and actionable advice.' 
                              : 'اجتمع مع خبيرنا لمناقشة مفصلة ونصائح قابلة للتنفيذ.'}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-4 rtl:ml-4 rtl:mr-0 w-8 h-8 rounded-full bg-agri text-white flex items-center justify-center font-bold">4</div>
                        <div>
                          <p className="font-semibold">
                            {language === 'en' ? 'Follow Up' : 'المتابعة'}
                          </p>
                          <p className="text-gray-600">
                            {language === 'en' 
                              ? 'Receive a detailed report and follow-up support to implement recommendations.' 
                              : 'احصل على تقرير مفصل ودعم متابعة لتنفيذ التوصيات.'}
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{t('book.title')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="name">{t('book.name')}</Label>
                        <Input 
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t('book.email')}</Label>
                        <Input 
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('book.phone')}</Label>
                        <Input 
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>{t('book.date')}</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>{language === 'en' ? 'Pick a date' : 'اختر تاريخًا'}</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 pointer-events-auto">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                              className="p-3"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="time">{t('book.time')}</Label>
                        <Select value={time} onValueChange={setTime}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'en' ? 'Select a time' : 'اختر وقتًا'} />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="topic">{t('book.topic')}</Label>
                        <Select value={topic} onValueChange={setTopic}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === 'en' ? 'Select a topic' : 'اختر موضوعًا'} />
                          </SelectTrigger>
                          <SelectContent>
                            {topics.map((topic) => (
                              <SelectItem key={topic.value} value={topic.value}>
                                {topic.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">{t('book.message')}</Label>
                        <Textarea 
                          id="message"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={language === 'en' 
                            ? 'Please describe your query or issue...' 
                            : 'يرجى وصف استفسارك أو مشكلتك...'}
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-agri hover:bg-agri-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting 
                        ? (language === 'en' ? 'Booking...' : 'جاري الحجز...') 
                        : t('book.button')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookConsultation;
