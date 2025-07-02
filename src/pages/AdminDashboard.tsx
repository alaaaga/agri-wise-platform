import React, { useState, useEffect } from 'react';
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
  Sun,
  Settings,
  BarChart,
  AlertCircle,
  Loader2,
  Database,
  RefreshCw,
  Shield,
  Package,
  ShoppingCart,
  UserCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from '@/hooks/useTheme';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import AdminUsersPanel from '@/components/admin/AdminUsersPanel';
import AdminArticlesPanel from '@/components/admin/AdminArticlesPanel';
import AdminVideosPanel from '@/components/admin/AdminVideosPanel';
import AdminCaseStudiesPanel from '@/components/admin/AdminCaseStudiesPanel';
import AdminBookingsPanel from '@/components/admin/AdminBookingsPanel';
import AdminOrdersPanel from '@/components/admin/AdminOrdersPanel';
import AdminProductsPanel from '@/components/admin/AdminProductsPanel';
import AdminConsultantsPanel from '@/components/admin/AdminConsultantsPanel';
import UserPermissionsPanel from '@/components/admin/UserPermissionsPanel';
import { toast } from "@/components/ui/sonner";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, checkAdminRole } = useAuth();
  const { language, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [adminCheckCompleted, setAdminCheckCompleted] = useState(false);
  
  const {
    stats,
    activities,
    loading: statsLoading,
    error: statsError,
    refreshStats,
    getStatValue,
    getActivityText
  } = useDashboardStats();

  const { stats: orderStats, fetchAdminStats } = useOrderManagement();

  useEffect(() => {
    const verifyAdminRole = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        setAdminCheckCompleted(true);
        return;
      }

      try {
        console.log('التحقق من دور المسؤول في صفحة الإدارة...');
        const isUserAdmin = await checkAdminRole();
        console.log('نتيجة التحقق من دور المسؤول في صفحة الإدارة:', isUserAdmin);
        setAdminCheckCompleted(true);
      } catch (error) {
        console.error('خطأ في التحقق من دور المسؤول:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminRole();
  }, [user, isAuthenticated, checkAdminRole]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const tabNames: Record<string, string> = {
      overview: language === 'en' ? 'Overview' : 'نظرة عامة',
      articles: language === 'en' ? 'Articles' : 'المقالات',
      videos: language === 'en' ? 'Videos' : 'الفيديوهات',
      cases: language === 'en' ? 'Case Studies' : 'دراسات الحالة',
      users: language === 'en' ? 'Users' : 'المستخدمين',
      consultants: language === 'en' ? 'Consultants' : 'المستشارين',
      bookings: language === 'en' ? 'Bookings' : 'الحجوزات',
      orders: language === 'en' ? 'Orders' : 'الطلبات',
      products: language === 'en' ? 'Products' : 'المنتجات',
      permissions: language === 'en' ? 'Permissions' : 'الصلاحيات',
    };
    
    toast.success(language === 'en' 
      ? `Viewing ${tabNames[value]} section` 
      : `عرض قسم ${tabNames[value]}`
    );
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      article: language === 'en' ? 'Switching to articles management...' : 'جاري التبديل إلى إدارة المقالات...',
      video: language === 'en' ? 'Switching to videos management...' : 'جاري التبديل إلى إدارة الفيديوهات...',
      case: language === 'en' ? 'Switching to case studies management...' : 'جاري التبديل إلى إدارة دراسات الحالة...',
      orders: language === 'en' ? 'Switching to orders management...' : 'جاري التبديل إلى إدارة الطلبات...',
      products: language === 'en' ? 'Switching to products management...' : 'جاري التبديل إلى إدارة المنتجات...',
      consultants: language === 'en' ? 'Switching to consultants management...' : 'جاري التبديل إلى إدارة المستشارين...'
    };
    
    toast.success(actionMessages[action]);
    setActiveTab(action === 'article' ? 'articles' : action === 'video' ? 'videos' : action === 'case' ? 'cases' : action);
  };

  const handleRefreshStats = async () => {
    toast.info(language === 'en' ? 'Refreshing statistics...' : 'جاري تحديث الإحصائيات...');
    await refreshStats();
    await fetchAdminStats();
    toast.success(language === 'en' ? 'Statistics updated!' : 'تم تحديث الإحصائيات!');
  };

  // عرض شاشة التحميل
  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'Loading admin dashboard...' : 'جاري تحميل لوحة تحكم المسؤول...'}
          </div>
        </div>
      </Layout>
    );
  }

  // التحقق من المصادقة
  if (!isAuthenticated) {
    toast.error(
      language === 'en'
        ? 'You must be logged in to access the admin dashboard.'
        : 'يجب تسجيل الدخول للوصول إلى لوحة تحكم المسؤول.'
    );
    return <Navigate to="/login" replace />;
  }

  // التحقق من صلاحيات المسؤول
  if (adminCheckCompleted && !isAdmin) {
    toast.error(
      language === 'en'
        ? 'Access denied. Admin privileges required.'
        : 'تم رفض الوصول. مطلوب امتيازات المسؤول.'
    );
    return <Navigate to="/" replace />;
  }

  const dashboardItems = [
    { 
      count: orderStats?.total_orders || getStatValue('total_articles'), 
      label: language === 'en' ? 'Total Orders' : 'إجمالي الطلبات', 
      color: 'bg-blue-100 dark:bg-blue-900', 
      icon: Package 
    },
    { 
      count: orderStats?.pending_orders || getStatValue('total_videos'), 
      label: language === 'en' ? 'Pending Orders' : 'الطلبات المعلقة', 
      color: 'bg-yellow-100 dark:bg-yellow-900', 
      icon: AlertCircle 
    },
    { 
      count: Math.floor(orderStats?.total_revenue || 0), 
      label: language === 'en' ? 'Total Revenue (EGP)' : 'إجمالي الإيرادات (جنيه)', 
      color: 'bg-green-100 dark:bg-green-900', 
      icon: BarChart 
    },
    { 
      count: orderStats?.total_users || getStatValue('active_users'), 
      label: language === 'en' ? 'Total Users' : 'إجمالي المستخدمين', 
      color: 'bg-indigo-100 dark:bg-indigo-900', 
      icon: Users 
    },
    { 
      count: orderStats?.total_products || getStatValue('pending_bookings'), 
      label: language === 'en' ? 'Total Products' : 'إجمالي المنتجات', 
      color: 'bg-purple-100 dark:bg-purple-900', 
      icon: ShoppingCart 
    }
  ];

  return (
    <Layout>
      <div className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold">
              {language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleRefreshStats} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Refresh' : 'تحديث'}
            </Button>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>{language === 'en' ? 'Overview' : 'نظرة عامة'}</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span>{language === 'en' ? 'Products' : 'المنتجات'}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{language === 'en' ? 'Orders' : 'الطلبات'}</span>
            </TabsTrigger>
            <TabsTrigger value="consultants" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>{language === 'en' ? 'Consultants' : 'المستشارين'}</span>
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
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>{language === 'en' ? 'Permissions' : 'الصلاحيات'}</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span>{language === 'en' ? 'Bookings' : 'الحجوزات'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {statsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  {language === 'en' ? 'Loading statistics...' : 'جاري تحميل الإحصائيات...'}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                  {dashboardItems.map((item, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-primary" />
                        {language === 'en' ? 'Recent Activities' : 'الأنشطة الأخيرة'}
                      </h3>
                      <div className="space-y-3">
                        {activities.length > 0 ? (
                          activities.map((activity) => (
                            <div key={activity.id} className="flex justify-between items-start p-3 border-b last:border-0 text-sm rounded hover:bg-muted/50 transition-colors">
                              <span className="flex-1">{getActivityText(activity)}</span>
                              <span className="text-muted-foreground text-xs whitespace-nowrap ml-2">
                                {new Date(activity.created_at).toLocaleDateString('ar-EG')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted-foreground text-sm text-center py-4">
                            {language === 'en' ? 'No recent activities' : 'لا توجد أنشطة حديثة'}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
                      </h3>
                      <div className="flex flex-col gap-3">
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('consultants')}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Consultants' : 'إدارة المستشارين'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('products')}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Products' : 'إدارة المنتجات'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('orders')}>
                          <Package className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Orders' : 'إدارة الطلبات'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('article')}>
                          <FileText className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Articles' : 'إدارة المقالات'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('video')}>
                          <Video className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Videos' : 'إدارة الفيديوهات'}
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleQuickAction('case')}>
                          <BookOpenText className="mr-2 h-4 w-4" />
                          {language === 'en' ? 'Manage Case Studies' : 'إدارة دراسات الحالة'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="products">
            <AdminProductsPanel />
          </TabsContent>

          <TabsContent value="orders">
            <AdminOrdersPanel />
          </TabsContent>

          <TabsContent value="consultants">
            <AdminConsultantsPanel />
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
          
          <TabsContent value="permissions">
            <UserPermissionsPanel />
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
