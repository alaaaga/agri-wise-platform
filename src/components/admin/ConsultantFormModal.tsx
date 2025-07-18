
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type UserRole = Database['public']['Enums']['user_role'];

interface Consultant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  bio?: string;
  avatar_url?: string;
  phone_price?: number;
  video_price?: number;
  field_visit_price?: number;
}

interface ConsultantFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultant: Consultant | null;
  onSuccess: () => void;
}

const ConsultantFormModal = ({ open, onOpenChange, consultant, onSuccess }: ConsultantFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user' as UserRole,
    is_active: true,
    bio: '',
    password: '',
    phone_price: 120,
    video_price: 150,
    field_visit_price: 300
  });

  useEffect(() => {
    if (consultant) {
      setFormData({
        first_name: consultant.first_name || '',
        last_name: consultant.last_name || '',
        email: consultant.email || '',
        role: consultant.role || 'user',
        is_active: consultant.is_active ?? true,
        bio: consultant.bio || '',
        password: '',
        phone_price: consultant.phone_price || 120,
        video_price: consultant.video_price || 150,
        field_visit_price: consultant.field_visit_price || 300
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        is_active: true,
        bio: '',
        password: '',
        phone_price: 120,
        video_price: 150,
        field_visit_price: 300
      });
    }
  }, [consultant, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (consultant) {
        // تحديث مستشار موجود
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            role: formData.role,
            bio: formData.bio,
            is_active: formData.is_active,
            phone_price: formData.phone_price,
            video_price: formData.video_price,
            field_visit_price: formData.field_visit_price,
            updated_at: new Date().toISOString()
          })
          .eq('id', consultant.id);

        if (error) throw error;

        // تسجيل النشاط
        await supabase
          .from('recent_activities')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            activity_type: 'consultant_updated',
            title: 'تم تحديث مستشار',
            description: `${formData.first_name} ${formData.last_name}`
          });

        toast.success(language === 'en' ? 'Consultant updated successfully' : 'تم تحديث المستشار بنجاح');
      } else {
        // إنشاء مستشار جديد
        if (!formData.password || formData.password.length < 6) {
          toast.error(language === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          return;
        }

        // إنشاء مستخدم جديد في Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name,
              role: formData.role
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // إنشاء الملف الشخصي
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.email,
              first_name: formData.first_name,
              last_name: formData.last_name,
              role: formData.role,
              bio: formData.bio,
              is_active: formData.is_active,
              phone_price: formData.phone_price,
              video_price: formData.video_price,
              field_visit_price: formData.field_visit_price
            });

          if (profileError) throw profileError;

          // تسجيل النشاط
          await supabase
            .from('recent_activities')
            .insert({
              user_id: (await supabase.auth.getUser()).data.user?.id,
              activity_type: 'consultant_created',
              title: 'تم إنشاء مستشار جديد',
              description: `${formData.first_name} ${formData.last_name}`
            });
        }

        toast.success(language === 'en' ? 'Consultant created successfully' : 'تم إنشاء المستشار بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving consultant:', error);
      toast.error(error.message || (language === 'en' ? 'Error saving consultant' : 'خطأ في حفظ المستشار'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {consultant 
              ? (language === 'en' ? 'Edit Consultant' : 'تعديل المستشار')
              : (language === 'en' ? 'Add New Consultant' : 'إضافة مستشار جديد')
            }
          </DialogTitle>
          <DialogDescription>
            {language === 'en' 
              ? 'Fill in the consultant information below.'
              : 'املأ معلومات المستشار أدناه.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">
                {language === 'en' ? 'First Name' : 'الاسم الأول'} *
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                placeholder={language === 'en' ? 'Enter first name' : 'أدخل الاسم الأول'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">
                {language === 'en' ? 'Last Name' : 'اسم العائلة'} *
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                placeholder={language === 'en' ? 'Enter last name' : 'أدخل اسم العائلة'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              {language === 'en' ? 'Email' : 'البريد الإلكتروني'} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder={language === 'en' ? 'Enter email address' : 'أدخل البريد الإلكتروني'}
            />
          </div>

          {!consultant && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {language === 'en' ? 'Password' : 'كلمة المرور'} *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder={language === 'en' ? 'Enter password (min 6 characters)' : 'أدخل كلمة المرور (6 أحرف على الأقل)'}
                minLength={6}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">
              {language === 'en' ? 'Role' : 'الدور'} *
            </Label>
            <Select value={formData.role} onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select role' : 'اختر الدور'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  {language === 'en' ? 'User' : 'مستخدم'}
                </SelectItem>
                <SelectItem value="moderator">
                  {language === 'en' ? 'Moderator' : 'مشرف'}
                </SelectItem>
                <SelectItem value="admin">
                  {language === 'en' ? 'Admin' : 'مدير'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* أسعار الاستشارات */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">
              {language === 'en' ? 'Consultation Prices' : 'أسعار الاستشارات'}
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_price">
                  {language === 'en' ? 'Phone Price (EGP)' : 'سعر المكالمة (جنيه)'}
                </Label>
                <Input
                  id="phone_price"
                  type="number"
                  value={formData.phone_price}
                  onChange={(e) => setFormData({ ...formData, phone_price: parseInt(e.target.value) || 0 })}
                  placeholder="120"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video_price">
                  {language === 'en' ? 'Video Price (EGP)' : 'سعر الفيديو (جنيه)'}
                </Label>
                <Input
                  id="video_price"
                  type="number"
                  value={formData.video_price}
                  onChange={(e) => setFormData({ ...formData, video_price: parseInt(e.target.value) || 0 })}
                  placeholder="150"
                  min="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="field_visit_price">
                  {language === 'en' ? 'Field Visit Price (EGP)' : 'سعر الزيارة الميدانية (جنيه)'}
                </Label>
                <Input
                  id="field_visit_price"
                  type="number"
                  value={formData.field_visit_price}
                  onChange={(e) => setFormData({ ...formData, field_visit_price: parseInt(e.target.value) || 0 })}
                  placeholder="300"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              {language === 'en' ? 'Bio' : 'النبذة الشخصية'}
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={language === 'en' ? 'Enter consultant bio' : 'أدخل النبذة الشخصية للمستشار'}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">
              {language === 'en' ? 'Active' : 'نشط'}
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {consultant 
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

export default ConsultantFormModal;
