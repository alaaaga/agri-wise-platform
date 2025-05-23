
-- This SQL file should be run in the Supabase SQL editor to create an admin account
-- with full permissions

-- First, check if admin account already exists
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@agri-consultant.com'
  ) INTO admin_exists;

  IF NOT admin_exists THEN
    -- If admin doesn't exist, create the account
    -- Note: You need to run this SQL in the Supabase SQL editor
    -- This is just for reference
    
    -- For security reasons, you should change this password after first login
    RAISE NOTICE 'Admin account does not exist. Please create it via the Supabase interface.';
    RAISE NOTICE 'Use email: admin@agri-consultant.com and a secure password.';
  ELSE
    -- If admin exists, ensure it has admin role and all permissions
    UPDATE public.profiles
    SET 
      role = 'admin',
      permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true}'
    WHERE id IN (
      SELECT id FROM auth.users WHERE email = 'admin@agri-consultant.com'
    );
    
    RAISE NOTICE 'Admin account updated with full permissions.';
  END IF;
END
$$;

-- Create a function to ensure all admin users have full permissions
CREATE OR REPLACE FUNCTION public.ensure_admin_permissions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    NEW.permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true}';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS set_admin_permissions ON public.profiles;
CREATE TRIGGER set_admin_permissions
BEFORE INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.ensure_admin_permissions();

-- Create a database function to set a user as admin with full permissions
CREATE OR REPLACE FUNCTION public.set_user_as_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  update_count INT;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update the user's role and permissions
  UPDATE public.profiles
  SET 
    role = 'admin',
    permissions = '{"can_create_articles": true, "can_edit_articles": true, "can_delete_articles": true, "can_manage_users": true}'
  WHERE id = user_id;
  
  GET DIAGNOSTICS update_count = ROW_COUNT;
  
  IF update_count > 0 THEN
    RETURN 'Successfully updated user to admin with full permissions';
  ELSE
    RETURN 'Failed to update user. Profile might not exist.';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
