
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Booking {
  id?: string;
  title: string;
  service_type: string;
  description?: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  price?: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface BookingFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking | null;
  onSuccess: () => void;
}

const BookingFormModal = ({ open, onOpenChange, booking, onSuccess }: BookingFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Booking>({
    title: '',
    service_type: '',
    description: '',
    booking_date: '',
    booking_time: '',
    duration: 60,
    price: 0,
    status: 'pending'
  });

  useEffect(() => {
    if (booking) {
      setFormData(booking);
    } else {
      setFormData({
        title: '',
        service_type: '',
        description: '',
        booking_date: '',
        booking_time: '',
        duration: 60,
        price: 0,
        status: 'pending'
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (booking?.id) {
        // تحديث حجز موجود
        const { error } = await supabase
          .from('bookings')
          .update({
            title: formData.title,
            service_type: formData.service_type,
            description: formData.description || null,
            booking_date: formData.booking_date,
            booking_time: formData.booking_time,
            duration: formData.duration,
            price: formData.price || null,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', booking.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Booking updated successfully' : 'تم تحديث الحجز بنجاح');
      } else {
        // إنشاء حجز جديد
        const { error } = await supabase
          .from('bookings')
          .insert({
            title: formData.title,
            service_type: formData.service_type,
            description: formData.description || null,
            booking_date: formData.booking_date,
            booking_time: formData.booking_time,
            duration: formData.duration,
            price: formData.price || null,
            status: formData.status,
            client_id: null, // سيتم تعديله لاحقاً
            consultant_id: null
          });

        if (error) throw error;
        toast.success(language === 'en' ? 'Booking created successfully' : 'تم إنشاء الحجز بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving booking:', error);
      toast.error(language === 'en' ? 'Error saving booking' : 'خطأ في حفظ الحجز');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {booking ? 
              (language === 'en' ? 'Edit Booking' : 'تعديل الحجز') : 
              (language === 'en' ? 'Create Booking' : 'إنشاء حجز جديد')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{language === 'en' ? 'Title' : 'العنوان'}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="service_type">{language === 'en' ? 'Service Type' : 'نوع الخدمة'}</Label>
            <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select service' : 'اختر الخدمة'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="استشارة المحاصيل">استشارة المحاصيل</SelectItem>
                <SelectItem value="تحليل التربة">تحليل التربة</SelectItem>
                <SelectItem value="استشارة الثروة الحيوانية">استشارة الثروة الحيوانية</SelectItem>
                <SelectItem value="استشارة التكنولوجيا الزراعية">استشارة التكنولوجيا الزراعية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="booking_date">{language === 'en' ? 'Date' : 'التاريخ'}</Label>
              <Input
                id="booking_date"
                type="date"
                value={formData.booking_date}
                onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="booking_time">{language === 'en' ? 'Time' : 'الوقت'}</Label>
              <Input
                id="booking_time"
                type="time"
                value={formData.booking_time}
                onChange={(e) => setFormData({...formData, booking_time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">{language === 'en' ? 'Duration (minutes)' : 'المدة (بالدقائق)'}</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 60})}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">{language === 'en' ? 'Price (EGP)' : 'السعر (جنيه)'}</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">{language === 'en' ? 'Status' : 'الحالة'}</Label>
            <Select value={formData.status} onValueChange={(value: 'pending' | 'confirmed' | 'cancelled' | 'completed') => setFormData({...formData, status: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">معلق</SelectItem>
                <SelectItem value="confirmed">مؤكد</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">{language === 'en' ? 'Description' : 'الوصف'}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                </>
              ) : (
                booking ? 
                  (language === 'en' ? 'Update Booking' : 'تحديث الحجز') : 
                  (language === 'en' ? 'Create Booking' : 'إنشاء الحجز')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFormModal;
