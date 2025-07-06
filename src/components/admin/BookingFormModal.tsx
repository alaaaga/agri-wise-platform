
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { BookingDetails } from '@/types/booking';
import { Database } from '@/integrations/supabase/types';

type BookingStatus = Database['public']['Enums']['booking_status'];

interface BookingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: BookingDetails | null;
  onSuccess: () => void;
}

const BookingFormModal = ({ open, onOpenChange, booking, onSuccess }: BookingFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    booking_time: '',
    service_type: '',
    status: 'pending' as BookingStatus,
    price: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    if (booking) {
      setFormData({
        title: booking.title || '',
        description: booking.description || '',
        booking_time: booking.booking_time || '',
        service_type: booking.service_type || '',
        status: (booking.status as BookingStatus) || 'pending',
        price: booking.price?.toString() || '',
        duration: booking.duration?.toString() || '',
        notes: booking.notes || ''
      });
      if (booking.booking_date) {
        setDate(new Date(booking.booking_date));
      }
    } else {
      // Reset form for new booking
      setFormData({
        title: '',
        description: '',
        booking_time: '',
        service_type: '',
        status: 'pending',
        price: '',
        duration: '',
        notes: ''
      });
      setDate(undefined);
    }
  }, [booking, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error(language === 'en' ? 'Please select a date' : 'يرجى اختيار التاريخ');
      return;
    }

    setLoading(true);

    try {
      // الحصول على المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(language === 'en' ? 'Please login to create booking' : 'يرجى تسجيل الدخول لإنشاء الحجز');
        return;
      }

      const bookingData = {
        title: formData.title,
        description: formData.description || null,
        booking_date: format(date, 'yyyy-MM-dd'),
        booking_time: formData.booking_time,
        service_type: formData.service_type,
        status: formData.status,
        price: formData.price ? parseFloat(formData.price) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        notes: formData.notes || null,
        client_id: user.id // إضافة معرف العميل
      };

      let error;
      
      if (booking) {
        // Update existing booking
        const { error: updateError } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', booking.id);
        error = updateError;
      } else {
        // Create new booking
        const { error: insertError } = await supabase
          .from('bookings')
          .insert(bookingData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(
        booking 
          ? (language === 'en' ? 'Booking updated successfully' : 'تم تحديث الحجز بنجاح')
          : (language === 'en' ? 'Booking created successfully' : 'تم إنشاء الحجز بنجاح')
      );
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error('Error saving booking:', err);
      toast.error(language === 'en' ? 'Failed to save booking' : 'فشل في حفظ الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {booking 
              ? (language === 'en' ? 'Edit Booking' : 'تعديل الحجز')
              : (language === 'en' ? 'Create New Booking' : 'إنشاء حجز جديد')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">
                {language === 'en' ? 'Title' : 'العنوان'}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="service_type">
                {language === 'en' ? 'Service Type' : 'نوع الخدمة'}
              </Label>
              <Select
                value={formData.service_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select service' : 'اختر الخدمة'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">
                    {language === 'en' ? 'Phone Consultation (120 EGP)' : 'استشارة هاتفية (120 جنيه)'}
                  </SelectItem>
                  <SelectItem value="video">
                    {language === 'en' ? 'Video Consultation (150 EGP)' : 'استشارة مرئية (150 جنيه)'}
                  </SelectItem>
                  <SelectItem value="field_visit">
                    {language === 'en' ? 'Field Visit (300 EGP)' : 'زيارة ميدانية (300 جنيه)'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                {language === 'en' ? 'Date' : 'التاريخ'}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : (language === 'en' ? 'Pick a date' : 'اختر التاريخ')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="booking_time">
                {language === 'en' ? 'Time' : 'الوقت'}
              </Label>
              <Input
                id="booking_time"
                type="time"
                value={formData.booking_time}
                onChange={(e) => setFormData(prev => ({ ...prev, booking_time: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">
                {language === 'en' ? 'Duration (minutes)' : 'المدة (دقيقة)'}
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="60"
              />
            </div>

            <div>
              <Label htmlFor="price">
                {language === 'en' ? 'Price (EGP)' : 'السعر (جنيه)'}
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="status">
                {language === 'en' ? 'Status' : 'الحالة'}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: BookingStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {language === 'en' ? 'Pending' : 'معلق'}
                  </SelectItem>
                  <SelectItem value="confirmed">
                    {language === 'en' ? 'Confirmed' : 'مؤكد'}
                  </SelectItem>
                  <SelectItem value="completed">
                    {language === 'en' ? 'Completed' : 'مكتمل'}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {language === 'en' ? 'Cancelled' : 'ملغي'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              {language === 'en' ? 'Description' : 'الوصف'}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">
              {language === 'en' ? 'Notes' : 'ملاحظات'}
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading 
                ? (language === 'en' ? 'Saving...' : 'جاري الحفظ...')
                : booking 
                ? (language === 'en' ? 'Update' : 'تحديث')
                : (language === 'en' ? 'Create' : 'إنشاء')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;
