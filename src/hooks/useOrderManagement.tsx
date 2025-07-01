
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface OrderStats {
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_users: number;
  total_products: number;
}

export const useOrderManagement = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAdminStats = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      console.log('جاري جلب إحصائيات المسؤول');
      
      const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (error) {
        console.error('خطأ في جلب الإحصائيات:', error);
        throw error;
      }
      
      console.log('تم جلب الإحصائيات بنجاح:', data);
      
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('خطأ في جلب الإحصائيات');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (
    orderId: string, 
    status: string, 
    adminNotes?: string, 
    trackingNumber?: string, 
    estimatedDelivery?: string
  ) => {
    if (!isAdmin) {
      toast.error('غير مسموح: ليس لديك صلاحيات لتحديث الطلبات');
      return false;
    }

    try {
      const { error } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: status,
        admin_notes: adminNotes || null,
        tracking_number: trackingNumber || null,
        estimated_delivery: estimatedDelivery || null
      });

      if (error) {
        console.error('خطأ في تحديث الطلب:', error);
        throw error;
      }

      toast.success('تم تحديث الطلب بنجاح');
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('خطأ في تحديث الطلب');
      return false;
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    }
  }, [isAdmin]);

  return {
    stats,
    loading,
    fetchAdminStats,
    updateOrderStatus
  };
};
