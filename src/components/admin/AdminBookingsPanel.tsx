
import React, { useState } from 'react';
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
import { CalendarCheck, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/sonner";

const mockBookings = [
  { 
    id: 1, 
    client: 'أحمد محمد', 
    consultant: 'د. إبراهيم علي', 
    service: 'استشارة المحاصيل', 
    date: '2025-06-15', 
    time: '10:00 ص', 
    status: 'pending' 
  },
  { 
    id: 2, 
    client: 'فاطمة علي', 
    consultant: 'د. ليلى حسن', 
    service: 'تحليل التربة', 
    date: '2025-06-16', 
    time: '02:30 م', 
    status: 'confirmed' 
  },
  { 
    id: 3, 
    client: 'محمد إبراهيم', 
    consultant: 'د. أحمد زكي', 
    service: 'استشارة الثروة الحيوانية', 
    date: '2025-06-17', 
    time: '11:15 ص', 
    status: 'confirmed' 
  },
  { 
    id: 4, 
    client: 'سارة أحمد', 
    consultant: 'د. فاطمة راشد', 
    service: 'استشارة التكنولوجيا الزراعية', 
    date: '2025-06-18', 
    time: '09:00 ص', 
    status: 'pending' 
  },
  { 
    id: 5, 
    client: 'خالد عمر', 
    consultant: 'د. محمود كمال', 
    service: 'استشارة المحاصيل', 
    date: '2025-06-19', 
    time: '03:45 م', 
    status: 'cancelled' 
  },
];

const AdminBookingsPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState(mockBookings);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // تصفية الحجوزات حسب البحث والحالة
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      booking.consultant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: number, newStatus: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    
    const statusText = {
      confirmed: language === 'en' ? 'confirmed' : 'مؤكد',
      cancelled: language === 'en' ? 'cancelled' : 'ملغي'
    };
    
    toast.success(
      language === 'en' 
        ? `Booking ${statusText[newStatus as keyof typeof statusText]}` 
        : `تم ${statusText[newStatus as keyof typeof statusText]} الحجز`
    );
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          {language === 'en' ? 'Manage Bookings' : 'إدارة الحجوزات'}
        </CardTitle>
        <Button>
          <CalendarCheck className="h-4 w-4 mr-2" />
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
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.time}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
  );
};

export default AdminBookingsPanel;
