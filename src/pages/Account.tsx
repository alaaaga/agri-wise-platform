
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { toast } from '@/components/ui/sonner';
import { Loader2, Shield, User, Mail, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import UserBookingsPanel from '@/components/UserBookingsPanel';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

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
      console.log('جاري جلب الملف الشخصي للمستخدم:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('خطأ في جلب الملف الشخصي:', error);
        // إنشاء ملف شخصي جديد إذا لم يوجد
        await createProfile();
        return;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
        console.log('تم جلب الملف الشخصي بنجاح:', data);
      }
    } catch (error) {
      console.error('خطأ غير متوقع في جلب الملف الشخصي:', error);
    }
  };

  const createProfile = async () => {
    if (!user) return;
    
    try {
      console.log('جاري إنشاء ملف شخصي جديد للمستخدم:', user.id);
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          bio: '',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('خطأ في إنشاء الملف الشخصي:', error);
        return;
      }

      console.log('تم إنشاء الملف الشخصي بنجاح');
      await fetchProfile();
    } catch (error) {
      console.error('خطأ غير متوقع في إنشاء الملف الشخصي:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('جاري تحديث الملف الشخصي:', profile);
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
        console.error('خطأ في تحديث الملف الشخصي:', error);
        throw error;
      }

      console.log('تم تحديث الملف الشخصي بنجاح');
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
      console.log('جاري جعل المستخدم مسؤول:', user.id);
      
      const { data, error } = await supabase.rpc('make_user_admin', {
        target_user_id: user.id
      });

      if (error) {
        console.error('خطأ في تحديث الحساب:', error);
        toast.error('خطأ في تحديث الحساب: ' + error.message);
      } else {
        console.log('نتيجة تحديث المسؤول:', data);
        toast.success(data || 'تم تحديث الحساب إلى مسؤول بنجاح!');
        setTimeout(() => {
          checkAdminRole();
        }, 1000);
      }
    } catch (error) {
      console.error('خطأ غير متوقع في تحديث الحساب:', error);
      toast.error('خطأ غير متوقع في تحديث الحساب');
    }
  };

  const handleImageUpdate = (url: string) => {
    setProfile(prev => ({ ...prev, avatar_url: url }));
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
                  <User className="h-5 w-5" />
                  {language === 'en' ? 'Profile Picture' : 'صورة الملف الشخصي'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProfilePictureUpload 
                  currentImageUrl={profile.avatar_url}
                  onImageUpdate={handleImageUpdate}
                />
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
