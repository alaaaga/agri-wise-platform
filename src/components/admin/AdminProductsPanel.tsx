
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Package, Plus, Edit, Trash2, RefreshCw, Loader2, Eye, EyeOff } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  stock_quantity: number;
  unit: string;
  currency: string;
  is_active: boolean;
  images: string[];
  category_id: string;
  created_at: string;
  categories?: Category;
}

const AdminProductsPanel = () => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // نموذج المنتج
  const [productForm, setProductForm] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: '',
    stock_quantity: '',
    unit: 'kg',
    currency: 'EGP',
    category_id: '',
    is_active: true
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('جاري جلب المنتجات...');
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            name_ar
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('خطأ في جلب المنتجات:', error);
        throw error;
      }

      console.log('تم جلب المنتجات بنجاح:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(language === 'en' ? 'Error loading products' : 'خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('خطأ في جلب الفئات:', error);
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setProductForm({
      name: '',
      name_ar: '',
      description: '',
      description_ar: '',
      price: '',
      stock_quantity: '',
      unit: 'kg',
      currency: 'EGP',
      category_id: '',
      is_active: true
    });
    setEditingProduct(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        name_ar: product.name_ar,
        description: product.description || '',
        description_ar: product.description_ar || '',
        price: product.price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        unit: product.unit,
        currency: product.currency || 'EGP',
        category_id: product.category_id || '',
        is_active: product.is_active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const productData = {
        name: productForm.name,
        name_ar: productForm.name_ar,
        description: productForm.description,
        description_ar: productForm.description_ar,
        price: parseFloat(productForm.price),
        stock_quantity: parseInt(productForm.stock_quantity),
        unit: productForm.unit,
        currency: productForm.currency,
        category_id: productForm.category_id || null,
        is_active: productForm.is_active
      };

      if (editingProduct) {
        // تحديث منتج موجود
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        
        toast.success(language === 'en' ? 'Product updated successfully' : 'تم تحديث المنتج بنجاح');
      } else {
        // إضافة منتج جديد
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        
        toast.success(language === 'en' ? 'Product added successfully' : 'تم إضافة المنتج بنجاح');
      }

      await fetchProducts();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(language === 'en' ? 'Error saving product' : 'خطأ في حفظ المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this product?' : 'هل أنت متأكد من حذف هذا المنتج؟')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      toast.success(language === 'en' ? 'Product deleted successfully' : 'تم حذف المنتج بنجاح');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(language === 'en' ? 'Error deleting product' : 'خطأ في حذف المنتج');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success(
        language === 'en' 
          ? `Product ${!currentStatus ? 'activated' : 'deactivated'} successfully`
          : `تم ${!currentStatus ? 'تفعيل' : 'إلغاء تفعيل'} المنتج بنجاح`
      );
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error(language === 'en' ? 'Error updating product status' : 'خطأ في تحديث حالة المنتج');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">
          {language === 'en' ? 'Loading products...' : 'جاري تحميل المنتجات...'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          {language === 'en' ? 'Products Management' : 'إدارة المنتجات'}
        </h2>
        <div className="flex gap-2">
          <Button onClick={fetchProducts} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Refresh' : 'تحديث'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Add Product' : 'إضافة منتج'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct 
                    ? (language === 'en' ? 'Edit Product' : 'تعديل المنتج')
                    : (language === 'en' ? 'Add New Product' : 'إضافة منتج جديد')
                  }
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'en' ? 'Name (English)' : 'الاسم (بالإنجليزية)'}</Label>
                    <Input 
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Name (Arabic)' : 'الاسم (بالعربية)'}</Label>
                    <Input 
                      value={productForm.name_ar}
                      onChange={(e) => setProductForm({...productForm, name_ar: e.target.value})}
                      placeholder="اسم المنتج"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'en' ? 'Description (English)' : 'الوصف (بالإنجليزية)'}</Label>
                    <Textarea 
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      placeholder="Product description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Description (Arabic)' : 'الوصف (بالعربية)'}</Label>
                    <Textarea 
                      value={productForm.description_ar}
                      onChange={(e) => setProductForm({...productForm, description_ar: e.target.value})}
                      placeholder="وصف المنتج"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{language === 'en' ? 'Price' : 'السعر'}</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Stock Quantity' : 'الكمية المتوفرة'}</Label>
                    <Input 
                      type="number"
                      value={productForm.stock_quantity}
                      onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Unit' : 'الوحدة'}</Label>
                    <Select 
                      value={productForm.unit} 
                      onValueChange={(value) => setProductForm({...productForm, unit: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">كيلو</SelectItem>
                        <SelectItem value="gram">جرام</SelectItem>
                        <SelectItem value="piece">قطعة</SelectItem>
                        <SelectItem value="liter">لتر</SelectItem>
                        <SelectItem value="box">صندوق</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'en' ? 'Category' : 'الفئة'}</Label>
                    <Select 
                      value={productForm.category_id} 
                      onValueChange={(value) => setProductForm({...productForm, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? 'Select category' : 'اختر الفئة'} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {language === 'en' ? category.name : category.name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{language === 'en' ? 'Currency' : 'العملة'}</Label>
                    <Select 
                      value={productForm.currency} 
                      onValueChange={(value) => setProductForm({...productForm, currency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">جنيه مصري</SelectItem>
                        <SelectItem value="USD">دولار أمريكي</SelectItem>
                        <SelectItem value="EUR">يورو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={productForm.is_active}
                    onChange={(e) => setProductForm({...productForm, is_active: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_active">
                    {language === 'en' ? 'Product is active' : 'المنتج نشط'}
                  </Label>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !productForm.name || !productForm.name_ar || !productForm.price}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                    </>
                  ) : (
                    editingProduct 
                      ? (language === 'en' ? 'Update Product' : 'تحديث المنتج')
                      : (language === 'en' ? 'Add Product' : 'إضافة المنتج')
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'en' ? 'No products found' : 'لا توجد منتجات'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className={!product.is_active ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {language === 'en' ? product.name : product.name_ar}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {product.categories ? 
                          (language === 'en' ? product.categories.name : product.categories.name_ar) 
                          : 'غير مصنف'
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? 
                          (language === 'en' ? 'Active' : 'نشط') : 
                          (language === 'en' ? 'Inactive' : 'غير نشط')
                        }
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {language === 'en' ? 'Price:' : 'السعر:'}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {product.price} {product.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">
                        {language === 'en' ? 'Stock:' : 'المخزون:'}
                      </span>
                      <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock_quantity} {product.unit}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {language === 'en' ? product.description : product.description_ar}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenDialog(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Edit' : 'تعديل'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                    >
                      {product.is_active ? (
                        <EyeOff className="h-4 w-4 mr-1" />
                      ) : (
                        <Eye className="h-4 w-4 mr-1" />
                      )}
                      {product.is_active ? 
                        (language === 'en' ? 'Deactivate' : 'إلغاء تفعيل') : 
                        (language === 'en' ? 'Activate' : 'تفعيل')
                      }
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {language === 'en' ? 'Delete' : 'حذف'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPanel;
