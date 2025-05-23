
-- First, let's drop any problematic policies that might be causing infinite recursion
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Then, enable row level security if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to read all profiles
CREATE POLICY "Allow public read access to profiles" 
ON profiles FOR SELECT 
TO public 
USING (true);

-- Create policy that allows authenticated users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create policy that allows authenticated users to create their own profile
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Make sure we have the trigger function for creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, role)
  VALUES (new.id, 
         COALESCE(new.raw_user_meta_data->>'first_name', ''),
         COALESCE(new.raw_user_meta_data->>'last_name', ''),
         COALESCE(new.raw_user_meta_data->>'role', 'user'));
  RETURN new;
END;
$$;

-- Make sure we have the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
