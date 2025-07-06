
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

  // بيانات المقالات الجاهزة للإضافة
  const sampleArticles = [
    {
      category: 'irrigation',
      title_en: 'Smart Irrigation Systems for Modern Agriculture',
      title_ar: 'أنظمة الري الذكية للزراعة الحديثة',
      content_en: 'Smart irrigation systems represent a revolutionary approach to water management in agriculture. These systems use sensors, weather data, and automated controls to optimize water usage while maximizing crop yields. By monitoring soil moisture levels, temperature, and humidity, farmers can ensure their crops receive the exact amount of water needed at the right time. This precision approach not only conserves water but also reduces costs and improves crop quality. Modern smart irrigation systems can be controlled remotely through mobile applications, allowing farmers to manage their irrigation schedules from anywhere. The integration of AI and machine learning helps predict optimal watering times based on historical data and current conditions.',
      content_ar: 'تمثل أنظمة الري الذكية نهجاً ثورياً في إدارة المياه في الزراعة. تستخدم هذه الأنظمة أجهزة الاستشعار وبيانات الطقس والضوابط الآلية لتحسين استخدام المياه مع تعظيم غلة المحاصيل. من خلال مراقبة مستويات رطوبة التربة ودرجة الحرارة والرطوبة، يمكن للمزارعين ضمان حصول محاصيلهم على الكمية الدقيقة من المياه المطلوبة في الوقت المناسب. هذا النهج الدقيق لا يحافظ على المياه فحسب، بل يقلل أيضاً من التكاليف ويحسن جودة المحاصيل. يمكن التحكم في أنظمة الري الذكية الحديثة عن بُعد من خلال تطبيقات الهاتف المحمول، مما يتيح للمزارعين إدارة جداول الري من أي مكان. يساعد دمج الذكاء الاصطناعي والتعلم الآلي في التنبؤ بأوقات الري المثلى بناءً على البيانات التاريخية والظروف الحالية.',
      excerpt_en: 'Learn how smart irrigation systems can revolutionize your farming practices with precision water management.',
      excerpt_ar: 'تعلم كيف يمكن لأنظمة الري الذكية أن تحدث ثورة في ممارساتك الزراعية من خلال إدارة المياه الدقيقة.'
    },
    {
      category: 'livestock',
      title_en: 'Modern Cattle Management: Health and Nutrition',
      title_ar: 'إدارة الماشية الحديثة: الصحة والتغذية',
      content_en: 'Effective cattle management requires a comprehensive approach to health and nutrition. Modern farming practices emphasize preventive healthcare, balanced nutrition, and comfortable living conditions for livestock. Regular health monitoring helps identify potential issues before they become serious problems. A well-balanced diet tailored to the specific needs of different cattle breeds and life stages is crucial for optimal growth and milk production. Proper housing with adequate ventilation, clean water access, and comfortable resting areas significantly impacts cattle welfare and productivity. Technology integration, including health monitoring sensors and automated feeding systems, helps farmers maintain consistent care standards while reducing labor costs.',
      content_ar: 'تتطلب إدارة الماشية الفعالة نهجاً شاملاً للصحة والتغذية. تركز الممارسات الزراعية الحديثة على الرعاية الصحية الوقائية والتغذية المتوازنة وظروف المعيشة المريحة للماشية. تساعد المراقبة الصحية المنتظمة في تحديد المشاكل المحتملة قبل أن تصبح مشاكل خطيرة. النظام الغذائي المتوازن المصمم خصيصاً لتلبية الاحتياجات المحددة لسلالات الماشية المختلفة ومراحل الحياة أمر بالغ الأهمية للنمو الأمثل وإنتاج الحليب. الإسكان المناسب مع التهوية الكافية والوصول للمياه النظيفة ومناطق الراحة المريحة يؤثر بشكل كبير على رفاهية الماشية والإنتاجية. يساعد دمج التكنولوجيا، بما في ذلك أجهزة استشعار مراقبة الصحة وأنظمة التغذية الآلية، المزارعين في الحفاظ على معايير الرعاية المتسقة مع تقليل تكاليف العمالة.',
      excerpt_en: 'Comprehensive guide to modern cattle management focusing on health monitoring and nutritional requirements.',
      excerpt_ar: 'دليل شامل لإدارة الماشية الحديثة يركز على مراقبة الصحة والاحتياجات الغذائية.'
    },
    {
      category: 'organic-farming',
      title_en: 'Transitioning to Organic Farming: A Complete Guide',
      title_ar: 'التحول إلى الزراعة العضوية: دليل شامل',
      content_en: 'Transitioning to organic farming is a significant decision that requires careful planning and patience. The conversion process typically takes 2-3 years to meet organic certification standards. During this transition period, farmers must eliminate synthetic pesticides, herbicides, and fertilizers while building soil health through natural methods. Crop rotation, cover cropping, and composting become essential practices. Market research is crucial to identify demand for organic products and establish distribution channels. Financial planning must account for initial yield reductions and certification costs. However, the long-term benefits include premium pricing, improved soil health, reduced input costs, and environmental sustainability.',
      content_ar: 'التحول إلى الزراعة العضوية قرار مهم يتطلب تخطيطاً دقيقاً وصبراً. تستغرق عملية التحول عادة 2-3 سنوات لتلبية معايير الشهادة العضوية. خلال فترة التحول هذه، يجب على المزارعين التخلص من المبيدات الحشرية ومبيدات الأعشاب والأسمدة الاصطناعية مع بناء صحة التربة من خلال الطرق الطبيعية. تصبح دورة المحاصيل وزراعة المحاصيل الغطائية والتسميد ممارسات أساسية. يعد بحث السوق أمراً بالغ الأهمية لتحديد الطلب على المنتجات العضوية وإنشاء قنوات التوزيع. يجب أن يأخذ التخطيط المالي في الاعتبار انخفاض الإنتاج الأولي وتكاليف الشهادة. ومع ذلك، تشمل الفوائد طويلة المدى التسعير المتميز وتحسين صحة التربة وتقليل تكاليف المدخلات والاستدامة البيئية.',
      excerpt_en: 'Step-by-step guide for farmers looking to transition from conventional to organic farming practices.',
      excerpt_ar: 'دليل خطوة بخطوة للمزارعين الذين يتطلعون للانتقال من الممارسات الزراعية التقليدية إلى العضوية.'
    }
  ];

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

  const fillSampleData = () => {
    const randomArticle = sampleArticles[Math.floor(Math.random() * sampleArticles.length)];
    setFormData({
      ...formData,
      ...randomArticle,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
    });
  };

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
          <div className="flex gap-2 mb-4">
            <Button type="button" variant="outline" onClick={fillSampleData}>
              {language === 'en' ? 'Fill Sample Data' : 'ملء بيانات نموذجية'}
            </Button>
          </div>

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

          <Tabs defaultValue="ar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ar">العربية</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            
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
