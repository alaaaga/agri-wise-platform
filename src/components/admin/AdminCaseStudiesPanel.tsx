
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
import { BookOpenText, Search, Edit, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input";

const mockCaseStudies = [
  { id: 1, title: 'Desert to Farmland Transformation', author: 'Dr. Ahmed Zaki', category: 'Land Reclamation', published: '2025-05-10', region: 'Western Desert' },
  { id: 2, title: 'Sustainable Farming in Nile Delta', author: 'Dr. Fatima Rashid', category: 'Sustainability', published: '2025-05-08', region: 'Nile Delta' },
  { id: 3, title: 'Water Conservation in Fayoum', author: 'Prof. Ibrahim Saleh', category: 'Water Management', published: '2025-05-05', region: 'Fayoum' },
  { id: 4, title: 'Urban Farming Initiative in Cairo', author: 'Dr. Layla Hassan', category: 'Urban Agriculture', published: '2025-05-02', region: 'Cairo' },
  { id: 5, title: 'Livestock Integration in Matrouh', author: 'Dr. Mahmoud Kamal', category: 'Livestock', published: '2025-04-28', region: 'Matrouh' },
];

const AdminCaseStudiesPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [caseStudies, setCaseStudies] = useState(mockCaseStudies);
  
  // Filter case studies based on search query
  const filteredCaseStudies = caseStudies.filter(study => 
    study.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    study.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {language === 'en' ? 'Manage Case Studies' : 'إدارة دراسات الحالة'}
        </CardTitle>
        <Button>
          <BookOpenText className="h-4 w-4 mr-2" />
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
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'en' ? 'Title' : 'العنوان'}</TableHead>
                <TableHead>{language === 'en' ? 'Author' : 'المؤلف'}</TableHead>
                <TableHead>{language === 'en' ? 'Category' : 'التصنيف'}</TableHead>
                <TableHead>{language === 'en' ? 'Region' : 'المنطقة'}</TableHead>
                <TableHead>{language === 'en' ? 'Date' : 'التاريخ'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCaseStudies.map((study) => (
                <TableRow key={study.id}>
                  <TableCell className="font-medium">{study.title}</TableCell>
                  <TableCell>{study.author}</TableCell>
                  <TableCell>{study.category}</TableCell>
                  <TableCell>{study.region}</TableCell>
                  <TableCell>{study.published}</TableCell>
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

export default AdminCaseStudiesPanel;
