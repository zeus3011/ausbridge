CREATE TABLE public.consultation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a consultation request
CREATE POLICY "Anyone can submit consultation requests"
ON public.consultation_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No one can read by default; only service role (used by admins/backend) bypasses RLS.
-- This protects submitted PII from being exposed to the public.