
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
import { Video, Search, Edit, Trash, Loader2, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import VideoFormModal from './VideoFormModal';
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

interface VideoData {
  id: string;
  title: string;
  author_id?: string;
  category: string;
  published_at?: string;
  views: number;
  duration?: number;
  video_url: string;
  description: string;
  thumbnail_url?: string;
}

const AdminVideosPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<VideoData | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      const { data: videosData, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVideos(videosData || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      toast.error(language === 'en' ? 'Failed to fetch videos' : 'فشل في جلب الفيديوهات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [language]);
  
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewVideo = () => {
    setSelectedVideo(null);
    setFormModalOpen(true);
  };

  const handleEditVideo = (video: VideoData) => {
    setSelectedVideo(video);
    setFormModalOpen(true);
  };

  const handleDeleteVideo = (video: VideoData) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoToDelete.id);

      if (error) throw error;

      toast.success(language === 'en' ? 'Video deleted successfully' : 'تم حذف الفيديو بنجاح');
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error(language === 'en' ? 'Error deleting video' : 'خطأ في حذف الفيديو');
    } finally {
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>
            {language === 'en' ? 'Manage Videos' : 'إدارة الفيديوهات'}
          </CardTitle>
          <Button onClick={handleNewVideo}>
            <Plus className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Upload Video' : 'رفع فيديو'}
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search videos...' : 'البحث عن فيديوهات...'}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">{language === 'en' ? 'Loading videos...' : 'جاري تحميل الفيديوهات...'}</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                    <TableHead>{language === 'en' ? 'Category' : 'التصنيف'}</TableHead>
                    <TableHead>{language === 'en' ? 'Duration' : 'المدة'}</TableHead>
                    <TableHead>{language === 'en' ? 'Views' : 'المشاهدات'}</TableHead>
                    <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVideos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {language === 'en' ? 'No videos found' : 'لم يتم العثور على فيديوهات'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVideos.map((video) => (
                      <TableRow key={video.id}>
                        <TableCell className="font-medium">{video.title}</TableCell>
                        <TableCell>{video.category}</TableCell>
                        <TableCell>{video.duration ? `${video.duration} min` : '-'}</TableCell>
                        <TableCell>{video.views?.toLocaleString() || 0}</TableCell>
                        <TableCell>{video.published_at ? new Date(video.published_at).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditVideo(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteVideo(video)}
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

      <VideoFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        video={selectedVideo}
        onSuccess={fetchVideos}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'en' 
                ? 'This action cannot be undone. This will permanently delete the video.'
                : 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف الفيديو نهائياً.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVideo}>
              {language === 'en' ? 'Delete' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminVideosPanel;
