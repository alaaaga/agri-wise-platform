
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  Video,
  Users,
  CalendarCheck,
  BookOpenText,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminArticlesPanel from '@/components/admin/AdminArticlesPanel';
import AdminVideosPanel from '@/components/admin/AdminVideosPanel';
import AdminCaseStudiesPanel from '@/components/admin/AdminCaseStudiesPanel';
import AdminBookingsPanel from '@/components/admin/AdminBookingsPanel';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");

  // Admin access check
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const dashboardItems = [
    { count: 24, label: language === 'en' ? 'Total Articles' : 'إجمالي المقالات', color: 'bg-blue-100 dark:bg-blue-900', icon: FileText },
    { count: 18, label: language === 'en' ? 'Total Videos' : 'إجمالي الفيديوهات', color: 'bg-green-100 dark:bg-green-900', icon: Video },
    { count: 12, label: language === 'en' ? 'Case Studies' : 'دراسات حالة', color: 'bg-yellow-100 dark:bg-yellow-900', icon: BookOpenText },
    { count: 32, label: language === 'en' ? 'Active Users' : 'المستخدمين النشطين', color: 'bg-indigo-100 dark:bg-indigo-900', icon: Users },
    { count: 8, label: language === 'en' ? 'Pending Bookings' : 'الحجوزات المعلقة', color: 'bg-red-100 dark:bg-red-900', icon: CalendarCheck }
  ];

  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">
            {language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
          </h1>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
            <Moon className="h-4 w-4" />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>{language === 'en' ? 'Overview' : 'نظرة عامة'}</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{language === 'en' ? 'Articles' : 'المقالات'}</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>{language === 'en' ? 'Videos' : 'الفيديوهات'}</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <BookOpenText className="h-4 w-4" />
              <span>{language === 'en' ? 'Case Studies' : 'دراسات الحالة'}</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{language === 'en' ? 'Users' : 'المستخدمين'}</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span>{language === 'en' ? 'Bookings' : 'الحجوزات'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className={`p-6 ${item.color} dark:text-white`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-3xl font-bold">{item.count}</p>
                        <p className="text-sm opacity-80">{item.label}</p>
                      </div>
                      <item.icon className="h-8 w-8 opacity-70" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'en' ? 'Recent Activities' : 'الأنشطة الأخيرة'}
                  </h3>
                  <ul className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <li key={i} className="flex justify-between p-2 border-b last:border-0 text-sm">
                        <span>{language === 'en' ? `Activity ${i}` : `نشاط ${i}`}</span>
                        <span className="text-muted-foreground">2h ago</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">
                    {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Create New Article' : 'إنشاء مقال جديد'}
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Video className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Upload New Video' : 'رفع فيديو جديد'}
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <BookOpenText className="mr-2 h-4 w-4" />
                      {language === 'en' ? 'Add Case Study' : 'إضافة دراسة حالة'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <AdminArticlesPanel />
          </TabsContent>

          <TabsContent value="videos">
            <AdminVideosPanel />
          </TabsContent>

          <TabsContent value="cases">
            <AdminCaseStudiesPanel />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsersPanel />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
