
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import NewsletterSubscription from './NewsletterSubscription';

const ProfileSettings = () => {
  const { language } = useLanguage();
  const { user, refreshSession } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    newsletterSubscribed: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, bio, newsletter_subscribed')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        setProfile({
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          bio: data.bio || '',
          newsletterSubscribed: data.newsletter_subscribed || false
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(language === 'en' 
          ? 'Failed to load profile information' 
          : 'فشل في تحميل معلومات الملف الشخصي');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, language]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleNewsletter = (checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      newsletterSubscribed: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Update profile information
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          bio: profile.bio,
          newsletter_subscribed: profile.newsletterSubscribed,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Update newsletter subscription
      if (profile.newsletterSubscribed) {
        const { error: subscribeError } = await supabase
          .from('newsletter_subscribers')
          .upsert({
            email: user.email,
            subscribed: true
          });
        
        if (subscribeError) console.error('Newsletter subscription error:', subscribeError);
      }
      
      // Refresh user session to update metadata
      await refreshSession();
      
      toast.success(language === 'en'
        ? 'Profile updated successfully'
        : 'تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'en'
        ? 'Failed to update profile'
        : 'فشل في تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Profile Settings' : 'إعدادات الملف الشخصي'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Update your personal information and preferences' 
              : 'تحديث معلوماتك الشخصية وتفضيلاتك'}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      {language === 'en' ? 'First Name' : 'الاسم الأول'}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder={language === 'en' ? 'Enter your first name' : 'أدخل اسمك الأول'}
                      value={profile.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      {language === 'en' ? 'Last Name' : 'اسم العائلة'}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder={language === 'en' ? 'Enter your last name' : 'أدخل اسم عائلتك'}
                      value={profile.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' 
                      ? 'Your email cannot be changed' 
                      : 'لا يمكن تغيير بريدك الإلكتروني'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    {language === 'en' ? 'Bio' : 'نبذة'}
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder={language === 'en' 
                      ? 'Tell us a little about yourself...' 
                      : 'أخبرنا قليلاً عن نفسك...'}
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="newsletter"
                    checked={profile.newsletterSubscribed}
                    onCheckedChange={handleToggleNewsletter}
                  />
                  <Label htmlFor="newsletter">
                    {language === 'en' 
                      ? 'Subscribe to newsletter' 
                      : 'الاشتراك في النشرة الإخبارية'}
                  </Label>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={loading || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                </>
              ) : (
                language === 'en' ? 'Save Changes' : 'حفظ التغييرات'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <NewsletterSubscription className="mt-6" />
    </div>
  );
};

export default ProfileSettings;
