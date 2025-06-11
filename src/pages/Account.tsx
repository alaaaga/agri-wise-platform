
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/sonner';
import { Loader2, Shield, User, Mail, Calendar, Settings, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserBookingsPanel from '@/components/UserBookingsPanel';

const Account = () => {
  const { isAuthenticated, user, isLoading, isAdmin, checkAdminRole } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkAdminRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast.success(language === 'en' ? 'Profile updated successfully!' : 'تم تحديث الملف الشخصي بنجاح!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'en' ? 'Error updating profile' : 'خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async () => {
    if (!user) return;
    
    try {
      console.log('Making user admin:', user.id);
      
      // استخدام دالة SQL المخصصة
      const { data, error } = await supabase.rpc('set_user_as_admin', {
        user_email: user.email
      });

      if (error) {
        console.error('Error making admin:', error);
        toast.error('خطأ في تحديث الحساب: ' + error.message);
      } else {
        console.log('Admin update result:', data);
        toast.success('تم تحديث الحساب إلى مسؤول بنجاح!');
        // إعادة فحص صلاحيات المسؤول
        setTimeout(() => {
          checkAdminRole();
        }, 1000);
      }
    } catch (error) {
      console.error('Error making admin:', error);
      toast.error('خطأ غير متوقع في تحديث الحساب');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>{language === 'en' ? 'Loading account...' : 'جار تحميل الحساب...'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/account' }} replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            {language === 'en' ? 'My Account' : 'حسابي'}
          </h1>
          <div className="flex gap-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {language === 'en' ? 'Admin Dashboard' : 'لوحة تحكم المسؤول'}
                </Button>
              </Link>
            )}
            {!isAdmin && user?.email === 'agaalaa77@gmail.com' && (
              <Button onClick={makeAdmin} variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                جعل الحساب مسؤول
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* معلومات الحساب */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {language === 'en' ? 'Profile Settings' : 'إعدادات الملف الشخصي'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">
                    {language === 'en' ? 'First Name' : 'الاسم الأول'}
                  </Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder={language === 'en' ? 'Enter your first name' : 'أدخل اسمك الأول'}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">
                    {language === 'en' ? 'Last Name' : 'الاسم الأخير'}
                  </Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder={language === 'en' ? 'Enter your last name' : 'أدخل اسمك الأخير'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">
                  {language === 'en' ? 'Bio' : 'نبذة شخصية'}
                </Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={language === 'en' ? 'Tell us about yourself...' : 'أخبرنا عن نفسك...'}
                  rows={4}
                />
              </div>

              <Button 
                onClick={updateProfile} 
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {language === 'en' ? 'Update Profile' : 'تحديث الملف الشخصي'}
              </Button>
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  {language === 'en' ? 'Account Info' : 'معلومات الحساب'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </Label>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Role' : 'الدور'}
                  </Label>
                  <p className="font-medium flex items-center gap-2">
                    {isAdmin && <Shield className="h-4 w-4 text-primary" />}
                    {isAdmin 
                      ? (language === 'en' ? 'Administrator' : 'مسؤول')
                      : (language === 'en' ? 'User' : 'مستخدم')
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Member Since' : 'عضو منذ'}
                  </Label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* صورة الملف الشخصي */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {language === 'en' ? 'Profile Picture' : 'صورة الملف الشخصي'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.first_name ? profile.first_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Profile picture coming soon!' : 'صورة الملف الشخصي قريباً!'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* قسم الحجوزات للمستخدمين العاديين */}
        {!isAdmin && (
          <div className="mt-8">
            <UserBookingsPanel />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Account;
