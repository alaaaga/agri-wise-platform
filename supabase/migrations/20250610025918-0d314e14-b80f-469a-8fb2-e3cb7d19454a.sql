
-- إنشاء دالة لتحويل مستخدم إلى مسؤول
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  update_count INT;
BEGIN
  -- الحصول على معرف المستخدم من جدول المصادقة
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'لم يتم العثور على المستخدم بهذا البريد الإلكتروني: ' || user_email;
  END IF;
  
  -- تحديث دور المستخدم وصلاحياته
  UPDATE public.profiles
  SET 
    role = 'admin',
    permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true}',
    updated_at = now()
  WHERE id = user_id;
  
  GET DIAGNOSTICS update_count = ROW_COUNT;
  
  IF update_count > 0 THEN
    RETURN 'تم تحديث المستخدم إلى مسؤول بنجاح مع جميع الصلاحيات';
  ELSE
    RETURN 'فشل في تحديث المستخدم. قد لا يكون الملف الشخصي موجوداً';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- تعيين المستخدم lolaga4230@gmail.com كمسؤول
SELECT public.set_user_as_admin('lolaga4230@gmail.com');

-- التأكد من أن جميع المسؤولين لديهم الصلاحيات الكاملة
UPDATE public.profiles
SET permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true}'
WHERE role = 'admin';
