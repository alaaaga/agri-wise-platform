
-- إضافة عمود newsletter_subscribed إلى جدول profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT false;
