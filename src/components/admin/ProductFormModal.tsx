
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
import { Loader2, Upload, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Product {
  id?: string;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price: number;
  stock_quantity: number;
  unit: string;
  currency: string;
  is_active: boolean;
  images: string[];
  category_id?: string;
}

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

const ProductFormModal = ({ open, onOpenChange, product, onSuccess }: ProductFormModalProps) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<Product>({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: 0,
    stock_quantity: 0,
    unit: 'kg',
    currency: 'EGP',
    is_active: true,
    images: []
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        name_ar: '',
        description: '',
        description_ar: '',
        price: 0,
        stock_quantity: 0,
        unit: 'kg',
        currency: 'EGP',
        is_active: true,
        images: []
      });
    }
  }, [product]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agriwise')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agriwise')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, publicUrl]
      }));

      toast.success(language === 'en' ? 'Image uploaded successfully' : 'تم رفع الصورة بنجاح');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(language === 'en' ? 'Error uploading image' : 'خطأ في رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        // تحديث منتج موجود
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            name_ar: formData.name_ar,
            description: formData.description || null,
            description_ar: formData.description_ar || null,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            unit: formData.unit,
            currency: formData.currency,
            is_active: formData.is_active,
            images: formData.images,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (error) throw error;
        toast.success(language === 'en' ? 'Product updated successfully' : 'تم تحديث المنتج بنجاح');
      } else {
        // إنشاء منتج جديد
        const { error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            name_ar: formData.name_ar,
            description: formData.description || null,
            description_ar: formData.description_ar || null,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            unit: formData.unit,
            currency: formData.currency,
            is_active: formData.is_active,
            images: formData.images,
            seller_id: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
        toast.success(language === 'en' ? 'Product created successfully' : 'تم إنشاء المنتج بنجاح');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(language === 'en' ? 'Error saving product' : 'خطأ في حفظ المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 
              (language === 'en' ? 'Edit Product' : 'تعديل المنتج') : 
              (language === 'en' ? 'Create Product' : 'إنشاء منتج جديد')
            }
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{language === 'en' ? 'Name (English)' : 'الاسم (إنجليزي)'}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_ar">{language === 'en' ? 'Name (Arabic)' : 'الاسم (عربي)'}</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description">{language === 'en' ? 'Description (English)' : 'الوصف (إنجليزي)'}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">{language === 'en' ? 'Description (Arabic)' : 'الوصف (عربي)'}</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">{language === 'en' ? 'Price' : 'السعر'}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock_quantity">{language === 'en' ? 'Stock Quantity' : 'الكمية المتوفرة'}</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})}
                required
              />
            </div>
            <div>
              <Label htmlFor="unit">{language === 'en' ? 'Unit' : 'الوحدة'}</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">كيلو</SelectItem>
                  <SelectItem value="piece">قطعة</SelectItem>
                  <SelectItem value="liter">لتر</SelectItem>
                  <SelectItem value="pack">عبوة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{language === 'en' ? 'Product Images' : 'صور المنتج'}</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploadingImage}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={uploadingImage}
                className="w-full"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === 'en' ? 'Uploading...' : 'جاري الرفع...'}
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Upload Image' : 'رفع صورة'}
                  </>
                )}
              </Button>
            </div>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
            />
            <Label htmlFor="is_active">{language === 'en' ? 'Active' : 'نشط'}</Label>
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
                product ? 
                  (language === 'en' ? 'Update Product' : 'تحديث المنتج') : 
                  (language === 'en' ? 'Create Product' : 'إنشاء المنتج')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
