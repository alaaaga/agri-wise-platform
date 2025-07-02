
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Video {
  id?: string;
  title: string;
  description: string;
  video_url: string;
  category: string;
  thumbnail_url?: string;
  duration?: number;
}

interface VideoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video?: Video | null;
  onSuccess: () => void;
}

const VideoFormModal = ({ open, onOpenChange, video, onSuccess }: VideoFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Video>({
    title: '',
    description: '',
    video_url: '',
    category: '',
    thumbnail_url: '',
    duration: 0
  });

  useEffect(() => {
    if (video) {
      setFormData(video);
    } else {
      setFormData({
        title: '',
        description: '',
        video_url: '',
        category: '',
        thumbnail_url: '',
        duration: 0
      });
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (video?.id) {
        // تحديث فيديو موجود
        const { error } = await supabase
          .from('videos')
          .update({
            title: formData.title,
            description: formData.description,
            video_url: formData.video_url,
            category: formData.category,
            thumbnail_url: formData.thumbnail_url || null,
            duration: formData.duration || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', video.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Video updated successfully' : 'تم تحديث الفيديو بنجاح');
      } else {
        // إنشاء فيديو جديد
        const { error } = await supabase.rpc('create_video', {
          video_title: formData.title,
          video_description: formData.description,
          video_url: formData.video_url,
          video_category: formData.category,
          video_thumbnail_url: formData.thumbnail_url || null,
          video_duration: formData.duration || null
        });

        if (error) throw error;
        toast.success(language === 'en' ? 'Video created successfully' : 'تم إنشاء الفيديو بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error(language === 'en' ? 'Error saving video' : 'خطأ في حفظ الفيديو');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {video ? 
              (language === 'en' ? 'Edit Video' : 'تعديل الفيديو') : 
              (language === 'en' ? 'Create Video' : 'إنشاء فيديو جديد')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">{language === 'en' ? 'Title' : 'العنوان'}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">{language === 'en' ? 'Category' : 'التصنيف'}</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر التصنيف'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Growing">Growing</SelectItem>
                <SelectItem value="Soil">Soil</SelectItem>
                <SelectItem value="Pest Control">Pest Control</SelectItem>
                <SelectItem value="Structures">Structures</SelectItem>
                <SelectItem value="Water Management">Water Management</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="video_url">{language === 'en' ? 'Video URL' : 'رابط الفيديو'}</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              type="url"
              required
            />
          </div>

          <div>
            <Label htmlFor="thumbnail_url">{language === 'en' ? 'Thumbnail URL' : 'رابط الصورة المصغرة'}</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="duration">{language === 'en' ? 'Duration (minutes)' : 'المدة (بالدقائق)'}</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
            />
          </div>

          <div>
            <Label htmlFor="description">{language === 'en' ? 'Description' : 'الوصف'}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                </>
              ) : (
                video ? 
                  (language === 'en' ? 'Update Video' : 'تحديث الفيديو') : 
                  (language === 'en' ? 'Create Video' : 'إنشاء الفيديو')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoFormModal;
