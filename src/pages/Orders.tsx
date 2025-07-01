
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Phone, MapPin, Calendar, Clock, User, FileText, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  currency: string;
  product: {
    name: string;
    name_ar: string;
    unit: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      console.log('جاري جلب الطلبات للمستخدم:', user.id);
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            currency,
            products:product_id (
              name,
              name_ar,
              unit
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب الطلبات:', error);
        throw error;
      }

      console.log('تم جلب الطلبات بنجاح:', data);

      const formattedOrders = data?.map(order => ({
        ...order,
        order_items: order.order_items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency || 'EGP',
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

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
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

  const getPaymentStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'en' ? 'Pending' : 'في الانتظار',
      paid: language === 'en' ? 'Paid' : 'مدفوع',
      failed: language === 'en' ? 'Failed' : 'فشل',
      refunded: language === 'en' ? 'Refunded' : 'مُسترد'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <Card key={order.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">
                        {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatTime(order.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        <CreditCard className="h-3 w-3 mr-1" />
                        {getPaymentStatusText(order.payment_status)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {expandedOrders.has(order.id) 
                          ? (language === 'en' ? 'Hide' : 'إخفاء')
                          : (language === 'en' ? 'View' : 'عرض')
                        }
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Items' : 'العناصر'}
                      </p>
                      <p className="text-lg font-semibold">
                        {order.order_items.reduce((total, item) => total + item.quantity, 0)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Total Amount' : 'المبلغ الإجمالي'}
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {order.total_amount.toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language === 'en' ? 'Last Updated' : 'آخر تحديث'}
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(order.updated_at)}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <Collapsible open={expandedOrders.has(order.id)}>
                    <CollapsibleContent className="space-y-4">
                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {language === 'en' ? 'Order Items:' : 'عناصر الطلب:'}
                        </h4>
                        <div className="space-y-3">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div>
                                <p className="font-medium">
                                  {language === 'en' ? item.product.name : item.product.name_ar}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {language === 'en' ? 'Quantity:' : 'الكمية:'} {item.quantity} {item.product.unit}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {language === 'en' ? 'Unit price:' : 'سعر الوحدة:'} {item.price.toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {(item.price * item.quantity).toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping Details */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {language === 'en' ? 'Shipping Information:' : 'معلومات الشحن:'}
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {language === 'en' ? 'Address:' : 'العنوان:'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.shipping_address}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <div>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {language === 'en' ? 'Phone:' : 'الهاتف:'}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                                {order.phone}
                              </span>
                            </div>
                          </div>
                          {order.notes && (
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 mt-1 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {language === 'en' ? 'Notes:' : 'الملاحظات:'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.notes}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
