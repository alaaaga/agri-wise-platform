
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { CheckIcon, Loader2 } from 'lucide-react';

interface NewsletterSubscriptionProps {
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ className }) => {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Check if user is already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      if (isAuthenticated && user) {
        try {
          // Check user profile for subscription status
          const { data, error } = await supabase
            .from('profiles')
            .select('newsletter_subscribed')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data && data.newsletter_subscribed) {
            setSubscribed(true);
          }
        } catch (error) {
          console.error('Error checking subscription:', error);
        }
      }
    };
    
    checkSubscription();
  }, [user, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const emailToSubscribe = isAuthenticated ? (user?.email || email) : email;
    
    if (!emailToSubscribe || !emailToSubscribe.includes('@')) {
      toast.error(language === 'en'
        ? 'Please enter a valid email address'
        : 'يرجى إدخال عنوان بريد إلكتروني صالح');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Add to newsletter_subscribers table
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .upsert({ 
          email: emailToSubscribe,
          subscribed: true
        });
      
      if (insertError) throw insertError;
      
      // If logged in, update user profile too
      if (isAuthenticated && user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ newsletter_subscribed: true })
          .eq('id', user.id);
        
        if (updateError) throw updateError;
      }
      
      setSubscribed(true);
      toast.success(language === 'en'
        ? 'Successfully subscribed to the newsletter'
        : 'تم الاشتراك في النشرة الإخبارية بنجاح');
      
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error(language === 'en'
        ? 'Failed to subscribe to the newsletter'
        : 'فشل في الاشتراك في النشرة الإخبارية');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {language === 'en' 
              ? 'Subscribe to our Newsletter' 
              : 'اشترك في نشرتنا الإخبارية'}
          </h3>
          
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Stay updated with the latest agricultural news and tips.' 
              : 'ابق على اطلاع بأحدث الأخبار والنصائح الزراعية.'}
          </p>
          
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <CheckIcon className="h-5 w-5" />
              <span>
                {language === 'en' 
                  ? 'You are subscribed to our newsletter!' 
                  : 'أنت مشترك في نشرتنا الإخبارية!'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder={language === 'en' ? 'Your email' : 'بريدك الإلكتروني'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting || (isAuthenticated && !!user?.email)}
                className="flex-grow"
              />
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : language === 'en' ? 'Subscribe' : 'اشترك'}
              </Button>
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;
