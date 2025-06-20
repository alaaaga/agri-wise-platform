
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { language } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Loading cart...' : 'جاري تحميل السلة...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'Your cart is empty' : 'سلتك فارغة'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'en' 
                ? 'Start shopping to add items to your cart' 
                : 'ابدأ بالتسوق لإضافة منتجات لسلتك'
              }
            </p>
            <Link to="/marketplace">
              <Button>
                {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Cart Items' : 'عناصر السلة'} ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 rtl:space-x-reverse p-4 border rounded-lg">
                      <img
                        src={item.product.images?.[0] || '/placeholder.svg'}
                        alt={language === 'en' ? item.product.name : item.product.name_ar}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {language === 'en' ? item.product.name : item.product.name_ar}
                        </h3>
                        <p className="text-primary font-bold">
                          {item.product.price} {language === 'en' ? 'SAR' : 'ريال'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {(item.product.price * item.quantity).toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Subtotal:' : 'المجموع الفرعي:'}</span>
                    <span>{getCartTotal().toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Shipping:' : 'الشحن:'}</span>
                    <span>{language === 'en' ? 'Free' : 'مجاني'}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                      <span>{getCartTotal().toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
                    </div>
                  </div>
                  <Link to="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      {language === 'en' ? 'Proceed to Checkout' : 'متابعة الدفع'}
                    </Button>
                  </Link>
                  <Link to="/marketplace" className="block">
                    <Button variant="outline" className="w-full">
                      {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
