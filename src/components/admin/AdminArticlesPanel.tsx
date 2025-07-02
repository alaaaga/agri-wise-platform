
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
import { FileText, Search, Edit, Trash, Loader2, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import ArticleFormModal from './ArticleFormModal';
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

interface Article {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  category: string;
  status?: string;
  published_at?: string;
  author?: string;
  excerpt?: string;
  image_url?: string;
}

const AdminArticlesPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  
  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, content, author_id, category, status, published_at, excerpt, image_url');
      
      if (articlesError) throw articlesError;
      
      const authorIds = articlesData
        .filter(article => article.author_id)
        .map(article => article.author_id);
      
      let authorNames: Record<string, string> = {};
      
      if (authorIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, last_name')
          .in('id', authorIds);
        
        if (!profilesError && profiles) {
          profiles.forEach(profile => {
            authorNames[profile.id] = profile.last_name || 'Unknown';
          });
        }
      }
      
      const articlesWithAuthors = articlesData.map(article => ({
        ...article,
        author: article.author_id ? authorNames[article.author_id] || 'Unknown' : 'Unknown',
      }));
      
      setArticles(articlesWithAuthors);
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast.error(language === 'en' ? 'Failed to fetch articles' : 'فشل في جلب المقالات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [language]);
  
  const filteredArticles = articles.filter(article => 
    (article.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (article.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (article.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleNewArticle = () => {
    setSelectedArticle(null);
    setFormModalOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setFormModalOpen(true);
  };

  const handleDeleteArticle = (article: Article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;

    try {
      const { error } = await supabase.rpc('delete_article', {
        article_id: articleToDelete.id
      });

      if (error) throw error;

      toast.success(language === 'en' ? 'Article deleted successfully' : 'تم حذف المقال بنجاح');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error(language === 'en' ? 'Error deleting article' : 'خطأ في حذف المقال');
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {language === 'en' ? 'Manage Articles' : 'إدارة المقالات'}
          </CardTitle>
          <Button onClick={handleNewArticle}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'New Article' : 'مقال جديد'}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search articles...' : 'البحث عن مقالات...'}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{language === 'en' ? 'Loading articles...' : 'جاري تحميل المقالات...'}</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                    <TableHead>{language === 'en' ? 'Author' : 'الكاتب'}</TableHead>
                    <TableHead>{language === 'en' ? 'Category' : 'التصنيف'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No articles found' : 'لم يتم العثور على مقالات'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredArticles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium">{article.title}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>{article.category}</TableCell>
                        <TableCell>{article.published_at}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                          }`}>
                            {article.status || 'draft'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditArticle(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteArticle(article)}
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

      <ArticleFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        article={selectedArticle}
        onSuccess={fetchArticles}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This action cannot be undone. This will permanently delete the article.'
                : 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف المقال نهائياً.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteArticle}>
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminArticlesPanel;
