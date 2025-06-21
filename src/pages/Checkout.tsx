
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const Checkout = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || cartItems.length === 0) {
      toast.error(language === 'en' ? 'Please login and add items to cart' : 'يرجى تسجيل الدخول وإضافة عناصر للسلة');
      return;
    }

    if (!formData.shipping_address.trim() || !formData.phone.trim()) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      console.log('بدء إنشاء الطلب...', { user: user.id, cartItems, total: getCartTotal() });

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getCartTotal(),
          shipping_address: formData.shipping_address.trim(),
          phone: formData.phone.trim(),
          notes: formData.notes.trim() || null,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('خطأ في إنشاء الطلب:', orderError);
        throw orderError;
      }

      console.log('تم إنشاء الطلب بنجاح:', order);

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));

      console.log('إنشاء عناصر الطلب:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('خطأ في إنشاء عناصر الطلب:', itemsError);
        throw itemsError;
      }

      console.log('تم إنشاء عناصر الطلب بنجاح');

      // Clear cart
      await clearCart();

      toast.success(language === 'en' ? 'Order placed successfully!' : 'تم إرسال الطلب بنجاح!');
      navigate('/orders');
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      toast.error(language === 'en' ? 'Failed to place order. Please try again.' : 'فشل في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Your cart is empty' : 'سلتك فارغة'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'en' 
                ? 'Add some products to continue with checkout' 
                : 'أضف بعض المنتجات لمتابعة عملية الشراء'
              }
            </p>
            <Button onClick={() => navigate('/marketplace')}>
              {language === 'en' ? 'Go to Marketplace' : 'اذهب للمتجر'}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language === 'en' ? 'Checkout' : 'إتمام الطلب'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Shipping Information' : 'معلومات الشحن'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="shipping_address">
                    {language === 'en' ? 'Shipping Address *' : 'عنوان الشحن *'}
                  </Label>
                  <Textarea
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' 
                      ? 'Enter your full address' 
                      : 'أدخل عنوانك الكامل'
                    }
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {language === 'en' ? 'Phone Number *' : 'رقم الهاتف *'}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder={language === 'en' 
                      ? 'Enter your phone number' 
                      : 'أدخل رقم هاتفك'
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="notes">
                    {language === 'en' ? 'Order Notes (Optional)' : 'ملاحظات الطلب (اختياري)'}
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder={language === 'en' 
                      ? 'Any special instructions' 
                      : 'أي تعليمات خاصة'
                    }
                  />
                </div>
                
                <Button 
                  type="submit"
                  disabled={loading || !formData.shipping_address.trim() || !formData.phone.trim()}
                  className="w-full mt-6"
                >
                  {loading 
                    ? (language === 'en' ? 'Processing...' : 'جاري المعالجة...')
                    : (language === 'en' ? 'Place Order' : 'إتمام الطلب')
                  }
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex-1">
                    <p className="font-medium">
                      {language === 'en' ? item.product.name : item.product.name_ar}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'en' ? 'Quantity:' : 'الكمية:'} {item.quantity} {item.product.unit || 'وحدة'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'en' ? 'Unit price:' : 'سعر الوحدة:'} {item.product.price.toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {(item.product.price * item.quantity).toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}
                  </p>
                </div>
              ))}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                <span>{getCartTotal().toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
