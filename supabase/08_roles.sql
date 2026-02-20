-- 08_roles.sql
-- Additional RLS policies for superadmin role management

-- Superadmins can view ALL profiles (needed for Users admin page)
drop policy if exists "Superadmins can view all profiles" on public.profiles;
create policy "Superadmins can view all profiles"
    on public.profiles for select
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'superadmin'
        )
    );

-- Superadmins can update any profile (needed to change roles)
drop policy if exists "Superadmins can update any profile" on public.profiles;
create policy "Superadmins can update any profile"
    on public.profiles for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role = 'superadmin'
        )
    );

-- NOTE: Set your own account as superadmin after running migrations:
-- UPDATE public.profiles SET role = 'superadmin' WHERE email = 'your@email.com';
