
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Phone, Plus, Edit, Trash2, Eye, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FieldVisitFormModal from './FieldVisitFormModal';

interface FieldVisit {
  id: string;
  client_name: string;
  client_phone: string;
  visit_date: string;
  visit_time: string;
  location: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price?: number;
  created_at: string;
}

const AdminFieldVisitsPanel = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<FieldVisit | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchFieldVisits = async () => {
    try {
      setLoading(true);
      
      const { data: visitsData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('service_type', 'field_visit')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // تحويل البيانات إلى التنسيق المطلوب
      const formattedVisits: FieldVisit[] = visitsData?.map(visit => ({
        id: visit.id,
        client_name: visit.title,
        client_phone: '01000000000', // يمكن إضافة حقل الهاتف للجدول لاحقاً
        visit_date: visit.booking_date,
        visit_time: visit.booking_time,
        location: visit.description || 'غير محدد',
        service_type: 'زيارة ميدانية',
        status: visit.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        notes: visit.notes,
        price: visit.price,
        created_at: visit.created_at
      })) || [];
      
      setVisits(formattedVisits);
    } catch (err) {
      console.error('Error fetching field visits:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to load field visits' : 'فشل في تحميل الزيارات الميدانية',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFieldVisits();
  }, []);

  const filteredVisits = visits.filter(visit => 
    visit.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.client_phone.includes(searchTerm) ||
    visit.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: language === 'en' ? 'Pending' : 'معلق' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: language === 'en' ? 'Confirmed' : 'مؤكد' },
      completed: { color: 'bg-green-100 text-green-800', text: language === 'en' ? 'Completed' : 'مكتمل' },
      cancelled: { color: 'bg-red-100 text-red-800', text: language === 'en' ? 'Cancelled' : 'ملغي' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const updateVisitStatus = async (visitId: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', visitId);

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Success' : 'نجح',
        description: language === 'en' ? 'Visit status updated' : 'تم تحديث حالة الزيارة',
      });

      fetchFieldVisits();
    } catch (err) {
      console.error('Error updating visit status:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to update status' : 'فشل في تحديث الحالة',
        variant: 'destructive'
      });
    }
  };

  const deleteVisit = async (visitId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', visitId);

      if (error) throw error;

      toast({
        title: language === 'en' ? 'Success' : 'نجح',
        description: language === 'en' ? 'Visit deleted' : 'تم حذف الزيارة',
      });

      fetchFieldVisits();
    } catch (err) {
      console.error('Error deleting visit:', err);
      toast({
        title: language === 'en' ? 'Error' : 'خطأ',
        description: language === 'en' ? 'Failed to delete visit' : 'فشل في حذف الزيارة',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {language === 'en' ? 'Field Visits Management' : 'إدارة الزيارات الميدانية'}
        </h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {language === 'en' ? 'Add Visit' : 'إضافة زيارة'}
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder={language === 'en' ? 'Search visits...' : 'البحث في الزيارات...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            {language === 'en' ? 'Loading visits...' : 'جاري تحميل الزيارات...'}
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {language === 'en' ? 'No field visits found' : 'لا توجد زيارات ميدانية'}
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <Card key={visit.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {visit.client_name}
                  </CardTitle>
                  {getStatusBadge(visit.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{visit.visit_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{visit.visit_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{visit.client_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{visit.location}</span>
                  </div>
                </div>
                
                {visit.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm">{visit.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVisitStatus(visit.id, 'confirmed')}
                      disabled={visit.status === 'confirmed'}
                    >
                      {language === 'en' ? 'Confirm' : 'تأكيد'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateVisitStatus(visit.id, 'completed')}
                      disabled={visit.status === 'completed'}
                    >
                      {language === 'en' ? 'Complete' : 'اكتمال'}
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedVisit(visit);
                        setShowForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVisit(visit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <FieldVisitFormModal
        open={showForm}
        onOpenChange={setShowForm}
        visit={selectedVisit}
        onSuccess={() => {
          fetchFieldVisits();
          setSelectedVisit(null);
        }}
      />
    </div>
  );
};

export default AdminFieldVisitsPanel;
