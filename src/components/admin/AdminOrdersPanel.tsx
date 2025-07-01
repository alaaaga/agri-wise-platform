
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Edit, Eye, Calendar, Phone, MapPin, CreditCard, Truck, FileText, Clock } from 'lucide-react';
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
  };
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  phone: string;
  notes: string;
  admin_notes: string;
  tracking_number: string;
  estimated_delivery_date: string;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items: OrderItem[];
}

const AdminOrdersPanel = () => {
  const { isAdmin } = useAuth();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    admin_notes: '',
    tracking_number: '',
    estimated_delivery_date: ''
  });

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('جاري جلب جميع الطلبات للمسؤول');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          ),
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب الطلبات:', error);
        throw error;
      }

      console.log('تم جلب الطلبات بنجاح:', data);
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(language === 'en' ? 'Error loading orders' : 'خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string) => {
    try {
      const { error } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: updateData.status,
        admin_notes: updateData.admin_notes || null,
        tracking_number: updateData.tracking_number || null,
        estimated_delivery: updateData.estimated_delivery_date || null
      });

      if (error) {
        console.error('خطأ في تحديث الطلب:', error);
        throw error;
      }

      toast.success(language === 'en' ? 'Order updated successfully' : 'تم تحديث الطلب بنجاح');
      await fetchOrders();
      setSelectedOrder(null);
      setUpdateData({ status: '', admin_notes: '', tracking_number: '', estimated_delivery_date: '' });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error(language === 'en' ? 'Error updating order' : 'خطأ في تحديث الطلب');
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      refunded: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'en' ? 'Pending' : 'في الانتظار',
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      processing: language === 'en' ? 'Processing' : 'قيد المعالجة',
      shipped: language === 'en' ? 'Shipped' : 'تم الشحن',
      delivered: language === 'en' ? 'Delivered' : 'تم التسليم',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي',
      refunded: language === 'en' ? 'Refunded' : 'مُسترد'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {language === 'en' ? 'Access denied. Admin privileges required.' : 'تم رفض الوصول. مطلوب امتيازات المسؤول.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {language === 'en' ? 'Orders Management' : 'إدارة الطلبات'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {language === 'en' ? 'Loading orders...' : 'جاري تحميل الطلبات...'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {language === 'en' ? 'Orders Management' : 'إدارة الطلبات'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'No orders found' : 'لا توجد طلبات'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' ? 'Customer:' : 'العميل:'} {order.profiles?.first_name} {order.profiles?.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <Badge className={getStatusColor(order.payment_status)}>
                      <CreditCard className="h-3 w-3 mr-1" />
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{order.total_amount.toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{order.phone}</span>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{language === 'en' ? 'Tracking:' : 'رقم التتبع:'} {order.tracking_number}</span>
                  </div>
                )}

                {order.estimated_delivery_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{language === 'en' ? 'Estimated delivery:' : 'تاريخ التسليم المتوقع:'} {formatDate(order.estimated_delivery_date)}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {language === 'en' ? 'Order Details' : 'تفاصيل الطلب'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">{language === 'en' ? 'Order Items:' : 'عناصر الطلب:'}</h4>
                          <div className="space-y-2">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                <div>
                                  <p className="font-medium">
                                    {language === 'en' ? item.product.name : item.product.name_ar}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.quantity} {item.product.unit}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  {(item.price * item.quantity).toFixed(2)} {language === 'en' ? 'EGP' : 'جنيه'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">{language === 'en' ? 'Shipping Address:' : 'عنوان الشحن:'}</h4>
                          <p className="text-sm">{order.shipping_address}</p>
                        </div>
                        
                        {order.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">{language === 'en' ? 'Customer Notes:' : 'ملاحظات العميل:'}</h4>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}
                        
                        {order.admin_notes && (
                          <div>
                            <h4 className="font-semibold mb-2">{language === 'en' ? 'Admin Notes:' : 'ملاحظات المسؤول:'}</h4>
                            <p className="text-sm">{order.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setUpdateData({
                            status: order.status,
                            admin_notes: order.admin_notes || '',
                            tracking_number: order.tracking_number || '',
                            estimated_delivery_date: order.estimated_delivery_date || ''
                          });
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {language === 'en' ? 'Update' : 'تحديث'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {language === 'en' ? 'Update Order' : 'تحديث الطلب'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">
                            {language === 'en' ? 'Status' : 'الحالة'}
                          </Label>
                          <Select value={updateData.status} onValueChange={(value) => setUpdateData({...updateData, status: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'en' ? 'Select status' : 'اختر الحالة'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{language === 'en' ? 'Pending' : 'في الانتظار'}</SelectItem>
                              <SelectItem value="confirmed">{language === 'en' ? 'Confirmed' : 'مؤكد'}</SelectItem>
                              <SelectItem value="processing">{language === 'en' ? 'Processing' : 'قيد المعالجة'}</SelectItem>
                              <SelectItem value="shipped">{language === 'en' ? 'Shipped' : 'تم الشحن'}</SelectItem>
                              <SelectItem value="delivered">{language === 'en' ? 'Delivered' : 'تم التسليم'}</SelectItem>
                              <SelectItem value="cancelled">{language === 'en' ? 'Cancelled' : 'ملغي'}</SelectItem>
                              <SelectItem value="refunded">{language === 'en' ? 'Refunded' : 'مُسترد'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="tracking_number">
                            {language === 'en' ? 'Tracking Number' : 'رقم التتبع'}
                          </Label>
                          <Input
                            id="tracking_number"
                            value={updateData.tracking_number}
                            onChange={(e) => setUpdateData({...updateData, tracking_number: e.target.value})}
                            placeholder={language === 'en' ? 'Enter tracking number' : 'أدخل رقم التتبع'}
                          />
                        </div>

                        <div>
                          <Label htmlFor="estimated_delivery_date">
                            {language === 'en' ? 'Estimated Delivery Date' : 'تاريخ التسليم المتوقع'}
                          </Label>
                          <Input
                            id="estimated_delivery_date"
                            type="date"
                            value={updateData.estimated_delivery_date}
                            onChange={(e) => setUpdateData({...updateData, estimated_delivery_date: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label htmlFor="admin_notes">
                            {language === 'en' ? 'Admin Notes' : 'ملاحظات المسؤول'}
                          </Label>
                          <Textarea
                            id="admin_notes"
                            value={updateData.admin_notes}
                            onChange={(e) => setUpdateData({...updateData, admin_notes: e.target.value})}
                            placeholder={language === 'en' ? 'Enter admin notes' : 'أدخل ملاحظات المسؤول'}
                            rows={3}
                          />
                        </div>

                        <Button 
                          onClick={() => updateOrderStatus(order.id)}
                          className="w-full"
                        >
                          {language === 'en' ? 'Update Order' : 'تحديث الطلب'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOrdersPanel;
