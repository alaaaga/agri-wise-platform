
-- إنشاء bucket جديد للمنتجات
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products', 
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- إنشاء سياسات للـ storage bucket للمنتجات
CREATE POLICY IF NOT EXISTS "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY IF NOT EXISTS "Users can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY IF NOT EXISTS "Users can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' AND 
  auth.uid() IS NOT NULL
);
