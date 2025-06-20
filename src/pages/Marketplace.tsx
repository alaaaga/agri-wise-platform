
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/hooks/useCart';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  stock_quantity: number;
  unit: string;
  images: string[];
  category: {
    id: string;
    name: string;
    name_ar: string;
  };
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

const Marketplace = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, name_ar')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          name_ar,
          description,
          description_ar,
          price,
          stock_quantity,
          unit,
          images,
          categories:category_id (
            id,
            name,
            name_ar
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Product interface
      const transformedProducts = data?.map(item => ({
        id: item.id,
        name: item.name,
        name_ar: item.name_ar,
        description: item.description || '',
        description_ar: item.description_ar || '',
        price: item.price,
        stock_quantity: item.stock_quantity,
        unit: item.unit,
        images: item.images || [],
        category: item.categories as { id: string; name: string; name_ar: string; }
      })) || [];

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name_ar.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'all' || 
      product.category?.id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language === 'en' ? 'Agricultural Marketplace' : 'السوق الزراعي'}
        </h1>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={language === 'en' ? 'Search products...' : 'البحث عن المنتجات...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={language === 'en' ? 'All Categories' : 'جميع الفئات'} />
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
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800">
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={language === 'en' ? product.name : product.name_ar}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {language === 'en' ? product.name : product.name_ar}
                </CardTitle>
                {product.category && (
                  <Badge variant="secondary" className="w-fit">
                    {language === 'en' ? product.category.name : product.category.name_ar}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {language === 'en' ? product.description : product.description_ar}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {product.price} {language === 'en' ? 'SAR' : 'ريال'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {language === 'en' ? 'per' : 'لكل'} {product.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'en' ? 'Stock:' : 'المخزون:'}
                    </p>
                    <p className="font-semibold">{product.stock_quantity}</p>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock_quantity === 0 
                    ? (language === 'en' ? 'Out of Stock' : 'نفد المخزون')
                    : (language === 'en' ? 'Add to Cart' : 'إضافة للسلة')
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'No products found' : 'لم يتم العثور على منتجات'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Marketplace;
