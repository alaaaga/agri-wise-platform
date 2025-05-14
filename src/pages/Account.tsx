
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Book, MessageCircle, Calendar } from 'lucide-react';

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-agri rounded-full flex items-center justify-center text-white text-2xl">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-4 rtl:mr-4 rtl:ml-0">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
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
                    <div className="text-center py-8 text-gray-500">
                      {language === 'en' 
                        ? 'You have no upcoming consultations.' 
                        : 'ليس لديك استشارات قادمة.'}
                    </div>
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
                    <div className="text-center py-8 text-gray-500">
                      {language === 'en' 
                        ? 'You have no previous bookings.' 
                        : 'ليس لديك حجوزات سابقة.'}
                    </div>
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
                          defaultValue={user.name}
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
