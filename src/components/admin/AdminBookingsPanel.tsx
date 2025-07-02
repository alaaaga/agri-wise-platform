
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Search, CheckCircle, XCircle, Clock, Edit, Plus, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import BookingFormModal from './BookingFormModal';

interface AdminBooking {
  id: string;
  client: string;
  consultant: string;
  service_type: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  title: string;
  description?: string;
  price?: number;
  duration: number;
}

const AdminBookingsPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!client_id (first_name, last_name),
          consultant:profiles!consultant_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedBookings = bookingsData?.map(booking => ({
        id: booking.id,
        client: booking.client ? `${booking.client.first_name} ${booking.client.last_name}` : 'غير محدد',
        consultant: booking.consultant ? `${booking.consultant.first_name} ${booking.consultant.last_name}` : 'غير محدد',
        service_type: booking.service_type,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        status: booking.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        title: booking.title,
        description: booking.description,
        price: booking.price,
        duration: booking.duration
      })) || [];
      
      setBookings(formattedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error(language === 'en' ? 'Failed to fetch bookings' : 'فشل في جلب الحجوزات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service_type.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase.rpc('update_booking_status', {
        booking_id: id,
        new_status: newStatus
      });

      if (error) throw error;

      const statusText = {
        confirmed: language === 'en' ? 'confirmed' : 'مؤكد',
        cancelled: language === 'en' ? 'cancelled' : 'ملغي'
      };
      
      toast.success(
        language === 'en' 
          ? `Booking ${statusText[newStatus as keyof typeof statusText]}` 
          : `تم ${statusText[newStatus as keyof typeof statusText]} الحجز`
      );

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error(language === 'en' ? 'Error updating booking' : 'خطأ في تحديث الحجز');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      confirmed: language === 'en' ? 'Confirmed' : 'مؤكد',
      pending: language === 'en' ? 'Pending' : 'معلق',
      cancelled: language === 'en' ? 'Cancelled' : 'ملغي'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleNewBooking = () => {
    setSelectedBooking(null);
    setFormModalOpen(true);
  };

  const handleEditBooking = (booking: AdminBooking) => {
    setSelectedBooking(booking);
    setFormModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Manage Bookings' : 'إدارة الحجوزات'}
          </CardTitle>
          <Button onClick={handleNewBooking}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Create Booking' : 'إنشاء حجز'}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
              <Input
                placeholder={language === 'en' ? 'Search bookings...' : 'البحث عن الحجوزات...'}
                className="pl-8 rtl:pr-8 rtl:pl-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <ToggleGroup type="single" value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'all')}>
              <ToggleGroupItem value="all">
                {language === 'en' ? 'All' : 'الكل'}
              </ToggleGroupItem>
              <ToggleGroupItem value="pending">
                {language === 'en' ? 'Pending' : 'معلق'}
              </ToggleGroupItem>
              <ToggleGroupItem value="confirmed">
                {language === 'en' ? 'Confirmed' : 'مؤكد'}
              </ToggleGroupItem>
              <ToggleGroupItem value="cancelled">
                {language === 'en' ? 'Cancelled' : 'ملغي'}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{language === 'en' ? 'Loading bookings...' : 'جاري تحميل الحجوزات...'}</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Client' : 'العميل'}</TableHead>
                    <TableHead>{language === 'en' ? 'Consultant' : 'المستشار'}</TableHead>
                    <TableHead>{language === 'en' ? 'Service' : 'الخدمة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead>{language === 'en' ? 'Time' : 'الوقت'}</TableHead>
                    <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.client}</TableCell>
                        <TableCell>{booking.consultant}</TableCell>
                        <TableCell>{booking.service_type}</TableCell>
                        <TableCell>{booking.booking_date}</TableCell>
                        <TableCell>{booking.booking_time}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {booking.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-800 hover:bg-green-100"
                                  title={language === 'en' ? 'Confirm' : 'تأكيد'}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                  title={language === 'en' ? 'Cancel' : 'إلغاء'}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {booking.status !== 'pending' && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">
                                  {booking.status === 'confirmed' 
                                    ? (language === 'en' ? 'Completed' : 'مكتمل')
                                    : (language === 'en' ? 'Cancelled' : 'ملغي')
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No bookings found' : 'لا توجد حجوزات'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredBookings.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              {language === 'en' 
                ? `Showing ${filteredBookings.length} of ${bookings.length} bookings`
                : `عرض ${filteredBookings.length} من أصل ${bookings.length} حجز`
              }
            </div>
          )}
        </CardContent>
      </Card>

      <BookingFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        booking={selectedBooking}
        onSuccess={fetchBookings}
      />
    </>
  );
};

export default AdminBookingsPanel;
