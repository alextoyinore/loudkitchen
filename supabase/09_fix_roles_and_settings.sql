-- 09_fix_roles_and_settings.sql
-- Consolidated fix for SuperAdmin permissions across all tables

-- 1. Profiles (Allow SuperAdmins to view all)
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
    on public.profiles for select
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 2. Menu Items
drop policy if exists "Admins can manage menu items" on public.menu_items;
create policy "Admins can manage menu items"
    on public.menu_items for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 3. Blog Posts
drop policy if exists "Admins can manage all blog posts" on public.blog_posts;
create policy "Admins can manage all blog posts"
    on public.blog_posts for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 4. Staff
drop policy if exists "Admins can manage staff" on public.staff;
create policy "Admins can manage staff"
    on public.staff for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 5. Gallery
drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
    on public.gallery for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 6. Site Settings (The critical fix for the save issue)
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
    on public.site_settings for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- 7. Bookings
drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
    on public.bookings for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
