
-- إنشاء جدول الفئات
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  description_ar TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id),
  seller_id UUID REFERENCES public.profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول عناصر السلة
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول عناصر الطلبات
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) NOT NULL,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل أمان الصفوف للجداول
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للفئات (قراءة للجميع)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- سياسات الأمان للمنتجات (قراءة للجميع، تعديل للبائع فقط)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can manage their own products" ON public.products FOR ALL USING (auth.uid() = seller_id);

-- سياسات الأمان لعناصر السلة
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- سياسات الأمان للطلبات
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- سياسات الأمان لعناصر الطلبات
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- إدراج بعض الفئات التجريبية
INSERT INTO public.categories (name, name_ar, description, description_ar) VALUES
('Vegetables', 'خضروات', 'Fresh vegetables from local farms', 'خضروات طازجة من المزارع المحلية'),
('Fruits', 'فواكه', 'Seasonal fruits', 'فواكه موسمية'),
('Grains', 'حبوب', 'Various grains and cereals', 'حبوب ومحاصيل متنوعة'),
('Dairy', 'منتجات الألبان', 'Fresh dairy products', 'منتجات الألبان الطازجة')
ON CONFLICT DO NOTHING;

-- إدراج بعض المنتجات التجريبية
INSERT INTO public.products (name, name_ar, description, description_ar, price, stock_quantity, unit, category_id) VALUES
('Tomatoes', 'طماطم', 'Fresh red tomatoes', 'طماطم حمراء طازجة', 15.00, 100, 'kg', (SELECT id FROM public.categories WHERE name = 'Vegetables' LIMIT 1)),
('Cucumbers', 'خيار', 'Fresh cucumbers', 'خيار طازج', 8.00, 80, 'kg', (SELECT id FROM public.categories WHERE name = 'Vegetables' LIMIT 1)),
('Apples', 'تفاح', 'Red apples', 'تفاح أحمر', 25.00, 50, 'kg', (SELECT id FROM public.categories WHERE name = 'Fruits' LIMIT 1)),
('Wheat', 'قمح', 'Premium wheat', 'قمح ممتاز', 35.00, 200, 'kg', (SELECT id FROM public.categories WHERE name = 'Grains' LIMIT 1))
ON CONFLICT DO NOTHING;
