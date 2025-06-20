
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  phone: string;
  shipping_address: string;
  notes: string;
  created_at: string;
  order_items: {
    quantity: number;
    price: number;
    products: {
      name: string;
      name_ar: string;
    };
  }[];
}

const Orders = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            products:product_id (
              name,
              name_ar
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(language === 'en' ? 'Failed to load orders' : 'فشل في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'secondary';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: { en: string; ar: string } } = {
      pending: { en: 'Pending', ar: 'في الانتظار' },
      confirmed: { en: 'Confirmed', ar: 'مؤكد' },
      shipped: { en: 'Shipped', ar: 'تم الشحن' },
      delivered: { en: 'Delivered', ar: 'تم التسليم' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' }
    };

    return statusMap[status]?.[language] || status;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Loading orders...' : 'جاري تحميل الطلبات...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language === 'en' ? 'My Orders' : 'طلباتي'}
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'No orders yet' : 'لا توجد طلبات بعد'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? 'Start shopping to place your first order' 
                : 'ابدأ بالتسوق لتقديم أول طلب لك'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString(
                          language === 'en' ? 'en-US' : 'ar-SA'
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        {language === 'en' ? 'Items' : 'العناصر'}
                      </h4>
                      <div className="space-y-2">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {language === 'en' ? item.products.name : item.products.name_ar} 
                              × {item.quantity}
                            </span>
                            <span>{(item.price * item.quantity).toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 font-semibold">
                          <div className="flex justify-between">
                            <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                            <span>{order.total_amount.toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        {language === 'en' ? 'Shipping Information' : 'معلومات الشحن'}
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-gray-500" />
                          <span>{order.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                          <span>{order.shipping_address}</span>
                        </div>
                        {order.notes && (
                          <div className="mt-3">
                            <span className="font-medium">
                              {language === 'en' ? 'Notes:' : 'ملاحظات:'}
                            </span>
                            <p className="text-gray-600 dark:text-gray-400">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
