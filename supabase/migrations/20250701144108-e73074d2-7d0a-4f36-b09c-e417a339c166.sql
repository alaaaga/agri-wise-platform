
-- إنشاء جدول إحصائيات لوحة التحكم إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.dashboard_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  metric_value INTEGER DEFAULT 0,
  previous_value INTEGER DEFAULT 0,
  percentage_change NUMERIC DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول الأنشطة الحديثة إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS public.recent_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تحديث جدول الطلبات لإضافة حقول إضافية للتحكم
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- تحديث enum لحالات الطلبات
DO $$ BEGIN
    CREATE TYPE order_status_enum AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- تحديث البيانات الموجودة أولاً لتكون متوافقة
UPDATE public.orders SET status = 'pending' WHERE status IS NULL OR status = '';

-- تحديث عمود الحالة ليستخدم enum مع إزالة الافتراضي أولاً
ALTER TABLE public.orders ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.orders ALTER COLUMN status TYPE order_status_enum USING 
  CASE 
    WHEN status = 'pending' THEN 'pending'::order_status_enum
    WHEN status = 'confirmed' THEN 'confirmed'::order_status_enum
    WHEN status = 'processing' THEN 'processing'::order_status_enum
    WHEN status = 'shipped' THEN 'shipped'::order_status_enum
    WHEN status = 'delivered' THEN 'delivered'::order_status_enum
    WHEN status = 'cancelled' THEN 'cancelled'::order_status_enum
    WHEN status = 'refunded' THEN 'refunded'::order_status_enum
    ELSE 'pending'::order_status_enum
  END;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending'::order_status_enum;

-- إنشاء سياسات RLS للجداول الجديدة
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activities ENABLE ROW LEVEL SECURITY;

-- سياسات للإحصائيات (المسؤولون فقط)
DROP POLICY IF EXISTS "Admin can manage dashboard stats" ON public.dashboard_stats;
CREATE POLICY "Admin can manage dashboard stats" ON public.dashboard_stats
FOR ALL USING (public.is_admin());

-- سياسات للأنشطة الحديثة
DROP POLICY IF EXISTS "Admin can view activities" ON public.recent_activities;
CREATE POLICY "Admin can view activities" ON public.recent_activities
FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users can create activities" ON public.recent_activities;
CREATE POLICY "Users can create activities" ON public.recent_activities
FOR INSERT WITH CHECK (user_id = auth.uid());

-- إنشاء وظيفة لتحديث حالة الطلب
CREATE OR REPLACE FUNCTION public.update_order_status(
  order_id UUID,
  new_status TEXT,
  admin_notes TEXT DEFAULT NULL,
  tracking_number TEXT DEFAULT NULL,
  estimated_delivery DATE DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من صلاحيات المسؤول
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مسموح: ليس لديك صلاحيات لتحديث الطلبات';
  END IF;
  
  -- تحديث الطلب
  UPDATE public.orders 
  SET 
    status = new_status::order_status_enum,
    admin_notes = COALESCE(update_order_status.admin_notes, orders.admin_notes),
    tracking_number = COALESCE(update_order_status.tracking_number, orders.tracking_number),
    estimated_delivery_date = COALESCE(update_order_status.estimated_delivery, orders.estimated_delivery_date),
    updated_at = NOW()
  WHERE id = order_id;
  
  -- تسجيل النشاط
  INSERT INTO public.recent_activities (
    user_id, activity_type, title, description
  ) VALUES (
    auth.uid(), 'order_updated', 'تحديث حالة طلب', 
    'تم تحديث حالة الطلب إلى: ' || new_status
  );
  
  RETURN TRUE;
END;
$$;

-- إنشاء وظيفة لجلب إحصائيات لوحة التحكم
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS TABLE(
  total_orders BIGINT,
  pending_orders BIGINT,
  total_revenue NUMERIC,
  total_users BIGINT,
  total_products BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من صلاحيات المسؤول
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مسموح: ليس لديك صلاحيات لعرض الإحصائيات';
  END IF;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.orders WHERE status = 'pending') as pending_orders,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE payment_status = 'paid') as total_revenue,
    (SELECT COUNT(*) FROM public.profiles) as total_users,
    (SELECT COUNT(*) FROM public.products WHERE is_active = true) as total_products;
END;
$$;

-- إضافة سياسة للمسؤولين لإدارة الطلبات
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders" ON public.orders
FOR ALL USING (public.is_admin());

-- إدراج بيانات أساسية للإحصائيات
INSERT INTO public.dashboard_stats (metric_name, metric_value) VALUES
('total_orders', 0),
('pending_orders', 0),
('total_revenue', 0),
('active_users', 0),
('total_products', 0)
ON CONFLICT (metric_name) DO NOTHING;

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_recent_activities_created_at ON public.recent_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_recent_activities_user_id ON public.recent_activities(user_id);
