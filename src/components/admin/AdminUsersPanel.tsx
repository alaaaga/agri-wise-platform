
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
import { UserPlus, Search, Settings, Loader2, Shield } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: 'active' | 'inactive';
  avatar_url?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  banned?: boolean;
}

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
        console.log('جاري جلب المستخدمين...');
        
        // جلب المستخدمين من جدول profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, avatar_url');
        
        if (profilesError) {
          console.error('خطأ في جلب الملفات الشخصية:', profilesError);
          throw profilesError;
        }
        
        console.log('تم جلب الملفات الشخصية:', profiles);
        
        // محاولة جلب بيانات المصادقة
        try {
          const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers() as { 
            data: AuthUsersResponse, 
            error: Error | null 
          };
          
          if (authError) {
            console.error('تحذير: لا يمكن جلب بيانات المصادقة:', authError);
          }
          
          // دمج البيانات
          const transformedData = profiles.map(profile => {
            const authUser = authUsers?.users?.find(user => user.id === profile.id);
            return {
              id: profile.id,
              email: authUser?.email || 'غير متاح',
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              role: profile.role || 'user',
              status: authUser?.banned ? 'inactive' as const : 'active' as const,
              avatar_url: profile.avatar_url
            };
          });
          
          setUsers(transformedData);
          console.log('تم دمج بيانات المستخدمين بنجاح:', transformedData);
          
        } catch (authError) {
          console.error('خطأ في جلب بيانات المصادقة، سيتم استخدام الملفات الشخصية فقط:', authError);
          
          // استخدام الملفات الشخصية فقط
          const transformedData = profiles.map(profile => ({
            id: profile.id,
            email: 'غير متاح',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role: profile.role || 'user',
            status: 'active' as const,
            avatar_url: profile.avatar_url
          }));
          
          setUsers(transformedData);
        }
        
      } catch (err) {
        console.error('خطأ في جلب المستخدمين:', err);
        setError(err instanceof Error ? err.message : 'فشل في جلب المستخدمين');
        toast.error(language === 'en' ? 'Failed to fetch users' : 'فشل في جلب المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [language]);
  
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

  const makeUserAdmin = async (userId: string) => {
    try {
      console.log('جاري تحديث المستخدم إلى مسؤول:', userId);
      
      const { data, error } = await supabase.rpc('make_user_admin', {
        target_user_id: userId
      });

      if (error) {
        console.error('خطأ في تحديث المستخدم:', error);
        toast.error('خطأ في تحديث المستخدم: ' + error.message);
        return;
      }

      console.log('نتيجة تحديث المستخدم:', data);
      toast.success(data || 'تم تحديث المستخدم إلى مسؤول بنجاح!');
      
      // تحديث البيانات المحلية
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: 'admin' }
          : user
      ));
      
    } catch (error) {
      console.error('خطأ غير متوقع في تحديث المستخدم:', error);
      toast.error('خطأ غير متوقع في تحديث المستخدم');
    }
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
                        <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${
                          user.role === 'admin' 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-secondary/20 text-secondary-foreground'
                        }`}>
                          {user.role === 'admin' && <Shield className="h-3 w-3" />}
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
                        <div className="flex gap-2 justify-end">
                          {user.role !== 'admin' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => makeUserAdmin(user.id)}
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              {language === 'en' ? 'Make Admin' : 'جعل مسؤول'}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                          >
                            <Settings className="h-4 w-4" />
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

export default AdminUsersPanel;
