
-- Update the handle_new_user function to not automatically set role to 'trainer'
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, gym_id, status)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'trainer')::app_role,
    COALESCE(new.raw_user_meta_data->>'gym_id', null)::uuid,
    COALESCE(new.raw_user_meta_data->>'status', 'pending_approval')
  );
  RETURN NEW;
END;
$$;
