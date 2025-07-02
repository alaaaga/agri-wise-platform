
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
import { BookOpenText, Search, Edit, Trash, Loader2, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import CaseStudyFormModal from './CaseStudyFormModal';
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

interface CaseStudyData {
  id: string;
  title: string;
  author_id?: string;
  category: string;
  region: string;
  published_at?: string;
  content: string;
  summary?: string;
  image_url?: string;
}

const AdminCaseStudiesPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [caseStudies, setCaseStudies] = useState<CaseStudyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudyData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseStudyToDelete, setCaseStudyToDelete] = useState<CaseStudyData | null>(null);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      
      const { data: caseStudiesData, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCaseStudies(caseStudiesData || []);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      toast.error(language === 'en' ? 'Failed to fetch case studies' : 'فشل في جلب دراسات الحالة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, [language]);
  
  const filteredCaseStudies = caseStudies.filter(study => 
    study.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    study.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewCaseStudy = () => {
    setSelectedCaseStudy(null);
    setFormModalOpen(true);
  };

  const handleEditCaseStudy = (caseStudy: CaseStudyData) => {
    setSelectedCaseStudy(caseStudy);
    setFormModalOpen(true);
  };

  const handleDeleteCaseStudy = (caseStudy: CaseStudyData) => {
    setCaseStudyToDelete(caseStudy);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCaseStudy = async () => {
    if (!caseStudyToDelete) return;

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', caseStudyToDelete.id);

      if (error) throw error;

      toast.success(language === 'en' ? 'Case study deleted successfully' : 'تم حذف دراسة الحالة بنجاح');
      fetchCaseStudies();
    } catch (error) {
      console.error('Error deleting case study:', error);
      toast.error(language === 'en' ? 'Error deleting case study' : 'خطأ في حذف دراسة الحالة');
    } finally {
      setDeleteDialogOpen(false);
      setCaseStudyToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {language === 'en' ? 'Manage Case Studies' : 'إدارة دراسات الحالة'}
          </CardTitle>
          <Button onClick={handleNewCaseStudy}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'New Case Study' : 'دراسة حالة جديدة'}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search case studies...' : 'البحث عن دراسات الحالة...'}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{language === 'en' ? 'Loading case studies...' : 'جاري تحميل دراسات الحالة...'}</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                    <TableHead>{language === 'en' ? 'Category' : 'التصنيف'}</TableHead>
                    <TableHead>{language === 'en' ? 'Region' : 'المنطقة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCaseStudies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No case studies found' : 'لم يتم العثور على دراسات حالة'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCaseStudies.map((study) => (
                      <TableRow key={study.id}>
                        <TableCell className="font-medium">{study.title}</TableCell>
                        <TableCell>{study.category}</TableCell>
                        <TableCell>{study.region}</TableCell>
                        <TableCell>{study.published_at ? new Date(study.published_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCaseStudy(study)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteCaseStudy(study)}
                            >
                              <Trash className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <CaseStudyFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        caseStudy={selectedCaseStudy}
        onSuccess={fetchCaseStudies}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This action cannot be undone. This will permanently delete the case study.'
                : 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف دراسة الحالة نهائياً.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCaseStudy}>
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminCaseStudiesPanel;
