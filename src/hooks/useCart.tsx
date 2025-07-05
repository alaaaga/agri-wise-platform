import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    name_ar: string;
    price: number;
    images: string[];
    unit?: string;
    currency?: string;
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchCartItems = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('جاري جلب عناصر السلة للمستخدم:', user.id);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products:product_id (
            id,
            name,
            name_ar,
            price,
            images,
            unit,
            currency
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('خطأ في جلب عناصر السلة:', error);
        throw error;
      }

      console.log('تم جلب عناصر السلة بنجاح:', data);

      const formattedItems = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.products as any
      })) || [];

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('خطأ في تحميل السلة');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('يرجى تسجيل الدخول لإضافة المنتجات للسلة');
      return false;
    }

    try {
      console.log('إضافة منتج للسلة:', { productId, quantity, userId: user.id });

      // التحقق من وجود المنتج في السلة
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (fetchError) {
        console.error('خطأ في التحقق من السلة:', fetchError);
        throw fetchError;
      }

      if (existingItems && existingItems.length > 0) {
        // تحديث المنتج الموجود
        const existingItem = existingItems[0];
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('خطأ في تحديث السلة:', updateError);
          throw updateError;
        }
      } else {
        // إضافة منتج جديد
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            currency: 'EGP'
          });

        if (insertError) {
          console.error('خطأ في إضافة للسلة:', insertError);
          throw insertError;
        }
      }

      await fetchCartItems();
      toast.success('تم إضافة المنتج للسلة بنجاح');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('خطأ في إضافة المنتج للسلة');
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      await fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('خطأ في تحديث الكمية');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await fetchCartItems();
      toast.success('تم حذف المنتج من السلة');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('خطأ في حذف المنتج');
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      console.log('جاري مسح السلة للمستخدم:', user.id);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('تم مسح السلة بنجاح');
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCartItems();
    } else {
      setCartItems([]);
    }
  }, [user, isAuthenticated]);

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    refetch: fetchCartItems
  };
};
