
-- Create an enum for roles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'operator', 'trainer', 'assistant', 'instructor');
  END IF;
END $$;

-- Create the gym_registration_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.gym_registration_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL,
  code TEXT NOT NULL,
  role app_role NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID
);

-- Create RPC functions to get gym ID and role from a registration code
CREATE OR REPLACE FUNCTION public.get_gym_id_from_code(registration_code TEXT)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT gym_id FROM public.gym_registration_codes 
    WHERE code = registration_code AND active = true 
    AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_role_from_code(registration_code TEXT)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.gym_registration_codes 
    WHERE code = registration_code AND active = true 
    AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;
$$;
