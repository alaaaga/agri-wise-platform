
-- إنشاء دالة RPC لتحويل المستخدم إلى مسؤول
CREATE OR REPLACE FUNCTION public.make_user_admin(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  update_count INT;
  current_user_admin BOOLEAN;
BEGIN
  -- التحقق من أن المستخدم الحالي مسؤول
  SELECT public.is_admin() INTO current_user_admin;
  
  IF NOT current_user_admin THEN
    RETURN 'غير مسموح: المستخدم الحالي ليس مسؤولاً';
  END IF;
  
  -- تحديث دور المستخدم المستهدف
  UPDATE public.profiles
  SET 
    role = 'admin',
    permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true, "can_manage_bookings": true, "can_view_analytics": true}'::jsonb,
    updated_at = now()
  WHERE id = target_user_id;
  
  GET DIAGNOSTICS update_count = ROW_COUNT;
  
  IF update_count > 0 THEN
    RETURN 'تم تحديث المستخدم إلى مسؤول بنجاح';
  ELSE
    RETURN 'لم يتم العثور على المستخدم';
  END IF;
END;
$$;
