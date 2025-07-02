
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Package, Eye, Edit, RefreshCw, Loader2 } from 'lucide-react';

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
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const AdminOrdersPanel = () => {
  const { language } = useLanguage();
  const { updateOrderStatus } = useOrderManagement();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // نموذج تحديث الطلب
  const [updateForm, setUpdateForm] = useState({
    status: '',
    admin_notes: '',
    tracking_number: '',
    estimated_delivery: ''
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('جاري جلب الطلبات...');
      
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
      
      // تحويل البيانات للشكل المطلوب
      const formattedOrders = data?.map(order => ({
        ...order,
        order_items: order.order_items?.map(item => ({
          ...item,
          product: item.products
        })) || []
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(language === 'en' ? 'Error loading orders' : 'خطأ في تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: language === 'en' ? 'Pending' : 'معلق',
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      processing: language === 'en' ? 'Processing' : 'قيد المعالجة',
      shipped: language === 'en' ? 'Shipped' : 'تم الشحن',
      delivered: language === 'en' ? 'Delivered' : 'تم التسليم',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي',
      refunded: language === 'en' ? 'Refunded' : 'مسترد'
    };
    return statusMap[status] || status;
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      const success = await updateOrderStatus(
        selectedOrder.id,
        updateForm.status,
        updateForm.admin_notes,
        updateForm.tracking_number,
        updateForm.estimated_delivery
      );

      if (success) {
        await fetchOrders();
        setSelectedOrder(null);
        setUpdateForm({
          status: '',
          admin_notes: '',
          tracking_number: '',
          estimated_delivery: ''
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG');
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
          {language === 'en' ? 'Orders Management' : 'إدارة الطلبات'}
        </h2>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'تحديث'}
        </Button>
      </div>

      <div className="grid gap-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'en' ? 'No orders found' : 'لا توجد طلبات'}
              </p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {language === 'en' ? 'Order' : 'طلب'} #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.first_name} {order.profiles?.last_name} - {order.profiles?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                    <span className="text-lg font-bold">
                      {order.total_amount} {order.currency || 'EGP'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'Order Date' : 'تاريخ الطلب'}
                    </Label>
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'Phone' : 'الهاتف'}
                    </Label>
                    <p className="text-sm">{order.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {language === 'en' ? 'Payment Status' : 'حالة الدفع'}
                    </Label>
                    <p className="text-sm">{order.payment_status || 'pending'}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">
                    {language === 'en' ? 'Shipping Address' : 'عنوان الشحن'}
                  </Label>
                  <p className="text-sm bg-muted p-2 rounded">{order.shipping_address}</p>
                </div>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-medium mb-2 block">
                      {language === 'en' ? 'Order Items' : 'عناصر الطلب'}
                    </Label>
                    <div className="space-y-2">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-muted p-2 rounded text-sm">
                          <span>
                            {language === 'en' ? item.product?.name : item.product?.name_ar} 
                            x {item.quantity} {item.product?.unit}
                          </span>
                          <span className="font-medium">
                            {item.price} {item.currency || 'EGP'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setUpdateForm({
                            status: order.status,
                            admin_notes: order.admin_notes || '',
                            tracking_number: order.tracking_number || '',
                            estimated_delivery: order.estimated_delivery_date || ''
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
                          <Label>{language === 'en' ? 'Status' : 'الحالة'}</Label>
                          <Select 
                            value={updateForm.status} 
                            onValueChange={(value) => setUpdateForm({...updateForm, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">
                                {language === 'en' ? 'Pending' : 'معلق'}
                              </SelectItem>
                              <SelectItem value="confirmed">
                                {language === 'en' ? 'Confirmed' : 'مؤكد'}
                              </SelectItem>
                              <SelectItem value="processing">
                                {language === 'en' ? 'Processing' : 'قيد المعالجة'}
                              </SelectItem>
                              <SelectItem value="shipped">
                                {language === 'en' ? 'Shipped' : 'تم الشحن'}
                              </SelectItem>
                              <SelectItem value="delivered">
                                {language === 'en' ? 'Delivered' : 'تم التسليم'}
                              </SelectItem>
                              <SelectItem value="cancelled">
                                {language === 'en' ? 'Cancelled' : 'ملغي'}
                              </SelectItem>
                              <SelectItem value="refunded">
                                {language === 'en' ? 'Refunded' : 'مسترد'}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>{language === 'en' ? 'Tracking Number' : 'رقم التتبع'}</Label>
                          <Input 
                            value={updateForm.tracking_number}
                            onChange={(e) => setUpdateForm({...updateForm, tracking_number: e.target.value})}
                            placeholder={language === 'en' ? 'Enter tracking number' : 'أدخل رقم التتبع'}
                          />
                        </div>

                        <div>
                          <Label>{language === 'en' ? 'Estimated Delivery' : 'تاريخ التسليم المتوقع'}</Label>
                          <Input 
                            type="date"
                            value={updateForm.estimated_delivery}
                            onChange={(e) => setUpdateForm({...updateForm, estimated_delivery: e.target.value})}
                          />
                        </div>

                        <div>
                          <Label>{language === 'en' ? 'Admin Notes' : 'ملاحظات المسؤول'}</Label>
                          <Textarea 
                            value={updateForm.admin_notes}
                            onChange={(e) => setUpdateForm({...updateForm, admin_notes: e.target.value})}
                            placeholder={language === 'en' ? 'Add admin notes...' : 'أضف ملاحظات المسؤول...'}
                            rows={3}
                          />
                        </div>

                        <Button 
                          onClick={handleUpdateOrder} 
                          disabled={isUpdating}
                          className="w-full"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {language === 'en' ? 'Updating...' : 'جاري التحديث...'}
                            </>
                          ) : (
                            language === 'en' ? 'Update Order' : 'تحديث الطلب'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPanel;
