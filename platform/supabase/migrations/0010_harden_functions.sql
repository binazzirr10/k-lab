-- Security advisor fixes for functions created in 0001.

-- set_updated_at() is a trigger function; pin its search_path so a role that
-- can create objects in another schema cannot hijack name resolution.
-- It only calls now(), which lives in pg_catalog and is always resolved.
alter function public.set_updated_at() set search_path = '';

-- is_k_lab_admin() is only referenced by RLS policies granted to
-- `authenticated`. Signed-out callers never need it, so remove the default
-- PUBLIC execute grant and keep it for signed-in users and the service role.
revoke all on function public.is_k_lab_admin() from public, anon;
grant execute on function public.is_k_lab_admin() to authenticated, service_role;
