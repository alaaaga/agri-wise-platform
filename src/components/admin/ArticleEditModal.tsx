
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  image_url?: string;
}

interface ArticleEditModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
}

const ArticleEditModal: React.FC<ArticleEditModalProps> = ({
  article,
  isOpen,
  onClose,
  onSave
}) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    category: article?.category || '',
    status: article?.status || 'draft',
    image_url: article?.image_url || ''
  });

  React.useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        category: article.category,
        status: article.status,
        image_url: article.image_url || ''
      });
    }
  }, [article]);

  const handleSave = async () => {
    if (!article) return;
    
    setLoading(true);
    try {
      const updatedArticle: Article = {
        ...article,
        ...formData
      };
      
      onSave(updatedArticle);
      toast.success(
        language === 'en' 
          ? 'Article updated successfully!' 
          : 'تم تحديث المقال بنجاح!'
      );
      onClose();
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error(
        language === 'en' 
          ? 'Error updating article' 
          : 'خطأ في تحديث المقال'
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'agriculture', label: language === 'en' ? 'Agriculture' : 'الزراعة' },
    { value: 'irrigation', label: language === 'en' ? 'Irrigation' : 'الري' },
    { value: 'organic', label: language === 'en' ? 'Organic Farming' : 'الزراعة العضوية' },
    { value: 'pest_control', label: language === 'en' ? 'Pest Control' : 'مكافحة الآفات' },
    { value: 'soil', label: language === 'en' ? 'Soil Management' : 'إدارة التربة' },
    { value: 'technology', label: language === 'en' ? 'Agricultural Technology' : 'التكنولوجيا الزراعية' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {language === 'en' ? 'Edit Article' : 'تعديل المقال'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="title">
              {language === 'en' ? 'Article Title' : 'عنوان المقال'}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={language === 'en' ? 'Enter article title' : 'أدخل عنوان المقال'}
            />
          </div>

          <div>
            <Label htmlFor="content">
              {language === 'en' ? 'Content' : 'المحتوى'}
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={language === 'en' ? 'Enter article content' : 'أدخل محتوى المقال'}
              rows={8}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">
                {language === 'en' ? 'Category' : 'الفئة'}
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر الفئة'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">
                {language === 'en' ? 'Status' : 'الحالة'}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    {language === 'en' ? 'Draft' : 'مسودة'}
                  </SelectItem>
                  <SelectItem value="published">
                    {language === 'en' ? 'Published' : 'منشور'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="image_url" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              {language === 'en' ? 'Image URL' : 'رابط الصورة'}
            </Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder={language === 'en' ? 'Enter image URL' : 'أدخل رابط الصورة'}
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {language === 'en' ? 'Cancel' : 'إلغاء'}
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {language === 'en' ? 'Save Changes' : 'حفظ التغييرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleEditModal;
