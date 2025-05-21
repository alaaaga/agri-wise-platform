
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

// Define type for Supabase auth user data
interface AuthUser {
  id: string;
  email?: string;
  banned?: boolean;
  // Add other properties as needed
}

// Define type for Supabase auth response
interface AuthUsersResponse {
  users?: AuthUser[];
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
        
        // Fetch users from Supabase
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, avatar_url');
        
        if (profilesError) throw profilesError;
        
        // Get users authentication data to get emails
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers() as { 
          data: AuthUsersResponse, 
          error: Error | null 
        };
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
          // Continue with profiles only if auth fails
          const transformedData = profiles.map(profile => ({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role: profile.role || 'user',
            status: 'active' as const,
            avatar_url: profile.avatar_url
          }));
          
          setUsers(transformedData);
          return;
        }
        
        // Combine profile and auth data
        const transformedData = profiles.map(profile => {
          const authUser = authUsers.users?.find(user => user.id === profile.id);
          return {
            id: profile.id,
            email: authUser?.email || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role: profile.role || 'user',
            status: authUser?.banned ? 'inactive' as const : 'active' as const,
            avatar_url: profile.avatar_url
          };
        });
        
        setUsers(transformedData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'فشل في جلب المستخدمين');
        toast.error(language === 'en' ? 'Failed to fetch users' : 'فشل في جلب المستخدمين');
        
        // Set fallback mock data if the fetch fails
        const mockUsers = [
          { id: '1', first_name: 'Ahmed', last_name: 'Mohamed', email: 'ahmed@example.com', role: 'user', status: 'active' as const },
          { id: '2', first_name: 'Fatima', last_name: 'Ali', email: 'fatima@example.com', role: 'user', status: 'active' as const },
          { id: '3', first_name: 'Mohammed', last_name: 'Ibrahim', email: 'mohammed@example.com', role: 'admin', status: 'active' as const },
          { id: '4', first_name: 'Sara', last_name: 'Ahmed', email: 'sara@example.com', role: 'user', status: 'inactive' as const },
          { id: '5', first_name: 'Khalid', last_name: 'Omar', email: 'khalid@example.com', role: 'user', status: 'active' as const },
        ];
        
        setUsers(mockUsers);
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
    toast.info(
      language === 'en' 
        ? 'This feature will be implemented soon' 
        : 'سيتم تنفيذ هذه الميزة قريبًا'
    );
  };

  const handleUserSettings = (userId: string) => {
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
