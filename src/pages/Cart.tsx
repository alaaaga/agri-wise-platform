
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Please login to view your cart' : 'يرجى تسجيل الدخول لعرض سلتك'}
            </h2>
            <Button onClick={() => navigate('/login')}>
              {language === 'en' ? 'Login' : 'تسجيل الدخول'}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Your cart is empty' : 'سلتك فارغة'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'en' 
                ? 'Add some products from the marketplace' 
                : 'أضف بعض المنتجات من المتجر'
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
          {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <img
                      src={item.product.images?.[0] || '/placeholder.svg'}
                      alt={language === 'en' ? item.product.name : item.product.name_ar}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {language === 'en' ? item.product.name : item.product.name_ar}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        {item.product.price.toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Unit:' : 'الوحدة:'} {item.product.unit || 'وحدة'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
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
                      <p className="text-lg font-bold">
                        {(item.product.price * item.quantity).toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{language === 'en' ? 'Items:' : 'العناصر:'}</span>
                    <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                    <span>{getCartTotal().toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/checkout')}
                  disabled={cartItems.length === 0}
                >
                  {language === 'en' ? 'Proceed to Checkout' : 'إتمام الطلب'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/marketplace')}
                >
                  {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
