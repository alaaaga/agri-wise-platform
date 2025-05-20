
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
import { CalendarCheck, Search, CheckCircle, XCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const mockBookings = [
  { id: 1, client: 'Ahmed Mohamed', consultant: 'Dr. Ibrahim Ali', service: 'Crop Consultation', date: '2025-05-25', time: '10:00 AM', status: 'pending' },
  { id: 2, client: 'Fatima Ali', consultant: 'Dr. Layla Hassan', service: 'Soil Analysis', date: '2025-05-26', time: '02:30 PM', status: 'confirmed' },
  { id: 3, client: 'Mohammed Ibrahim', consultant: 'Dr. Ahmed Zaki', service: 'Livestock Consultation', date: '2025-05-27', time: '11:15 AM', status: 'confirmed' },
  { id: 4, client: 'Sara Ahmed', consultant: 'Dr. Fatima Rashid', service: 'AgriTech Consultation', date: '2025-05-28', time: '09:00 AM', status: 'pending' },
  { id: 5, client: 'Khalid Omar', consultant: 'Dr. Mahmoud Kamal', service: 'Crop Consultation', date: '2025-05-29', time: '03:45 PM', status: 'cancelled' },
];

const AdminBookingsPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState(mockBookings);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter bookings based on search query and status
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
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'en' ? 'Search bookings...' : 'البحث عن الحجوزات...'}
              className="pl-8"
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
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.client}</TableCell>
                  <TableCell>{booking.consultant}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {booking.status}
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
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBookingsPanel;
