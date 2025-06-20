
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  images: string[];
  stock_quantity: number;
  unit: string;
  category: {
    name: string;
    name_ar: string;
  };
}

const Marketplace = () => {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            name_ar
          )
        `)
        .eq('is_active', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(language === 'en' ? 'Failed to load products' : 'فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      (language === 'en' ? product.name : product.name_ar)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (language === 'en' ? product.description : product.description_ar)
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error(language === 'en' ? 'Please login to add items to cart' : 'يرجى تسجيل الدخول لإضافة المنتجات للسلة');
      return;
    }

    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Loading products...' : 'جاري تحميل المنتجات...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Agricultural Marketplace' : 'السوق الزراعي'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'en' 
              ? 'Fresh agricultural products directly from farmers' 
              : 'منتجات زراعية طازجة مباشرة من المزارعين'
            }
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={language === 'en' ? 'Search products...' : 'البحث عن المنتجات...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={language === 'en' ? 'Category' : 'الفئة'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'en' ? 'All Categories' : 'جميع الفئات'}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {language === 'en' ? category.name : category.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={language === 'en' ? product.name : product.name_ar}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">
                  {language === 'en' ? product.name : product.name_ar}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {language === 'en' ? product.description : product.description_ar}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {product.price} {language === 'en' ? 'SAR' : 'ريال'}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{product.unit}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'en' ? 'In Stock:' : 'متوفر:'} {product.stock_quantity}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'en' 
                      ? product.category?.name || 'Uncategorized'
                      : product.category?.name_ar || 'غير مصنف'
                    }
                  </span>
                </div>
                <Button 
                  onClick={() => handleAddToCart(product.id)}
                  className="w-full"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock_quantity === 0
                    ? (language === 'en' ? 'Out of Stock' : 'نفد المخزون')
                    : (language === 'en' ? 'Add to Cart' : 'أضف للسلة')
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {language === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
