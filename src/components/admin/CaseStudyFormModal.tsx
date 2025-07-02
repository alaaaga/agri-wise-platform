
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

interface CaseStudy {
  id?: string;
  title: string;
  content: string;
  category: string;
  region: string;
  summary?: string;
  image_url?: string;
}

interface CaseStudyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseStudy?: CaseStudy | null;
  onSuccess: () => void;
}

const CaseStudyFormModal = ({ open, onOpenChange, caseStudy, onSuccess }: CaseStudyFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CaseStudy>({
    title: '',
    content: '',
    category: '',
    region: '',
    summary: '',
    image_url: ''
  });

  useEffect(() => {
    if (caseStudy) {
      setFormData(caseStudy);
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        region: '',
        summary: '',
        image_url: ''
      });
    }
  }, [caseStudy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (caseStudy?.id) {
        // تحديث دراسة حالة موجودة
        const { error } = await supabase
          .from('case_studies')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            region: formData.region,
            summary: formData.summary || null,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', caseStudy.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Case study updated successfully' : 'تم تحديث دراسة الحالة بنجاح');
      } else {
        // إنشاء دراسة حالة جديدة
        const { error } = await supabase.rpc('create_case_study', {
          study_title: formData.title,
          study_content: formData.content,
          study_category: formData.category,
          study_region: formData.region,
          study_summary: formData.summary || null,
          study_image_url: formData.image_url || null
        });

        if (error) throw error;
        toast.success(language === 'en' ? 'Case study created successfully' : 'تم إنشاء دراسة الحالة بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving case study:', error);
      toast.error(language === 'en' ? 'Error saving case study' : 'خطأ في حفظ دراسة الحالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {caseStudy ? 
              (language === 'en' ? 'Edit Case Study' : 'تعديل دراسة الحالة') : 
              (language === 'en' ? 'Create Case Study' : 'إنشاء دراسة حالة جديدة')
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{language === 'en' ? 'Category' : 'التصنيف'}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر التصنيف'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Land Reclamation">Land Reclamation</SelectItem>
                  <SelectItem value="Sustainability">Sustainability</SelectItem>
                  <SelectItem value="Water Management">Water Management</SelectItem>
                  <SelectItem value="Urban Agriculture">Urban Agriculture</SelectItem>
                  <SelectItem value="Livestock">Livestock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">{language === 'en' ? 'Region' : 'المنطقة'}</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'en' ? 'Select region' : 'اختر المنطقة'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Western Desert">Western Desert</SelectItem>
                  <SelectItem value="Nile Delta">Nile Delta</SelectItem>
                  <SelectItem value="Fayoum">Fayoum</SelectItem>
                  <SelectItem value="Cairo">Cairo</SelectItem>
                  <SelectItem value="Matrouh">Matrouh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="summary">{language === 'en' ? 'Summary' : 'الملخص'}</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
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
                caseStudy ? 
                  (language === 'en' ? 'Update Case Study' : 'تحديث دراسة الحالة') : 
                  (language === 'en' ? 'Create Case Study' : 'إنشاء دراسة الحالة')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaseStudyFormModal;
