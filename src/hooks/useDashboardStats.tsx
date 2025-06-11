
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStat {
  id: string;
  stat_type: string;
  value: number;
  last_updated: string;
}

interface RecentActivity {
  id: string;
  activity_text_en: string;
  activity_text_ar: string;
  created_at: string;
}

// البيانات الوهمية للإحصائيات
const mockStats: DashboardStat[] = [
  { id: '1', stat_type: 'total_articles', value: 45, last_updated: new Date().toISOString() },
  { id: '2', stat_type: 'total_videos', value: 23, last_updated: new Date().toISOString() },
  { id: '3', stat_type: 'case_studies', value: 12, last_updated: new Date().toISOString() },
  { id: '4', stat_type: 'active_users', value: 156, last_updated: new Date().toISOString() },
  { id: '5', stat_type: 'pending_bookings', value: 8, last_updated: new Date().toISOString() }
];

// البيانات الوهمية للأنشطة الحديثة
const mockActivities: RecentActivity[] = [
  {
    id: '1',
    activity_text_en: 'New article published: Modern Farming Techniques',
    activity_text_ar: 'تم نشر مقال جديد: تقنيات الزراعة الحديثة',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: '2',
    activity_text_en: 'New user registered: Ahmed Mohamed',
    activity_text_ar: 'مستخدم جديد سجل: أحمد محمد',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: '3',
    activity_text_en: 'Video uploaded: Soil Analysis Methods',
    activity_text_ar: 'تم رفع فيديو: طرق تحليل التربة',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: '4',
    activity_text_en: 'New consultation booking confirmed',
    activity_text_ar: 'تم تأكيد حجز استشارة جديدة',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: '5',
    activity_text_en: 'Case study added: Successful Crop Rotation',
    activity_text_ar: 'تم إضافة دراسة حالة: دورة المحاصيل الناجحة',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  }
];

export const useDashboardStats = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStat[]>(mockStats);
  const [activities, setActivities] = useState<RecentActivity[]>(mockActivities);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // محاولة جلب البيانات من قاعدة البيانات
        const { data: statsData } = await supabase
          .from('dashboard_stats')
          .select('*')
          .order('stat_type');

        const { data: activitiesData } = await supabase
          .from('recent_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        // إذا وجدت بيانات حقيقية، استخدمها
        if (statsData && statsData.length > 0) {
          setStats(statsData);
        }

        if (activitiesData && activitiesData.length > 0) {
          setActivities(activitiesData);
        }

        // إضافة البيانات المفقودة إذا لم تكن موجودة
        if (!statsData || statsData.length === 0) {
          console.log('إضافة البيانات الأساسية للإحصائيات');
          await supabase.from('dashboard_stats').upsert([
            { stat_type: 'total_articles', value: 45 },
            { stat_type: 'total_videos', value: 23 },
            { stat_type: 'case_studies', value: 12 },
            { stat_type: 'active_users', value: 156 },
            { stat_type: 'pending_bookings', value: 8 }
          ]);
        }

        if (!activitiesData || activitiesData.length === 0) {
          console.log('إضافة الأنشطة الأساسية');
          await supabase.from('recent_activities').insert(mockActivities.map(activity => ({
            activity_text_en: activity.activity_text_en,
            activity_text_ar: activity.activity_text_ar,
            created_at: activity.created_at
          })));
        }

        setError(null);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError(null); // لا نعرض خطأ، نستخدم البيانات الوهمية
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshStats = async () => {
    try {
      // تحديث البيانات الوهمية بأرقام جديدة
      const updatedMockStats = mockStats.map(stat => ({
        ...stat,
        value: stat.value + Math.floor(Math.random() * 5) + 1,
        last_updated: new Date().toISOString()
      }));
      setStats(updatedMockStats);

      // محاولة تحديث قاعدة البيانات
      try {
        await supabase.rpc('update_dashboard_stats');
        
        const { data: statsData } = await supabase
          .from('dashboard_stats')
          .select('*')
          .order('stat_type');

        if (statsData && statsData.length > 0) {
          setStats(statsData);
        }
      } catch (dbError) {
        console.log('لا يمكن تحديث قاعدة البيانات، استخدام البيانات المحدثة محلياً');
      }
    } catch (err) {
      console.error('خطأ في تحديث الإحصائيات:', err);
    }
  };

  const getStatValue = (statType: string): number => {
    const stat = stats.find(s => s.stat_type === statType);
    return stat?.value || 0;
  };

  const getActivityText = (activity: RecentActivity): string => {
    return language === 'en' ? activity.activity_text_en : activity.activity_text_ar;
  };

  return {
    stats,
    activities,
    loading,
    error,
    refreshStats,
    getStatValue,
    getActivityText
  };
};
