-- 10_fix_recursion.sql
-- Fixes infinite recursion by using security definer functions

-- 1. Helper functions to check roles (bypasses RLS)
create or replace function public.is_admin()
returns boolean language plpgsql security definer as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid() and role in ('admin', 'superadmin')
    );
end;
$$;

create or replace function public.is_superadmin()
returns boolean language plpgsql security definer as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'superadmin'
    );
end;
$$;

-- 2. Update Profiles Policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Superadmins can view all profiles" on public.profiles;
drop policy if exists "Superadmins can update any profile" on public.profiles;

create policy "Admins can view all profiles"
    on public.profiles for select
    using (public.is_admin());

create policy "Superadmins can update any profile"
    on public.profiles for update
    using (public.is_superadmin());

-- 3. Update other tables for consistency and performance
-- Menu Items
drop policy if exists "Admins can manage menu items" on public.menu_items;
create policy "Admins can manage menu items"
    on public.menu_items for all
    using (public.is_admin());

-- Blog Posts
drop policy if exists "Admins can manage all blog posts" on public.blog_posts;
create policy "Admins can manage all blog posts"
    on public.blog_posts for all
    using (public.is_admin());

-- Staff
drop policy if exists "Admins can manage staff" on public.staff;
create policy "Admins can manage staff"
    on public.staff for all
    using (public.is_admin());

-- Gallery
drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
    on public.gallery for all
    using (public.is_admin());

-- Site Settings
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
    on public.site_settings for update
    using (public.is_admin());

-- Bookings
drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
    on public.bookings for all
    using (public.is_admin());
