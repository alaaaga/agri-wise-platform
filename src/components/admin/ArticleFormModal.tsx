
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

interface Article {
  id?: string;
  title: string;
  content: string;
  category: string;
  excerpt?: string;
  image_url?: string;
  status?: string;
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
    status: 'published'
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
        status: 'published'
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (article?.id) {
        // تحديث مقال موجود
        const { error } = await supabase.rpc('update_article', {
          article_id: article.id,
          article_title: formData.title,
          article_content: formData.content,
          article_category: formData.category,
          article_status: formData.status || 'published',
          article_excerpt: formData.excerpt || null,
          article_image_url: formData.image_url || null
        });

        if (error) throw error;
        toast.success(language === 'en' ? 'Article updated successfully' : 'تم تحديث المقال بنجاح');
      } else {
        // إنشاء مقال جديد
        const { error } = await supabase.rpc('create_article', {
          article_title: formData.title,
          article_content: formData.content,
          article_category: formData.category,
          article_excerpt: formData.excerpt || null,
          article_image_url: formData.image_url || null
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 
              (language === 'en' ? 'Edit Article' : 'تعديل المقال') : 
              (language === 'en' ? 'Create Article' : 'إنشاء مقال جديد')
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
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="organic">Organic</SelectItem>
                <SelectItem value="pest-control">Pest Control</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="water-management">Water Management</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="excerpt">{language === 'en' ? 'Excerpt' : 'المقتطف'}</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image_url">{language === 'en' ? 'Image URL' : 'رابط الصورة'}</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              type="url"
            />
          </div>

          <div>
            <Label htmlFor="content">{language === 'en' ? 'Content' : 'المحتوى'}</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={10}
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
