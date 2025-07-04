
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

interface FieldVisit {
  id?: string;
  client_name: string;
  client_phone: string;
  visit_date: string;
  visit_time: string;
  location: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
}

interface FieldVisitFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit?: FieldVisit | null;
  onSuccess: () => void;
}

const FieldVisitFormModal = ({ open, onOpenChange, visit, onSuccess }: FieldVisitFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FieldVisit>({
    client_name: '',
    client_phone: '',
    visit_date: '',
    visit_time: '',
    location: '',
    service_type: 'زيارة ميدانية',
    status: 'pending',
    notes: '',
    price: 0
  });

  useEffect(() => {
    if (visit) {
      setFormData(visit);
    } else {
      setFormData({
        client_name: '',
        client_phone: '',
        visit_date: '',
        visit_time: '',
        location: '',
        service_type: 'زيارة ميدانية',
        status: 'pending',
        notes: '',
        price: 0
      });
    }
  }, [visit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        title: formData.client_name,
        description: formData.location,
        booking_date: formData.visit_date,
        booking_time: formData.visit_time,
        service_type: 'field_visit',
        status: formData.status,
        notes: formData.notes || null,
        price: formData.price || null,
        duration: 120, // زيارة ميدانية تستغرق ساعتين عادة
        client_id: null, // يمكن ربطها بالعميل لاحقاً
        consultant_id: null
      };

      if (visit?.id) {
        // تحديث زيارة موجودة
        const { error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', visit.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Field visit updated successfully' : 'تم تحديث الزيارة الميدانية بنجاح');
      } else {
        // إنشاء زيارة جديدة
        const { error } = await supabase
          .from('bookings')
          .insert(bookingData);

        if (error) throw error;
        toast.success(language === 'en' ? 'Field visit created successfully' : 'تم إنشاء الزيارة الميدانية بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving field visit:', error);
      toast.error(language === 'en' 
        ? `Error saving field visit: ${error instanceof Error ? error.message : 'Unknown error'}` 
        : `خطأ في حفظ الزيارة الميدانية: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {visit ? 
              (language === 'en' ? 'Edit Field Visit' : 'تعديل الزيارة الميدانية') : 
              (language === 'en' ? 'Create Field Visit' : 'إنشاء زيارة ميدانية جديدة')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">{language === 'en' ? 'Client Name' : 'اسم العميل'}</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="client_phone">{language === 'en' ? 'Phone Number' : 'رقم الهاتف'}</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visit_date">{language === 'en' ? 'Visit Date' : 'تاريخ الزيارة'}</Label>
              <Input
                id="visit_date"
                type="date"
                value={formData.visit_date}
                onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="visit_time">{language === 'en' ? 'Visit Time' : 'وقت الزيارة'}</Label>
              <Input
                id="visit_time"
                type="time"
                value={formData.visit_time}
                onChange={(e) => setFormData({...formData, visit_time: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">{language === 'en' ? 'Location' : 'الموقع'}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder={language === 'en' ? 'Farm address or location' : 'عنوان المزرعة أو الموقع'}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{language === 'en' ? 'Status' : 'الحالة'}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{language === 'en' ? 'Pending' : 'معلق'}</SelectItem>
                  <SelectItem value="confirmed">{language === 'en' ? 'Confirmed' : 'مؤكد'}</SelectItem>
                  <SelectItem value="completed">{language === 'en' ? 'Completed' : 'مكتمل'}</SelectItem>
                  <SelectItem value="cancelled">{language === 'en' ? 'Cancelled' : 'ملغي'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">{language === 'en' ? 'Price (EGP)' : 'السعر (جنيه)'}</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{language === 'en' ? 'Notes' : 'ملاحظات'}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              placeholder={language === 'en' ? 'Additional notes about the visit' : 'ملاحظات إضافية حول الزيارة'}
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
                visit ? 
                  (language === 'en' ? 'Update Visit' : 'تحديث الزيارة') : 
                  (language === 'en' ? 'Create Visit' : 'إنشاء الزيارة')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FieldVisitFormModal;
