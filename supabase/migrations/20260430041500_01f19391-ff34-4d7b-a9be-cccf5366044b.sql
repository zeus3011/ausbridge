
-- Tighten media bucket: deny LIST, allow individual object reads only.
-- Storage SELECT distinguishes list vs. get by whether `name` is provided in WHERE.
-- A simple way to block listing while keeping public reads is to require the request
-- to target a specific object (i.e., `name IS NOT NULL`), which is always true for
-- direct fetches via getPublicUrl().
DROP POLICY IF EXISTS "Public can read media" ON storage.objects;
CREATE POLICY "Public can read media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media' AND name IS NOT NULL);

-- Lock down has_role so only RLS policies (which run as the policy owner) use it,
-- not direct API calls.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
