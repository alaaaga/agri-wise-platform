
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
import { UserPlus, Search, Settings, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Define the User type according to our database structure
interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: 'active' | 'inactive';
  avatar_url?: string;
}

const AdminUsersPanel = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // For demonstration purposes, we're using mock data
        // In production, you would uncomment this code to fetch from Supabase
        
        /*
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, avatar_url')
          .order('first_name', { ascending: true });
        
        if (error) throw error;
        
        // Transform the data to match our User interface
        const transformedData = data.map(user => ({
          id: user.id,
          email: user.email || '',
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          role: user.role || 'user',
          status: 'active', // This is hardcoded for now
          avatar_url: user.avatar_url
        }));
        
        setUsers(transformedData);
        */
        
        // Using mock data for now
        const mockUsers = [
          { id: '1', first_name: 'Ahmed', last_name: 'Mohamed', email: 'ahmed@example.com', role: 'user', status: 'active' as const },
          { id: '2', first_name: 'Fatima', last_name: 'Ali', email: 'fatima@example.com', role: 'user', status: 'active' as const },
          { id: '3', first_name: 'Mohammed', last_name: 'Ibrahim', email: 'mohammed@example.com', role: 'admin', status: 'active' as const },
          { id: '4', first_name: 'Sara', last_name: 'Ahmed', email: 'sara@example.com', role: 'user', status: 'inactive' as const },
          { id: '5', first_name: 'Khalid', last_name: 'Omar', email: 'khalid@example.com', role: 'user', status: 'active' as const },
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        toast.error(language === 'en' ? 'Failed to fetch users' : 'فشل في جلب المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [language]);
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    (user.first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (user.last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    // In a real app, this would open a form to add a new user
    toast.info(
      language === 'en' 
        ? 'This feature will be implemented soon' 
        : 'سيتم تنفيذ هذه الميزة قريبًا'
    );
  };

  const handleUserSettings = (userId: string) => {
    // In a real app, this would open user settings
    toast.info(
      language === 'en' 
        ? `Managing user ID: ${userId}` 
        : `إدارة المستخدم ذو المعرف: ${userId}`
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>
          {language === 'en' ? 'Manage Users' : 'إدارة المستخدمين'}
        </CardTitle>
        <Button onClick={handleAddUser}>
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
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">{language === 'en' ? 'Loading users...' : 'جاري تحميل المستخدمين...'}</span>
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
                  <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                  <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                  <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                  <TableHead>{language === 'en' ? 'Status' : 'الحالة'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {language === 'en' ? 'No users found' : 'لم يتم العثور على مستخدمين'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
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
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleUserSettings(user.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
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

export default AdminUsersPanel;
