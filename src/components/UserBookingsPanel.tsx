
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, User, FileText, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Booking {
  id: string;
  service_type: string;
  title: string;
  description: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: string;
  price: number;
  notes: string;
  created_at: string;
  client_id: string;
  consultant_id: string;
  consultant: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

const UserBookingsPanel = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user) {
      console.log('لا يوجد مستخدم مسجل دخول');
      setLoading(false);
      return;
    }
    
    try {
      console.log('جاري جلب الحجوزات للمستخدم:', user.id);
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          service_type,
          title,
          description,
          booking_date,
          booking_time,
          duration,
          status,
          price,
          notes,
          created_at,
          client_id,
          consultant_id,
          profiles!consultant_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب الحجوزات:', error);
        throw error;
      }

      console.log('البيانات المستلمة من قاعدة البيانات:', data);
      
      if (!data || data.length === 0) {
        console.log('لا توجد حجوزات للمستخدم');
        setBookings([]);
        return;
      }

      const formattedBookings = data.map(booking => ({
        ...booking,
        consultant: booking.profiles || null
      }));

      console.log('تم تنسيق الحجوزات:', formattedBookings);
      setBookings(formattedBookings);
    } catch (error) {
      console.error('خطأ في جلب الحجوزات:', error);
      toast.error(language === 'en' ? 'Error loading bookings' : 'خطأ في تحميل الحجوزات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('تحديث الحجوزات - المستخدم:', user?.id);
    fetchBookings();
  }, [user]);

  useEffect(() => {
    setLoading(false);
  }, [bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === 'en' ? 'Pending' : 'في الانتظار',
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      completed: language === 'en' ? 'Completed' : 'مكتمل',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">
          {language === 'en' ? 'Loading bookings...' : 'جاري تحميل الحجوزات...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'My Bookings' : 'حجوزاتي'}
        </h2>
        <Button onClick={fetchBookings} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Refresh' : 'تحديث'}
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No bookings yet' : 'لا توجد حجوزات بعد'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Your consultation bookings will appear here' 
                : 'ستظهر حجوزات الاستشارات الخاصة بك هنا'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{booking.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.service_type}
                    </p>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {language === 'en' ? 'Date:' : 'التاريخ:'} {formatDate(booking.booking_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {language === 'en' ? 'Time:' : 'الوقت:'} {formatTime(booking.booking_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {language === 'en' ? 'Duration:' : 'المدة:'} {booking.duration} {language === 'en' ? 'minutes' : 'دقيقة'}
                    </span>
                  </div>
                  {booking.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {language === 'en' ? 'Price:' : 'السعر:'} {booking.price} {language === 'en' ? 'EGP' : 'جنيه'}
                      </span>
                    </div>
                  )}
                </div>

                {booking.consultant && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {language === 'en' ? 'Consultant:' : 'المستشار:'} {booking.consultant.first_name} {booking.consultant.last_name}
                    </span>
                  </div>
                )}

                {booking.description && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {language === 'en' ? 'Description:' : 'الوصف:'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {booking.description}
                    </p>
                  </div>
                )}

                {booking.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {language === 'en' ? 'Notes:' : 'ملاحظات:'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {booking.notes}
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  {language === 'en' ? 'Booked on:' : 'تم الحجز في:'} {formatDate(booking.created_at)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPanel;
