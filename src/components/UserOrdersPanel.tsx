
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Package, RefreshCw, Loader2, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  currency: string;
  product: {
    name: string;
    name_ar: string;
    unit: string;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  shipping_address: string;
  phone: string;
  notes: string;
  admin_notes: string;
  tracking_number: string;
  estimated_delivery_date: string;
  payment_status: string;
  payment_method: string;
  currency: string;
  order_items: OrderItem[];
}

const UserOrdersPanel = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) {
      console.log('لا يوجد مستخدم مسجل دخول');
      setLoading(false);
      return;
    }
    
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
        order_items: order.order_items?.map(item => ({
          ...item,
          product: item.products
        })) || []
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
      toast.error(language === 'en' ? 'Error loading orders' : 'خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: language === 'en' ? 'Pending' : 'في الانتظار',
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      processing: language === 'en' ? 'Processing' : 'قيد التحضير',
      shipped: language === 'en' ? 'Shipped' : 'تم الشحن',
      delivered: language === 'en' ? 'Delivered' : 'تم التسليم',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي',
      refunded: language === 'en' ? 'Refunded' : 'مسترد'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">
          {language === 'en' ? 'Loading orders...' : 'جاري تحميل الطلبات...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          {language === 'en' ? 'My Orders' : 'طلباتي'}
        </h2>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'تحديث'}
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No orders yet' : 'لا توجد طلبات بعد'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'Your orders will appear here once you make a purchase' 
                : 'ستظهر طلباتك هنا بمجرد قيامك بالشراء'
              }
            </p>
            <Button onClick={() => window.location.href = '/marketplace'}>
              {language === 'en' ? 'Browse Products' : 'تصفح المنتجات'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8).toUpperCase()}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'en' ? 'Placed on' : 'تم الطلب في'} {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 px-3 py-1`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </Badge>
                    <p className="text-lg font-bold mt-2">
                      {order.total_amount} {order.currency || 'جنيه'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {/* معلومات الطلب */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Shipping Address' : 'عنوان الشحن'}
                    </h4>
                    <p className="text-sm bg-muted p-3 rounded-lg">{order.shipping_address}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Contact Phone' : 'رقم الهاتف'}
                    </h4>
                    <p className="text-sm bg-muted p-3 rounded-lg">{order.phone}</p>
                  </div>
                </div>

                {/* عناصر الطلب */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-sm text-muted-foreground mb-3">
                      {language === 'en' ? 'Order Items' : 'محتويات الطلب'}
                    </h4>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <span className="font-medium">
                              {item.product ? (
                                language === 'en' ? item.product.name : item.product.name_ar
                              ) : 'منتج غير محدد'}
                            </span>
                            <span className="text-muted-foreground text-sm ml-2">
                              x {item.quantity} {item.product?.unit || 'وحدة'}
                            </span>
                          </div>
                          <span className="font-medium">
                            {item.price} {item.currency || 'جنيه'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* معلومات الشحن والتتبع */}
                {(order.tracking_number || order.estimated_delivery_date) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {order.tracking_number && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          {language === 'en' ? 'Tracking Number' : 'رقم التتبع'}
                        </h4>
                        <p className="text-sm font-mono bg-blue-50 p-2 rounded border">
                          {order.tracking_number}
                        </p>
                      </div>
                    )}
                    {order.estimated_delivery_date && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          {language === 'en' ? 'Expected Delivery' : 'موعد التسليم المتوقع'}
                        </h4>
                        <p className="text-sm bg-green-50 p-2 rounded border flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(order.estimated_delivery_date)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ملاحظات الطلب */}
                {order.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Order Notes' : 'ملاحظات الطلب'}
                    </h4>
                    <p className="text-sm bg-blue-50 p-3 rounded-lg">{order.notes}</p>
                  </div>
                )}

                {/* ملاحظات الإدارة */}
                {order.admin_notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      {language === 'en' ? 'Updates from Support' : 'تحديثات من فريق الدعم'}
                    </h4>
                    <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      {order.admin_notes}
                    </p>
                  </div>
                )}

                {/* معلومات الدفع */}
                <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                  <span>
                    {language === 'en' ? 'Payment Status:' : 'حالة الدفع:'} {order.payment_status || 'معلق'}
                  </span>
                  <span>
                    {language === 'en' ? 'Last Updated:' : 'آخر تحديث:'} {formatDate(order.updated_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPanel;
