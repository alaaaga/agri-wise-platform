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
import type { Database } from "@/integrations/supabase/types";

type ContentStatus = Database['public']['Enums']['content_status'];

interface Article {
  id?: string;
  title: string;
  content: string;
  category: string;
  excerpt?: string;
  image_url?: string;
  status?: ContentStatus;
}

interface ArticleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  onSuccess: () => void;
}

const ArticleFormModal = ({ open, onOpenChange, article, onSuccess }: ArticleFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Article>({
    title: '',
    content: '',
    category: '',
    excerpt: '',
    image_url: '',
    status: 'published' as ContentStatus
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        excerpt: '',
        image_url: '',
        status: 'published' as ContentStatus
      });
    }
  }, [article, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // التحقق من المدخلات المطلوبة
    if (!formData.title || !formData.content || !formData.category) {
      toast.error(language === 'en' ? 'Please fill in all required fields' : 'الرجاء ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(language === 'en' ? 'You must be logged in' : 'يجب تسجيل الدخول أولاً');
        setLoading(false);
        return;
      }

      if (article?.id) {
        // تحديث مقال موجود
        const { error } = await supabase
          .from('articles')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            excerpt: formData.excerpt || null,
            image_url: formData.image_url || null,
            status: formData.status as ContentStatus || 'published' as ContentStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Article updated successfully' : 'تم تحديث المقال بنجاح');
      } else {
        // إنشاء مقال جديد
        const { error } = await supabase
          .from('articles')
          .insert({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            excerpt: formData.excerpt || null,
            image_url: formData.image_url || null,
            status: 'published' as ContentStatus,
            author_id: user.id,
            published_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success(language === 'en' ? 'Article created successfully' : 'تم إنشاء المقال بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(language === 'en' ? 'Error saving article' : 'خطأ في حفظ المقال');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'irrigation', label: { en: 'Irrigation', ar: 'الري' } },
    { value: 'organic', label: { en: 'Organic Farming', ar: 'الزراعة العضوية' } },
    { value: 'pest-control', label: { en: 'Pest Control', ar: 'مكافحة الآفات' } },
    { value: 'sustainability', label: { en: 'Sustainability', ar: 'الاستدامة' } },
    { value: 'water-management', label: { en: 'Water Management', ar: 'إدارة المياه' } },
    { value: 'crops', label: { en: 'Crops', ar: 'المحاصيل' } },
    { value: 'livestock', label: { en: 'Livestock', ar: 'الثروة الحيوانية' } },
    { value: 'soil', label: { en: 'Soil Analysis', ar: 'تحليل التربة' } },
    { value: 'technology', label: { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' } }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 
              (language === 'en' ? 'Edit Article' : 'تعديل المقال') : 
              (language === 'en' ? 'Create New Article' : 'إنشاء مقال جديد')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              {language === 'en' ? 'Title' : 'العنوان'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={language === 'en' ? 'Enter article title' : 'أدخل عنوان المقال'}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              {language === 'en' ? 'Category' : 'التصنيف'} <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر التصنيف'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label[language as 'en' | 'ar']}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="excerpt" className="text-sm font-medium">
              {language === 'en' ? 'Excerpt' : 'المقتطف'}
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              placeholder={language === 'en' ? 'Brief description of the article' : 'وصف مختصر للمقال'}
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="image_url" className="text-sm font-medium">
              {language === 'en' ? 'Image URL' : 'رابط الصورة'}
            </Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder={language === 'en' ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
              type="url"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium">
              {language === 'en' ? 'Content' : 'المحتوى'} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder={language === 'en' ? 'Write your article content here...' : 'اكتب محتوى مقالك هنا...'}
              rows={10}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              {language === 'en' ? 'Status' : 'الحالة'}
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as ContentStatus})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">
                  {language === 'en' ? 'Published' : 'منشور'}
                </SelectItem>
                <SelectItem value="draft">
                  {language === 'en' ? 'Draft' : 'مسودة'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
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
                article ? 
                  (language === 'en' ? 'Update Article' : 'تحديث المقال') : 
                  (language === 'en' ? 'Create Article' : 'إنشاء المقال')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormModal;
