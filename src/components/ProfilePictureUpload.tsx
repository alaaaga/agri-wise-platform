
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (url: string) => void;
}

const ProfilePictureUpload = ({ currentImageUrl, onImageUpdate }: ProfilePictureUploadProps) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // التحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      toast.error(language === 'en' ? 'Please select an image file' : 'يرجى اختيار ملف صورة');
      return;
    }

    // التحقق من حجم الملف (أقل من 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === 'en' ? 'Image size must be less than 5MB' : 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // حذف الصورة القديمة إن وجدت
      if (currentImageUrl) {
        const oldFileName = currentImageUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage.from('avatars').remove([`${user.id}/${oldFileName}`]);
        }
      }

      // رفع الصورة الجديدة
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // الحصول على رابط الصورة
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // تحديث الملف الشخصي
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          profile_picture_url: data.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onImageUpdate(data.publicUrl);
      toast.success(language === 'en' ? 'Profile picture updated!' : 'تم تحديث صورة الملف الشخصي!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(language === 'en' ? 'Error uploading image' : 'خطأ في رفع الصورة');
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {currentImageUrl ? (
            <AvatarImage src={currentImageUrl} alt="Profile picture" />
          ) : (
            <AvatarFallback className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        <label 
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Camera className="w-4 h-4" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={uploadImage}
          className="hidden"
          disabled={uploading}
        />
      </div>
      
      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => document.getElementById('avatar-upload')?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {language === 'en' ? 'Uploading...' : 'جاري الرفع...'}
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Change Picture' : 'تغيير الصورة'}
          </>
        )}
      </Button>
    </div>
  );
};

export default ProfilePictureUpload;
