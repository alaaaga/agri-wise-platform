
-- تحديث جدول المنتجات لإضافة عملة الجنيه المصري
ALTER TABLE products ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EGP';

-- تحديث جدول الطلبات لإضافة عملة الجنيه المصري ومعلومات الدفع
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EGP';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- تحديث جدول عناصر الطلبات لإضافة العملة
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EGP';

-- تحديث جدول السلة لإضافة العملة
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EGP';

-- تحديث الأسعار الموجودة لتكون بالجنيه المصري (تحويل تقديري من الدولار)
UPDATE products SET price = price * 30 WHERE currency = 'EGP' OR currency IS NULL;
UPDATE products SET currency = 'EGP' WHERE currency IS NULL;

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
