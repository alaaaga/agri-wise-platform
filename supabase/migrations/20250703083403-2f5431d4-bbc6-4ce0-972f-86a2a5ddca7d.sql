
-- التحقق من وجود دالة إنشاء المستشارين وإضافتها إذا لم تكن موجودة
CREATE OR REPLACE FUNCTION public.create_consultant(
  consultant_email text,
  consultant_password text,
  consultant_first_name text,
  consultant_last_name text,
  consultant_role text DEFAULT 'user',
  consultant_bio text DEFAULT NULL,
  consultant_specialty text DEFAULT NULL,
  consultant_experience_years integer DEFAULT NULL,
  consultant_hourly_rate numeric DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  consultant_id uuid;
BEGIN
  -- التحقق من صلاحيات المسؤول
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مسموح: ليس لديك صلاحيات لإنشاء المستشارين';
  END IF;
  
  -- إنشاء المستخدم في Auth
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    role
  ) VALUES (
    consultant_email,
    crypt(consultant_password, gen_salt('bf')),
    now(),
    json_build_object(
      'first_name', consultant_first_name,
      'last_name', consultant_last_name,
      'role', consultant_role
    ),
    'authenticated'
  ) RETURNING id INTO new_user_id;
  
  -- إنشاء الملف الشخصي
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    bio,
    is_active
  ) VALUES (
    new_user_id,
    consultant_email,
    consultant_first_name,
    consultant_last_name,
    consultant_role::user_role,
    consultant_bio,
    true
  ) RETURNING id INTO consultant_id;
  
  -- تسجيل النشاط
  INSERT INTO public.recent_activities (
    user_id, activity_type, title, description
  ) VALUES (
    auth.uid(), 'consultant_created', 'تم إنشاء مستشار جديد', 
    consultant_first_name || ' ' || consultant_last_name
  );
  
  RETURN consultant_id;
END;
$$;

-- التأكد من وجود دالة تحديث المستشار
CREATE OR REPLACE FUNCTION public.update_consultant(
  consultant_id uuid,
  consultant_first_name text,
  consultant_last_name text,
  consultant_email text,
  consultant_role text DEFAULT 'user',
  consultant_bio text DEFAULT NULL,
  consultant_is_active boolean DEFAULT true
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- التحقق من صلاحيات المسؤول
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مسموح: ليس لديك صلاحيات لتحديث المستشارين';
  END IF;
  
  -- تحديث الملف الشخصي
  UPDATE public.profiles SET
    first_name = consultant_first_name,
    last_name = consultant_last_name,
    email = consultant_email,
    role = consultant_role::user_role,
    bio = consultant_bio,
    is_active = consultant_is_active,
    updated_at = now()
  WHERE id = consultant_id;
  
  -- تسجيل النشاط
  INSERT INTO public.recent_activities (
    user_id, activity_type, title, description
  ) VALUES (
    auth.uid(), 'consultant_updated', 'تم تحديث مستشار', 
    consultant_first_name || ' ' || consultant_last_name
  );
  
  RETURN TRUE;
END;
$$;

-- التأكد من وجود دالة تحديث المقالات مع دعم اللغتين
CREATE OR REPLACE FUNCTION public.create_article_multilang(
  article_title text,
  article_title_ar text DEFAULT NULL,
  article_content text,
  article_content_ar text DEFAULT NULL,
  article_category text,
  article_excerpt text DEFAULT NULL,
  article_excerpt_ar text DEFAULT NULL,
  article_image_url text DEFAULT NULL,
  article_tags text[] DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_article_id UUID;
BEGIN
  -- التحقق من صلاحيات المسؤول
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مسموح: ليس لديك صلاحيات لإنشاء المقالات';
  END IF;
  
  -- إنشاء المقال
  INSERT INTO public.articles (
    title, content, category, excerpt, image_url, tags, 
    author_id, status, published_at
  ) VALUES (
    COALESCE(article_title_ar, article_title), 
    COALESCE(article_content_ar, article_content), 
    article_category, 
    COALESCE(article_excerpt_ar, article_excerpt), 
    article_image_url, 
    article_tags, 
    auth.uid(), 
    'published'::content_status,
    now()
  ) RETURNING id INTO new_article_id;
  
  -- تسجيل النشاط
  INSERT INTO public.recent_activities (
    user_id, activity_type, title, description
  ) VALUES (
    auth.uid(), 'article_created', 'تم إنشاء مقال جديد', 
    COALESCE(article_title_ar, article_title)
  );
  
  RETURN new_article_id;
END;
$$;

-- إضافة صلاحيات الوصول للجداول للمستخدمين المصرح لهم
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
