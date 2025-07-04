
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
    category: '',
    excerpt_en: '',
    excerpt_ar: '',
    image_url: '',
    status: 'published' as ContentStatus
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title_en: article.title,
        title_ar: '',
        content_en: article.content,
        content_ar: '',
        category: article.category,
        excerpt_en: article.excerpt || '',
        excerpt_ar: '',
        image_url: article.image_url || '',
        status: article.status || 'published'
      });
    } else {
      setFormData({
        title_en: '',
        title_ar: '',
        content_en: '',
        content_ar: '',
        category: '',
        excerpt_en: '',
        excerpt_ar: '',
        image_url: '',
        status: 'published'
      });
    }
  }, [article, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // التحقق من المدخلات المطلوبة
    if ((!formData.title_en && !formData.title_ar) || 
        (!formData.content_en && !formData.content_ar) || 
        !formData.category) {
      toast.error(language === 'en' ? 'Please fill in required fields in at least one language' : 'الرجاء ملء الحقول المطلوبة بلغة واحدة على الأقل');
      setLoading(false);
      return;
    }

    try {
      const currentUser = await supabase.auth.getUser();
      
      if (article?.id) {
        // تحديث مقال موجود
        const { error } = await supabase
          .from('articles')
          .update({
            title: formData.title_ar || formData.title_en,
            content: formData.content_ar || formData.content_en,
            category: formData.category,
            excerpt: formData.excerpt_ar || formData.excerpt_en || null,
            image_url: formData.image_url || null,
            status: formData.status,
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
            title: formData.title_ar || formData.title_en,
            content: formData.content_ar || formData.content_en,
            category: formData.category,
            excerpt: formData.excerpt_ar || formData.excerpt_en || null,
            image_url: formData.image_url || null,
            status: formData.status,
            author_id: currentUser.data.user?.id,
            published_at: new Date().toISOString()
          });

        if (error) throw error;

        // تسجيل النشاط
        await supabase
          .from('recent_activities')
          .insert({
            user_id: currentUser.data.user?.id,
            activity_type: 'article_created',
            title: 'تم إنشاء مقال جديد',
            description: formData.title_ar || formData.title_en
          });

        toast.success(language === 'en' ? 'Article created successfully' : 'تم إنشاء المقال بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error(error.message || (language === 'en' ? 'Error saving article' : 'خطأ في حفظ المقال'));
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    // التصنيفات الزراعية
    { value: 'irrigation', label: { en: 'Irrigation', ar: 'الري' }, type: 'agricultural' },
    { value: 'organic-farming', label: { en: 'Organic Farming', ar: 'الزراعة العضوية' }, type: 'agricultural' },
    { value: 'pest-control', label: { en: 'Pest Control', ar: 'مكافحة الآفات' }, type: 'agricultural' },
    { value: 'sustainability', label: { en: 'Sustainability', ar: 'الاستدامة' }, type: 'agricultural' },
    { value: 'water-management', label: { en: 'Water Management', ar: 'إدارة المياه' }, type: 'agricultural' },
    { value: 'crops', label: { en: 'Crops', ar: 'المحاصيل' }, type: 'agricultural' },
    { value: 'soil', label: { en: 'Soil Analysis', ar: 'تحليل التربة' }, type: 'agricultural' },
    { value: 'technology', label: { en: 'Agricultural Technology', ar: 'التكنولوجيا الزراعية' }, type: 'agricultural' },
    { value: 'seeds', label: { en: 'Seeds & Planting', ar: 'البذور والزراعة' }, type: 'agricultural' },
    { value: 'greenhouse', label: { en: 'Greenhouse Management', ar: 'إدارة البيوت المحمية' }, type: 'agricultural' },
    
    // التصنيفات الحيوانية
    { value: 'livestock', label: { en: 'Livestock Care', ar: 'رعاية الماشية' }, type: 'livestock' },
    { value: 'animal-nutrition', label: { en: 'Animal Nutrition', ar: 'تغذية الحيوانات' }, type: 'livestock' },
    { value: 'veterinary', label: { en: 'Veterinary Care', ar: 'الرعاية البيطرية' }, type: 'livestock' },
    { value: 'dairy-farming', label: { en: 'Dairy Farming', ar: 'تربية الألبان' }, type: 'livestock' },
    { value: 'poultry', label: { en: 'Poultry Management', ar: 'إدارة الدواجن' }, type: 'livestock' },
    { value: 'animal-breeding', label: { en: 'Animal Breeding', ar: 'تربية الحيوانات' }, type: 'livestock' },
    { value: 'animal-health', label: { en: 'Animal Health', ar: 'صحة الحيوانات' }, type: 'livestock' },
    { value: 'pasture-management', label: { en: 'Pasture Management', ar: 'إدارة المراعي' }, type: 'livestock' }
  ];

  const agriculturalCategories = categories.filter(cat => cat.type === 'agricultural');
  const livestockCategories = categories.filter(cat => cat.type === 'livestock');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 
              (language === 'en' ? 'Edit Article' : 'تعديل المقال') : 
              (language === 'en' ? 'Create New Article (Multilingual)' : 'إنشاء مقال جديد (متعدد اللغات)')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                {language === 'en' ? 'Category' : 'التصنيف'} <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر التصنيف'} />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2 font-semibold text-green-700">
                    {language === 'en' ? 'Agricultural Articles' : 'مقالات زراعية'}
                  </div>
                  {agriculturalCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      🌱 {cat.label[language as 'en' | 'ar']}
                    </SelectItem>
                  ))}
                  <div className="p-2 font-semibold text-orange-700 mt-2">
                    {language === 'en' ? 'Livestock Articles' : 'مقالات حيوانية'}
                  </div>
                  {livestockCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      🐄 {cat.label[language as 'en' | 'ar']}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="image_url" className="text-sm font-medium">
                {language === 'en' ? 'Image URL' : 'رابط الصورة'}
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
                type="url"
                className="mt-1"
              />
            </div>
          </div>

          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="space-y-4">
              <div>
                <Label htmlFor="title_en" className="text-sm font-medium">
                  Title (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                  placeholder="Enter article title in English"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="excerpt_en" className="text-sm font-medium">
                  Excerpt (English)
                </Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData({...formData, excerpt_en: e.target.value})}
                  placeholder="Brief description in English"
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="content_en" className="text-sm font-medium">
                  Content (English) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en}
                  onChange={(e) => setFormData({...formData, content_en: e.target.value})}
                  placeholder="Write your article content in English..."
                  rows={10}
                  className="mt-1"
                />
              </div>
            </TabsContent>

            <TabsContent value="ar" className="space-y-4">
              <div>
                <Label htmlFor="title_ar" className="text-sm font-medium">
                  العنوان (العربية) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title_ar"
                  value={formData.title_ar}
                  onChange={(e) => setFormData({...formData, title_ar: e.target.value})}
                  placeholder="أدخل عنوان المقال بالعربية"
                  className="mt-1"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="excerpt_ar" className="text-sm font-medium">
                  المقتطف (العربية)
                </Label>
                <Textarea
                  id="excerpt_ar"
                  value={formData.excerpt_ar}
                  onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})}
                  placeholder="وصف مختصر بالعربية"
                  rows={3}
                  className="mt-1"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="content_ar" className="text-sm font-medium">
                  المحتوى (العربية) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content_ar"
                  value={formData.content_ar}
                  onChange={(e) => setFormData({...formData, content_ar: e.target.value})}
                  placeholder="اكتب محتوى مقالك بالعربية..."
                  rows={10}
                  className="mt-1"
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleFormModal;
