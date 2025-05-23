import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Database } from 'lucide-react';
import { Loader2, Settings } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Json } from '@/integrations/supabase/types';

interface UserPermissions {
  can_create_articles: boolean;
  can_edit_articles: boolean;
  can_delete_articles: boolean;
  can_manage_users: boolean;
}

interface UserPermission {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  permissions: UserPermissions;
}

// Helper function to ensure permissions object has the correct structure
const ensurePermissionsStructure = (permissions: Json | null): UserPermissions => {
  const defaultPermissions: UserPermissions = {
    can_create_articles: false,
    can_edit_articles: false,
    can_delete_articles: false,
    can_manage_users: false
  };
  
  if (!permissions) return defaultPermissions;
  
  // Check if permissions is an object
  if (typeof permissions === 'object' && permissions !== null && !Array.isArray(permissions)) {
    return {
      can_create_articles: Boolean(permissions.can_create_articles),
      can_edit_articles: Boolean(permissions.can_edit_articles),
      can_delete_articles: Boolean(permissions.can_delete_articles),
      can_manage_users: Boolean(permissions.can_manage_users)
    };
  }
  
  return defaultPermissions;
};

const UserPermissionsPanel = () => {
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserPermission | null>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch users with their permissions
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch profiles with permissions
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role, permissions');
        
        if (error) throw error;
        
        // Get user emails from auth (only available to admin)
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
        }
        
        if (!profiles) {
          setUsers([]);
          return;
        }
        
        let usersWithPermissions: UserPermission[] = profiles.map(profile => {
          // Find matching auth user to get email
          const authUser = authData?.users?.find(user => user.id === profile.id);
          
          return {
            id: profile.id,
            email: authUser?.email || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role: profile.role || 'user',
            permissions: ensurePermissionsStructure(profile.permissions)
          };
        });
        
        setUsers(usersWithPermissions);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(language === 'en' 
          ? 'Failed to load user permissions' 
          : 'فشل في تحميل صلاحيات المستخدمين');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [language]);

  const openPermissionsDialog = (user: UserPermission) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const updatePermission = (permission: keyof UserPermissions, value: boolean) => {
    if (!selectedUser) return;
    
    setSelectedUser({
      ...selectedUser,
      permissions: {
        ...selectedUser.permissions,
        [permission]: value
      }
    });
  };

  const savePermissions = async () => {
    if (!selectedUser) return;
    
    try {
      setSaving(true);
      
      // Update permissions in the database
      // First convert UserPermissions to unknown then to Json
      const permissionsAsJson = selectedUser.permissions as unknown as Json;
      
      const { error } = await supabase
        .from('profiles')
        .update({ permissions: permissionsAsJson })
        .eq('id', selectedUser.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
      
      setPermissionsDialogOpen(false);
      
      toast.success(language === 'en'
        ? 'User permissions updated successfully'
        : 'تم تحديث صلاحيات المستخدم بنجاح');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(language === 'en'
        ? 'Failed to update user permissions'
        : 'فشل في تحديث صلاحيات المستخدم');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          {language === 'en' ? 'User Permissions' : 'صلاحيات المستخدمين'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {language === 'en' ? 'Loading user permissions...' : 'جاري تحميل صلاحيات المستخدمين...'}
            </span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'en' ? 'Name' : 'الاسم'}</TableHead>
                  <TableHead>{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</TableHead>
                  <TableHead>{language === 'en' ? 'Role' : 'الدور'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Actions' : 'إجراءات'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      {language === 'en' ? 'No users found' : 'لم يتم العثور على مستخدمين'}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
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
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          onClick={() => openPermissionsDialog(user)}
                          disabled={user.role === 'admin'} // Admins already have all permissions
                          title={user.role === 'admin' ? 'Admins have full permissions' : ''}
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
        
        <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {language === 'en' ? 'Edit Permissions' : 'تعديل الصلاحيات'}
              </DialogTitle>
              <DialogDescription>
                {language === 'en' 
                  ? `Configure permissions for ${selectedUser?.first_name} ${selectedUser?.last_name}` 
                  : `تكوين صلاحيات ${selectedUser?.first_name} ${selectedUser?.last_name}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Create Articles' : 'إنشاء المقالات'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Can create new articles' 
                        : 'يمكن إنشاء مقالات جديدة'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.permissions.can_create_articles}
                    onCheckedChange={(value) => updatePermission('can_create_articles', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Edit Articles' : 'تعديل المقالات'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Can edit existing articles' 
                        : 'يمكن تعديل المقالات الموجودة'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.permissions.can_edit_articles}
                    onCheckedChange={(value) => updatePermission('can_edit_articles', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Delete Articles' : 'حذف المقالات'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Can delete articles' 
                        : 'يمكن حذف المقالات'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.permissions.can_delete_articles}
                    onCheckedChange={(value) => updatePermission('can_delete_articles', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">
                      {language === 'en' ? 'Manage Users' : 'إدارة المستخدمين'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {language === 'en' 
                        ? 'Can manage other users' 
                        : 'يمكن إدارة المستخدمين الآخرين'}
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.permissions.can_manage_users}
                    onCheckedChange={(value) => updatePermission('can_manage_users', value)}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setPermissionsDialogOpen(false)}>
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </Button>
              <Button onClick={savePermissions} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === 'en' ? 'Saving...' : 'جاري الحفظ...'}
                  </>
                ) : (
                  language === 'en' ? 'Save Changes' : 'حفظ التغييرات'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserPermissionsPanel;
