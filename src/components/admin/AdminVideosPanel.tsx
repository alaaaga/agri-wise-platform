
import React, { useState } from 'react';
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
import { Video, Search, Edit, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input";

const mockVideos = [
  { id: 1, title: 'How to Plant Tomatoes', author: 'Ahmed Mohamed', category: 'Growing', published: '2025-05-10', views: 1245 },
  { id: 2, title: 'Soil Preparation Techniques', author: 'Fatima Ali', category: 'Soil', published: '2025-05-08', views: 867 },
  { id: 3, title: 'Natural Pest Control Methods', author: 'Mohammed Ibrahim', category: 'Pest Control', published: '2025-05-05', views: 2156 },
  { id: 4, title: 'Greenhouse Setup Guide', author: 'Sara Ahmed', category: 'Structures', published: '2025-05-02', views: 762 },
  { id: 5, title: 'Water Conservation Tips', author: 'Khalid Omar', category: 'Water Management', published: '2025-04-28', views: 1532 },
];

const AdminVideosPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState(mockVideos);
  
  // Filter videos based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    video.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {language === 'en' ? 'Manage Videos' : 'إدارة الفيديوهات'}
        </CardTitle>
        <Button>
          <Video className="h-4 w-4 mr-2" />
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
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                <TableHead>{language === 'en' ? 'Author' : 'الكاتب'}</TableHead>
                <TableHead>{language === 'en' ? 'Category' : 'التصنيف'}</TableHead>
                <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                <TableHead>{language === 'en' ? 'Views' : 'المشاهدات'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVideos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.author}</TableCell>
                  <TableCell>{video.category}</TableCell>
                  <TableCell>{video.published}</TableCell>
                  <TableCell>{video.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminVideosPanel;
