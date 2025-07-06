
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
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Edit, Loader2, Calendar, Phone, Video, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import BookingDetailsModal from '@/components/BookingDetailsModal';
import BookingFormModal from './BookingFormModal';
import { BookingDetails } from '@/types/booking';

const AdminBookingsPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          client_profile:profiles!bookings_client_id_fkey(first_name, last_name, email),
          consultant_profile:profiles!bookings_consultant_id_fkey(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setBookings(bookingsData || []);
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
  
  const filteredBookings = bookings.filter(booking => 
    booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.service_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return language === 'en' ? 'Confirmed' : 'مؤكد';
      case 'pending':
        return language === 'en' ? 'Pending' : 'معلق';
      case 'cancelled':
        return language === 'en' ? 'Cancelled' : 'ملغي';
      case 'completed':
        return language === 'en' ? 'Completed' : 'مكتمل';
      default:
        return status;
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'field_visit':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getServiceText = (serviceType: string) => {
    switch (serviceType) {
      case 'phone':
        return language === 'en' ? 'Phone' : 'هاتف';
      case 'video':
        return language === 'en' ? 'Video' : 'فيديو';
      case 'field_visit':
        return language === 'en' ? 'Field Visit' : 'زيارة ميدانية';
      default:
        return serviceType;
    }
  };

  const handleViewDetails = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const handleEditBooking = (booking: BookingDetails) => {
    setSelectedBooking(booking);
    setEditModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Manage Bookings' : 'إدارة الحجوزات'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search bookings...' : 'البحث عن حجوزات...'}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {language === 'en' ? 'Loading bookings...' : 'جاري تحميل الحجوزات...'}
              </span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                    <TableHead>{language === 'en' ? 'Service' : 'الخدمة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead>{language === 'en' ? 'Time' : 'الوقت'}</TableHead>
                    <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Client' : 'العميل'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No bookings found' : 'لم يتم العثور على حجوزات'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.title}</div>
                            {booking.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {booking.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getServiceIcon(booking.service_type)}
                            <span className="text-sm">{getServiceText(booking.service_type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(booking.booking_date).toLocaleDateString('ar-EG')}</TableCell>
                        <TableCell>{booking.booking_time}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.client_profile ? (
                            <div className="text-sm">
                              <div>{booking.client_profile.first_name} {booking.client_profile.last_name}</div>
                              <div className="text-muted-foreground">{booking.client_profile.email}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {language === 'en' ? 'No client info' : 'لا توجد معلومات'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
      />

      <BookingFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        booking={selectedBooking}
        onSuccess={() => {
          fetchBookings();
          setEditModalOpen(false);
          setSelectedBooking(null);
        }}
      />
    </>
  );
};

export default AdminBookingsPanel;
