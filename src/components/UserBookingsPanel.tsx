
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Clock, User, FileText, Plus, Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Booking {
  id: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

const UserBookingsPanel = () => {
  const { user, isAdmin } = useAuth();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('جاري جلب الحجوزات للمستخدم:', user.id);
      
      // استعلام الحجوزات باستخدام السياسات الجديدة
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error(language === 'en' ? 'Error loading bookings' : 'خطأ في تحميل الحجوزات');
        return;
      }

      console.log('تم جلب الحجوزات بنجاح:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(language === 'en' ? 'Error loading bookings' : 'خطأ في تحميل الحجوزات');
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
    toast.success(language === 'en' ? 'Bookings refreshed' : 'تم تحديث الحجوزات');
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) {
        console.error('Error cancelling booking:', error);
        toast.error(language === 'en' ? 'Error cancelling booking' : 'خطأ في إلغاء الحجز');
        return;
      }

      await fetchBookings();
      toast.success(language === 'en' ? 'Booking cancelled successfully' : 'تم إلغاء الحجز بنجاح');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(language === 'en' ? 'Error cancelling booking' : 'خطأ في إلغاء الحجز');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        text: language === 'en' ? 'Pending' : 'معلق'
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        text: language === 'en' ? 'Confirmed' : 'مؤكد'
      },
      completed: { 
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        text: language === 'en' ? 'Completed' : 'مكتمل'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        text: language === 'en' ? 'Cancelled' : 'ملغي'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG');
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            {language === 'en' ? 'My Bookings' : 'حجوزاتي'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {language === 'en' ? 'Loading bookings...' : 'جاري تحميل الحجوزات...'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            {isAdmin 
              ? (language === 'en' ? 'All Bookings' : 'جميع الحجوزات')
              : (language === 'en' ? 'My Bookings' : 'حجوزاتي')
            }
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshBookings}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {language === 'en' ? 'Refresh' : 'تحديث'}
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'en' ? 'New Booking' : 'حجز جديد'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === 'en' ? 'No bookings found' : 'لا توجد حجوزات'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{booking.service_type}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarCheck className="h-4 w-4" />
                        {formatDate(booking.booking_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(booking.booking_time)}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
                
                {booking.notes && (
                  <div className="flex items-start gap-2 text-sm mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-muted-foreground">{booking.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Booked on' : 'تم الحجز في'}: {formatDate(booking.created_at)}
                  </span>
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        {language === 'en' ? 'Cancel' : 'إلغاء'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserBookingsPanel;
