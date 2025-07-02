
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Edit, Trash, Loader2, Shield, User } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import ConsultantFormModal from './ConsultantFormModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Consultant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
  bio?: string;
  avatar_url?: string;
  specialty?: string;
  experience_years?: number;
  hourly_rate?: number;
  created_at: string;
}

const AdminConsultantsPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consultantToDelete, setConsultantToDelete] = useState<Consultant | null>(null);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      
      const { data: consultantsData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          role,
          is_active,
          bio,
          avatar_url,
          created_at
        `)
        .or('role.eq.consultant,role.eq.admin')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedConsultants = consultantsData?.map(consultant => ({
        ...consultant,
        first_name: consultant.first_name || '',
        last_name: consultant.last_name || '',
        email: consultant.email || '',
        role: consultant.role || 'user',
        is_active: consultant.is_active ?? true,
      })) || [];
      
      setConsultants(formattedConsultants);
    } catch (err) {
      console.error('Error fetching consultants:', err);
      toast.error(language === 'en' ? 'Failed to fetch consultants' : 'فشل في جلب المستشارين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const filteredConsultants = consultants.filter(consultant => 
    (consultant.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (consultant.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (consultant.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleNewConsultant = () => {
    setSelectedConsultant(null);
    setFormModalOpen(true);
  };

  const handleEditConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setFormModalOpen(true);
  };

  const handleDeleteConsultant = (consultant: Consultant) => {
    setConsultantToDelete(consultant);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteConsultant = async () => {
    if (!consultantToDelete) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', consultantToDelete.id);

      if (error) throw error;

      toast.success(language === 'en' ? 'Consultant deactivated successfully' : 'تم إلغاء تفعيل المستشار بنجاح');
      fetchConsultants();
    } catch (error) {
      console.error('Error deactivating consultant:', error);
      toast.error(language === 'en' ? 'Error deactivating consultant' : 'خطأ في إلغاء تفعيل المستشار');
    } finally {
      setDeleteDialogOpen(false);
      setConsultantToDelete(null);
    }
  };

  const toggleConsultantStatus = async (consultant: Consultant) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !consultant.is_active })
        .eq('id', consultant.id);

      if (error) throw error;

      toast.success(language === 'en' 
        ? `Consultant ${!consultant.is_active ? 'activated' : 'deactivated'} successfully` 
        : `تم ${!consultant.is_active ? 'تفعيل' : 'إلغاء تفعيل'} المستشار بنجاح`
      );
      fetchConsultants();
    } catch (error) {
      console.error('Error updating consultant status:', error);
      toast.error(language === 'en' ? 'Error updating consultant status' : 'خطأ في تحديث حالة المستشار');
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {language === 'en' ? 'Manage Consultants' : 'إدارة المستشارين'}
          </CardTitle>
          <Button onClick={handleNewConsultant}>
            <UserPlus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Add Consultant' : 'إضافة مستشار'}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
              <Input
                placeholder={language === 'en' ? 'Search consultants...' : 'البحث عن مستشارين...'}
                className="pl-8 rtl:pr-8 rtl:pl-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{language === 'en' ? 'Loading consultants...' : 'جاري تحميل المستشارين...'}</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                    <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                    <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                    <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Join Date' : 'تاريخ الانضمام'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConsultants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No consultants found' : 'لم يتم العثور على مستشارين'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredConsultants.map((consultant) => (
                      <TableRow key={consultant.id}>
                        <TableCell className="font-medium">
                          {consultant.first_name} {consultant.last_name}
                        </TableCell>
                        <TableCell>{consultant.email}</TableCell>
                        <TableCell>
                          <Badge variant={consultant.role === 'admin' ? 'default' : 'secondary'}>
                            {consultant.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                            {consultant.role === 'admin' 
                              ? (language === 'en' ? 'Admin' : 'مدير')
                              : (language === 'en' ? 'Consultant' : 'مستشار')
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={consultant.is_active ? 'default' : 'secondary'}
                            className={consultant.is_active 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }
                          >
                            {consultant.is_active 
                              ? (language === 'en' ? 'Active' : 'نشط')
                              : (language === 'en' ? 'Inactive' : 'غير نشط')
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(consultant.created_at).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditConsultant(consultant)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleConsultantStatus(consultant)}
                              className={consultant.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                            >
                              {consultant.is_active 
                                ? (language === 'en' ? 'Deactivate' : 'إلغاء تفعيل')
                                : (language === 'en' ? 'Activate' : 'تفعيل')
                              }
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredConsultants.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              {language === 'en' 
                ? `Showing ${filteredConsultants.length} of ${consultants.length} consultants`
                : `عرض ${filteredConsultants.length} من أصل ${consultants.length} مستشار`
              }
            </div>
          )}
        </CardContent>
      </Card>

      <ConsultantFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        consultant={selectedConsultant}
        onSuccess={fetchConsultants}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This will deactivate the consultant account. They will not be able to access the system.'
                : 'سيتم إلغاء تفعيل حساب المستشار. لن يتمكن من الوصول إلى النظام.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConsultant}>
              {language === 'en' ? 'Deactivate' : 'إلغاء تفعيل'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminConsultantsPanel;
