
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
import { FileText, Search, Edit, Trash, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Article {
  id: string;
  title: string;
  author_id?: string;
  category: string;
  status?: string;
  published_at?: string;
  author?: string;
}

const AdminArticlesPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        
        // Fetch articles from Supabase
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('id, title, author_id, category, status, published_at');
        
        if (articlesError) throw articlesError;
        
        // Get author names for the articles
        const authorIds = articlesData
          .filter(article => article.author_id)
          .map(article => article.author_id);
        
        let authorNames: Record<string, string> = {};
        
        if (authorIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', authorIds);
          
          if (profilesError) {
            console.error('Error fetching author profiles:', profilesError);
          } else {
            profiles.forEach(profile => {
              authorNames[profile.id] = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown';
            });
          }
        }
        
        // Map the articles with author names
        const articlesWithAuthors = articlesData.map(article => ({
          ...article,
          author: article.author_id ? authorNames[article.author_id] || 'Unknown' : 'Unknown',
        }));
        
        setArticles(articlesWithAuthors);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'فشل في جلب المقالات');
        toast.error(language === 'en' ? 'Failed to fetch articles' : 'فشل في جلب المقالات');
        
        // Set fallback mock data if the fetch fails
        const mockArticles = [
          { id: '1', title: 'Modern Irrigation Techniques', author: 'Ahmed Mohamed', category: 'Irrigation', published_at: '2025-05-10', status: 'published' },
          { id: '2', title: 'Organic Farming Best Practices', author: 'Fatima Ali', category: 'Organic', published_at: '2025-05-08', status: 'published' },
          { id: '3', title: 'Pest Control for Citrus Trees', author: 'Mohammed Ibrahim', category: 'Pest Control', published_at: '2025-05-05', status: 'published' },
          { id: '4', title: 'Sustainable Agriculture Methods', author: 'Sara Ahmed', category: 'Sustainability', published_at: '2025-05-02', status: 'draft' },
          { id: '5', title: 'Water Conservation in Farming', author: 'Khalid Omar', category: 'Water Management', published_at: '2025-04-28', status: 'published' },
        ];
        
        setArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, [language]);
  
  // Filter articles based on search query
  const filteredArticles = articles.filter(article => 
    (article.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (article.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (article.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleNewArticle = () => {
    toast.info(
      language === 'en' 
        ? 'This feature will be implemented soon' 
        : 'سيتم تنفيذ هذه الميزة قريبًا'
    );
  };

  const handleEditArticle = (articleId: string) => {
    toast.info(
      language === 'en' 
        ? `Editing article ID: ${articleId}` 
        : `تحرير المقال ذو المعرف: ${articleId}`
    );
  };

  const handleDeleteArticle = (articleId: string) => {
    toast.info(
      language === 'en' 
        ? `Deleting article ID: ${articleId}` 
        : `حذف المقال ذو المعرف: ${articleId}`
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {language === 'en' ? 'Manage Articles' : 'إدارة المقالات'}
        </CardTitle>
        <Button onClick={handleNewArticle}>
          <FileText className="h-4 w-4 mr-2" />
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
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            {language === 'en' ? 'Error: ' : 'خطأ: '}{error}
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
                            onClick={() => handleEditArticle(article.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteArticle(article.id)}
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
  );
};

export default AdminArticlesPanel;
