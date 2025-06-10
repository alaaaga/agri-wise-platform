
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

export const useDashboardStats = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard statistics
        const { data: statsData, error: statsError } = await supabase
          .from('dashboard_stats')
          .select('*')
          .order('stat_type');

        if (statsError) {
          console.error('Error fetching dashboard stats:', statsError);
          setError('Failed to load dashboard statistics');
          return;
        }

        // Fetch recent activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('recent_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (activitiesError) {
          console.error('Error fetching recent activities:', activitiesError);
          setError('Failed to load recent activities');
          return;
        }

        setStats(statsData || []);
        setActivities(activitiesData || []);
        setError(null);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshStats = async () => {
    try {
      // Call the update function first
      const { error: updateError } = await supabase.rpc('update_dashboard_stats');
      
      if (updateError) {
        console.error('Error updating dashboard stats:', updateError);
        return;
      }

      // Fetch updated data
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .order('stat_type');

      if (!statsError && statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error refreshing stats:', err);
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
