
-- إضافة أعمدة الأسعار لجدول profiles للمستشارين
ALTER TABLE public.profiles 
ADD COLUMN phone_price INTEGER DEFAULT 120,
ADD COLUMN video_price INTEGER DEFAULT 150,
ADD COLUMN field_visit_price INTEGER DEFAULT 300;

-- تحديث البيانات الموجودة للمستشارين
UPDATE public.profiles 
SET 
  phone_price = 120,
  video_price = 150,
  field_visit_price = 300
WHERE role IN ('admin', 'moderator');
