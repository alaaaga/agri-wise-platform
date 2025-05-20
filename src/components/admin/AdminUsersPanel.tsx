
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
import { UserPlus, Search, Settings } from 'lucide-react';
import { Input } from "@/components/ui/input";

const mockUsers = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@example.com', role: 'user', status: 'active' },
  { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Mohammed Ibrahim', email: 'mohammed@example.com', role: 'admin', status: 'active' },
  { id: 4, name: 'Sara Ahmed', email: 'sara@example.com', role: 'user', status: 'inactive' },
  { id: 5, name: 'Khalid Omar', email: 'khalid@example.com', role: 'user', status: 'active' },
];

const AdminUsersPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {language === 'en' ? 'Manage Users' : 'إدارة المستخدمين'}
        </CardTitle>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'Add User' : 'إضافة مستخدم'}
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'en' ? 'Search users...' : 'البحث عن مستخدمين...'}
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
                <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary/20 text-secondary-foreground'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
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

export default AdminUsersPanel;
