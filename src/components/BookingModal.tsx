import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CalendarIcon, Video, Phone, Clock, Check, CreditCard, BadgeDollarSign, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Consultant {
  id: string;
  name: string;
  image: string;
  price: number;
  specialty?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant | null;
  onBookingSuccess: () => void;
}

export const BookingModal = ({ 
  isOpen, 
  onClose, 
  consultant, 
  onBookingSuccess 
}: BookingModalProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<string>('video');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit');
  
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'معلومات ناقصة',
        description: language === 'en' 
          ? 'Please select a date and time for your consultation.' 
          : 'الرجاء اختيار تاريخ ووقت للاستشارة.',
        variant: 'destructive'
      });
      return;
    }
    
    // Move to payment step
    setCurrentStep('payment');
  };
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !consultant || !date) {
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Missing required information' : 'معلومات مطلوبة مفقودة',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Creating booking with data:', {
        client_id: user.id,
        consultant_id: consultant.id,
        booking_date: date.toISOString().split('T')[0],
        booking_time: time,
        service_type: consultationType,
        title: `${language === 'en' ? 'Consultation with' : 'استشارة مع'} ${consultant.name}`,
        description: message || null,
        price: consultant.price,
        status: 'pending'
      });

      // Save booking to database
      const { error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          consultant_id: consultant.id,
          booking_date: date.toISOString().split('T')[0],
          booking_time: time,
          service_type: consultationType,
          title: `${language === 'en' ? 'Consultation with' : 'استشارة مع'} ${consultant.name}`,
          description: message || null,
          price: consultant.price,
          status: 'pending',
          notes: `${language === 'en' ? 'Payment method:' : 'طريقة الدفع:'} ${paymentMethod === 'credit' ? (language === 'en' ? 'Credit Card' : 'بطاقة ائتمان') : (language === 'en' ? 'Mobile Wallet' : 'محفظة إلكترونية')}`
        });

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      // Also save to localStorage for immediate access
      const bookingId = `booking-${Date.now()}`;
      const newBooking = {
        id: bookingId,
        consultantId: consultant.id,
        consultantName: consultant.name,
        consultantImage: consultant.image,
        consultantSpecialty: consultant.specialty || '',
        userId: user.id,
        date: date.toISOString(),
        time,
        consultationType,
        message,
        price: consultant.price,
        status: 'upcoming',
        paymentMethod,
        createdAt: new Date().toISOString(),
      };
      
      // Get existing bookings
      const existingBookingsJSON = localStorage.getItem('agriadvisor_bookings');
      const existingBookings = existingBookingsJSON ? JSON.parse(existingBookingsJSON) : [];
      
      // Add new booking
      existingBookings.push(newBooking);
      
      // Save updated bookings
      localStorage.setItem('agriadvisor_bookings', JSON.stringify(existingBookings));

      toast({
        title: language === 'en' ? 'Payment Successful!' : 'تمت عملية الدفع بنجاح!',
        description: language === 'en'
          ? 'Your booking has been confirmed.'
          : 'تم تأكيد حجزك.',
      });
      
      onBookingSuccess();
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: language === 'en' ? 'Booking Failed' : 'فشل في الحجز',
        description: language === 'en' 
          ? 'There was an error processing your booking. Please try again.' 
          : 'حدث خطأ أثناء معالجة حجزك. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const goBackToDetails = () => {
    setCurrentStep('details');
  };
  
  if (!consultant) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'en' 
              ? `Book a consultation with ${consultant.name}` 
              : `حجز استشارة مع ${consultant.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <img 
              src={consultant.image} 
              alt={consultant.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-agri"
            />
            <div>
              <h3 className="font-semibold text-lg">{consultant.name}</h3>
              {consultant.specialty && (
                <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200">
                  {consultant.specialty}
                </Badge>
              )}
            </div>
            <div className="ml-auto">
              <span className="font-bold text-lg text-agri-dark">
                {language === 'ar' ? `${consultant.price} ج` : `EGP ${consultant.price}`}
              </span>
            </div>
          </div>
          
          {currentStep === 'details' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {language === 'en' ? 'Consultation Type' : 'نوع الاستشارة'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={consultationType === 'video' ? 'default' : 'outline'}
                    className={cn(
                      "flex items-center justify-center gap-2 text-xs px-2 py-2",
                      consultationType === 'video' ? 'bg-agri hover:bg-agri-dark' : ''
                    )}
                    onClick={() => setConsultationType('video')}
                  >
                    <Video className="h-3 w-3" />
                    {language === 'en' ? 'Video' : 'فيديو'}
                    {consultationType === 'video' && <Check className="h-2 w-2 ml-1" />}
                  </Button>
                  <Button
                    type="button"
                    variant={consultationType === 'voice' ? 'default' : 'outline'}
                    className={cn(
                      "flex items-center justify-center gap-2 text-xs px-2 py-2",
                      consultationType === 'voice' ? 'bg-agri hover:bg-agri-dark' : ''
                    )}
                    onClick={() => setConsultationType('voice')}
                  >
                    <Phone className="h-3 w-3" />
                    {language === 'en' ? 'Voice' : 'صوتي'}
                    {consultationType === 'voice' && <Check className="h-2 w-2 ml-1" />}
                  </Button>
                  <Button
                    type="button"
                    variant={consultationType === 'field_visit' ? 'default' : 'outline'}
                    className={cn(
                      "flex items-center justify-center gap-2 text-xs px-2 py-2",
                      consultationType === 'field_visit' ? 'bg-agri hover:bg-agri-dark' : ''
                    )}
                    onClick={() => setConsultationType('field_visit')}
                  >
                    <MapPin className="h-3 w-3" />
                    {language === 'en' ? 'Field Visit' : 'زيارة ميدانية'}
                    {consultationType === 'field_visit' && <Check className="h-2 w-2 ml-1" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {language === 'en' ? 'Select Date' : 'اختر التاريخ'}
                  </label>
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
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {language === 'en' ? 'Select Time' : 'اختر الوقت'}
                  </label>
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
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {consultationType === 'field_visit' 
                    ? (language === 'en' ? 'Location & Additional Information' : 'الموقع والمعلومات الإضافية')
                    : (language === 'en' ? 'Additional Information' : 'معلومات إضافية')
                  }
                </label>
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={consultationType === 'field_visit' 
                    ? (language === 'en' 
                      ? 'Please provide your farm/field location and describe your issue...' 
                      : 'يرجى تقديم موقع المزرعة/الحقل ووصف المشكلة...')
                    : (language === 'en' 
                      ? 'Describe your issue or question...' 
                      : 'اشرح مشكلتك أو سؤالك...')
                  }
                  rows={consultationType === 'field_visit' ? 4 : 3}
                  required={consultationType === 'field_visit'}
                />
                {consultationType === 'field_visit' && (
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' 
                      ? 'Field visits require location details and may have additional travel charges'
                      : 'الزيارات الميدانية تتطلب تفاصيل الموقع وقد تتضمن رسوم سفر إضافية'
                    }
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-agri hover:bg-agri-dark flex items-center justify-center gap-2"
                >
                  {language === 'en' ? 'Continue to Payment' : 'متابعة للدفع'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                <h3 className="font-semibold mb-2 text-center">
                  {language === 'en' ? 'Booking Summary' : 'ملخص الحجز'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Date:' : 'التاريخ:'}
                    </span>
                    <span className="font-medium">
                      {date ? format(date, "PPP") : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Time:' : 'الوقت:'}
                    </span>
                    <span className="font-medium">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {language === 'en' ? 'Type:' : 'النوع:'}
                    </span>
                    <span className="font-medium">
                      {consultationType === 'video' 
                        ? (language === 'en' ? 'Video Call' : 'مكالمة فيديو')
                        : (language === 'en' ? 'Voice Call' : 'مكالمة صوتية')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-yellow-200 mt-2">
                    <span className="font-bold">
                      {language === 'en' ? 'Total:' : 'المجموع:'}
                    </span>
                    <span className="font-bold text-agri-dark">
                      {language === 'ar' ? `${consultant.price} ج` : `EGP ${consultant.price}`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-center">
                  {language === 'en' ? 'Select Payment Method' : 'اختر طريقة الدفع'}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-6",
                      paymentMethod === 'credit' ? 'bg-agri hover:bg-agri-dark' : ''
                    )}
                    onClick={() => setPaymentMethod('credit')}
                  >
                    <CreditCard className="h-8 w-8" />
                    <span>{language === 'en' ? 'Credit Card' : 'بطاقة ائتمان'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                    className={cn(
                      "flex-1 flex flex-col items-center justify-center gap-2 py-6",
                      paymentMethod === 'wallet' ? 'bg-agri hover:bg-agri-dark' : ''
                    )}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <BadgeDollarSign className="h-8 w-8" />
                    <span>{language === 'en' ? 'Mobile Wallet' : 'محفظة إلكترونية'}</span>
                  </Button>
                </div>
              </div>
              
              <div className="pt-6 flex gap-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={goBackToDetails}
                >
                  {language === 'en' ? 'Back' : 'رجوع'}
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-agri hover:bg-agri-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...')
                    : (language === 'en' ? 'Complete Payment' : 'إتمام الدفع')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
