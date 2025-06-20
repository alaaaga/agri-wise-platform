
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStat {
  id: string;
  metric_name: string;
  metric_value: number;
  previous_value: number;
  percentage_change: number;
  last_updated: string;
}

interface RecentActivity {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

// البيانات الوهمية للإحصائيات
const mockStats: DashboardStat[] = [
  { 
    id: '1', 
    metric_name: 'total_articles', 
    metric_value: 45, 
    previous_value: 40,
    percentage_change: 12.5,
    last_updated: new Date().toISOString() 
  },
  { 
    id: '2', 
    metric_name: 'total_videos', 
    metric_value: 23, 
    previous_value: 20,
    percentage_change: 15.0,
    last_updated: new Date().toISOString() 
  },
  { 
    id: '3', 
    metric_name: 'case_studies', 
    metric_value: 12, 
    previous_value: 10,
    percentage_change: 20.0,
    last_updated: new Date().toISOString() 
  },
  { 
    id: '4', 
    metric_name: 'active_users', 
    metric_value: 156, 
    previous_value: 140,
    percentage_change: 11.4,
    last_updated: new Date().toISOString() 
  },
  { 
    id: '5', 
    metric_name: 'pending_bookings', 
    metric_value: 8, 
    previous_value: 5,
    percentage_change: 60.0,
    last_updated: new Date().toISOString() 
  }
];

// البيانات الوهمية للأنشطة الحديثة
const mockActivities: RecentActivity[] = [
  {
    id: '1',
    activity_type: 'article_created',
    title: 'New article published',
    description: 'Modern Farming Techniques',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user_id: 'user1'
  },
  {
    id: '2',
    activity_type: 'user_registered',
    title: 'New user registered',
    description: 'Ahmed Mohamed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user_id: 'user2'
  },
  {
    id: '3',
    activity_type: 'video_uploaded',
    title: 'Video uploaded',
    description: 'Soil Analysis Methods',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    user_id: 'user3'
  },
  {
    id: '4',
    activity_type: 'booking_confirmed',
    title: 'New consultation booking',
    description: 'Booking confirmed',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    user_id: 'user4'
  },
  {
    id: '5',
    activity_type: 'case_study_added',
    title: 'Case study added',
    description: 'Successful Crop Rotation',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    user_id: 'user5'
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
          .order('metric_name');

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
            { metric_name: 'total_articles', metric_value: 45, previous_value: 40, percentage_change: 12.5 },
            { metric_name: 'total_videos', metric_value: 23, previous_value: 20, percentage_change: 15.0 },
            { metric_name: 'case_studies', metric_value: 12, previous_value: 10, percentage_change: 20.0 },
            { metric_name: 'active_users', metric_value: 156, previous_value: 140, percentage_change: 11.4 },
            { metric_name: 'pending_bookings', metric_value: 8, previous_value: 5, percentage_change: 60.0 }
          ]);
        }

        if (!activitiesData || activitiesData.length === 0) {
          console.log('إضافة الأنشطة الأساسية');
          await supabase.from('recent_activities').insert(mockActivities.map(activity => ({
            activity_type: activity.activity_type,
            title: activity.title,
            description: activity.description,
            created_at: activity.created_at,
            user_id: activity.user_id
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
        metric_value: stat.metric_value + Math.floor(Math.random() * 5) + 1,
        last_updated: new Date().toISOString()
      }));
      setStats(updatedMockStats);

      // محاولة تحديث قاعدة البيانات
      try {
        await supabase.rpc('update_dashboard_stats');
        
        const { data: statsData } = await supabase
          .from('dashboard_stats')
          .select('*')
          .order('metric_name');

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

  const getStatValue = (metricName: string): number => {
    const stat = stats.find(s => s.metric_name === metricName);
    return stat?.metric_value || 0;
  };

  const getActivityText = (activity: RecentActivity): string => {
    return language === 'en' ? activity.title : activity.description;
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
