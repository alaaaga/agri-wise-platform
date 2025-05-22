import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Book, MessageCircle, Calendar, Video, Phone } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  consultantId: string;
  consultantName: string;
  consultantImage: string;
  consultantSpecialty: string;
  userId: string;
  date: string;
  time: string;
  consultationType: string;
  message: string;
  price: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const Account = () => {
  const { user, isAuthenticated, logout, getUserDisplayName } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Load user's bookings from localStorage
      const loadBookings = () => {
        const bookingsJSON = localStorage.getItem('agriadvisor_bookings');
        if (bookingsJSON) {
          const allBookings = JSON.parse(bookingsJSON);
          // Filter bookings for current user
          const userBookings = allBookings.filter(
            (booking: Booking) => booking.userId === user?.id
          );
          setBookings(userBookings);
        }
      };
      
      loadBookings();
    }
  }, [isAuthenticated, navigate, user]);
  
  if (!isAuthenticated || !user) {
    return null;
  }

  const userDisplayName = getUserDisplayName();
  const userInitial = userDisplayName ? userDisplayName.charAt(0) : '?';
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white text-2xl">
                  {userInitial}
                </div>
                <div className="ml-4 rtl:mr-4 rtl:ml-0">
                  <h1 className="text-2xl font-bold">{userDisplayName}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={logout}
              >
                {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
              </Button>
            </div>
            
            <Tabs defaultValue="consultations" className="w-full">
              <TabsList className="w-full grid grid-cols-1 sm:grid-cols-4 mb-6">
                <TabsTrigger value="consultations" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language === 'en' ? 'My Consultations' : 'استشاراتي'}
                </TabsTrigger>
                <TabsTrigger value="questions" className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language === 'en' ? 'My Questions' : 'أسئلتي'}
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center">
                  <Book className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language === 'en' ? 'Booking History' : 'تاريخ الحجز'}
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language === 'en' ? 'Profile Settings' : 'إعدادات الملف الشخصي'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="consultations">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'en' ? 'Upcoming Consultations' : 'الاستشارات القادمة'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="border rounded-lg p-4 flex flex-col md:flex-row gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <img 
                                src={booking.consultantImage} 
                                alt={booking.consultantName}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-medium">{booking.consultantName}</h3>
                                {booking.consultantSpecialty && (
                                  <Badge variant="outline" className="bg-teal-50 text-teal-800 border-teal-200 text-xs">
                                    {booking.consultantSpecialty}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-agri" />
                                <span>
                                  {format(parseISO(booking.date), "PPP")} · {booking.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {booking.consultationType === 'video' ? (
                                  <Video className="h-4 w-4 text-agri" />
                                ) : (
                                  <Phone className="h-4 w-4 text-agri" />
                                )}
                                <span>
                                  {booking.consultationType === 'video' 
                                    ? (language === 'en' ? 'Video Call' : 'مكالمة فيديو')
                                    : (language === 'en' ? 'Voice Call' : 'مكالمة صوتية')}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                              <Badge className="bg-green-500">
                                {language === 'en' ? 'Confirmed' : 'تم التأكيد'}
                              </Badge>
                              <span className="text-sm text-gray-600 mt-2">
                                {language === 'ar' ? `${booking.price} ج` : `EGP ${booking.price}`}
                              </span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="mt-2 text-sm"
                              >
                                {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {language === 'en' 
                          ? 'You have no upcoming consultations.' 
                          : 'ليس لديك استشارات قادمة.'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="questions">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'en' ? 'My Questions' : 'أسئلتي'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      {language === 'en' 
                        ? 'You have not asked any questions yet.' 
                        : 'لم تطرح أي أسئلة حتى الآن.'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'en' ? 'Booking History' : 'تاريخ الحجز'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bookings.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">
                                {language === 'en' ? 'Consultant' : 'المستشار'}
                              </th>
                              <th className="text-left py-3 px-2">
                                {language === 'en' ? 'Date & Time' : 'التاريخ والوقت'}
                              </th>
                              <th className="text-left py-3 px-2">
                                {language === 'en' ? 'Type' : 'النوع'}
                              </th>
                              <th className="text-right py-3 px-2">
                                {language === 'en' ? 'Price' : 'السعر'}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookings.map((booking) => (
                              <tr key={booking.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-2">
                                  <div className="flex items-center">
                                    <img 
                                      src={booking.consultantImage} 
                                      alt={booking.consultantName} 
                                      className="w-8 h-8 rounded-full mr-2 rtl:ml-2 rtl:mr-0"
                                    />
                                    <span>{booking.consultantName}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  {format(parseISO(booking.date), "d MMM yyyy")} · {booking.time}
                                </td>
                                <td className="py-3 px-2">
                                  {booking.consultationType === 'video' 
                                    ? (language === 'en' ? 'Video Call' : 'مكالمة فيديو')
                                    : (language === 'en' ? 'Voice Call' : 'مكالمة صوتية')}
                                </td>
                                <td className="py-3 px-2 text-right font-medium">
                                  {language === 'ar' ? `${booking.price} ج` : `EGP ${booking.price}`}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {language === 'en' 
                          ? 'You have no previous bookings.' 
                          : 'ليس لديك حجوزات سابقة.'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'en' ? 'Profile Settings' : 'إعدادات الملف الشخصي'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-6">
                      {language === 'en' 
                        ? 'Update your account information and preferences.' 
                        : 'تحديث معلومات حسابك وتفضيلاتك.'}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Name' : 'الاسم'}
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          defaultValue={getUserDisplayName()}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          defaultValue={user.email}
                          disabled
                        />
                      </div>
                      
                      <Button className="bg-agri hover:bg-agri-dark">
                        {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
