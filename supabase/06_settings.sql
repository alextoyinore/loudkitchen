-- 06_settings.sql
-- Site settings table (single row, id = 1)

create table if not exists public.site_settings (
    id integer primary key default 1 check (id = 1),
    hero_video_url text,
    contact_email text,
    phone text,
    address text,
    instagram text,
    facebook text,
    twitter text,
    updated_at timestamptz default now()
);

-- Seed default row
insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

-- Auto-update updated_at
drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
    before update on public.site_settings
    for each row execute procedure public.set_updated_at();

-- RLS
alter table public.site_settings enable row level security;

-- Public can read settings
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
    on public.site_settings for select
    using (true);

-- Only admins can update settings
drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
    on public.site_settings for update
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
