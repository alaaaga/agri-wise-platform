
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    
    setIsSubmitting(true);
    
    // محاكاة عملية الحجز
    setTimeout(() => {
      setIsSubmitting(false);
      onBookingSuccess();
    }, 1000);
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
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={consultant.image} 
              alt={consultant.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{consultant.name}</h3>
              {consultant.specialty && (
                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                  {consultant.specialty}
                </span>
              )}
            </div>
            <div className="ml-auto">
              <span className="font-bold text-lg text-agri-dark">
                {language === 'ar' ? `${consultant.price} ج` : `EGP ${consultant.price}`}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
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
                <label className="text-sm font-medium">
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
                {language === 'en' ? 'Additional Information' : 'معلومات إضافية'}
              </label>
              <Textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'en' 
                  ? 'Describe your issue or question...' 
                  : 'اشرح مشكلتك أو سؤالك...'}
                rows={3}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-agri hover:bg-agri-dark"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (language === 'en' ? 'Booking...' : 'جاري الحجز...') 
                  : (language === 'en' ? 'Confirm Booking' : 'تأكيد الحجز')}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
