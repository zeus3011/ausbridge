# Fix: Login succeeds but admin panel never opens

## Root cause

Your user (`adityajadon7@gmail.com`, id `6d79fb49-62b2-4297-983d-5098d4e3abe7`) signed up and confirmed email successfully — login at 04:26:56 returned 200. But the `user_roles` table has **no row** for you, so `useAuth.isAdmin` resolves to `false` and `RequireAdmin` blocks the route.

The login page only redirects to `/admin` when `isAdmin === true`, which is why you stay on the login screen / see "Access denied".

## Fix

### 1. Grant admin role (database migration)

Insert an `admin` role row for your user:

```sql
insert into public.user_roles (user_id, role)
values ('6d79fb49-62b2-4297-983d-5098d4e3abe7', 'admin')
on conflict (user_id, role) do nothing;
```

### 2. Auto-promote the first user going forward (so this doesn't happen again)

Add a trigger on `auth.users` that grants `admin` to the very first signup only. This mirrors the "first user becomes admin" pattern but keeps it safe (only fires when the table is empty):

```sql
create or replace function public.handle_first_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_first_admin
  after insert on auth.users
  for each row execute function public.handle_first_admin();
```

### 3. Small UX improvement on the login page

Right now the login page only redirects when `isAdmin` becomes true. If a non-admin user signs in, they sit on the login screen with no feedback. Update `src/pages/admin/Login.tsx` to also navigate to `/admin` when `user` exists (the `RequireAdmin` guard will then show the proper "Access denied" message instead of a silent stuck state).

## After applying

- Refresh the page — you should land in the CMS dashboard at `/admin`.
- Any future signups will NOT become admin automatically (only the first one would have); you'll grant them via the DB or a future "manage admins" screen.

No other files need changes for this fix.