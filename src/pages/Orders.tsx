
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    name_ar: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone: string;
  notes: string;
  created_at: string;
  order_items: OrderItem[];
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
            id,
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

      const formattedOrders = data?.map(order => ({
        ...order,
        order_items: order.order_items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: item.products
        }))
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'en' ? 'Pending' : 'قيد الانتظار',
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      shipped: language === 'en' ? 'Shipped' : 'تم الشحن',
      delivered: language === 'en' ? 'Delivered' : 'تم التسليم',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
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
            <Package className="h-24 w-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'No orders yet' : 'لا توجد طلبات بعد'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? 'Your orders will appear here once you make a purchase' 
                : 'ستظهر طلباتك هنا بمجرد قيامك بعملية شراء'
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
                      <CardTitle className="text-lg">
                        {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        {language === 'en' ? 'Items:' : 'المنتجات:'}
                      </h4>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span>
                              {language === 'en' ? item.product.name : item.product.name_ar} x {item.quantity}
                            </span>
                            <span className="font-medium">
                              {(item.price * item.quantity).toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        {language === 'en' ? 'Shipping Address:' : 'عنوان الشحن:'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shipping_address}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                      <span>{language === 'en' ? 'Total:' : 'المجموع:'}</span>
                      <span>{order.total_amount.toFixed(2)} {language === 'en' ? 'SAR' : 'ريال'}</span>
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
