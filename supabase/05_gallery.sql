-- 05_gallery.sql
-- Gallery table

create table if not exists public.gallery (
    id uuid primary key default gen_random_uuid(),
    image_url text not null,
    caption text,
    category text,
    sort_order integer default 0,
    created_at timestamptz default now()
);

-- RLS
alter table public.gallery enable row level security;

-- Public can read all gallery images
drop policy if exists "Public can read gallery" on public.gallery;
create policy "Public can read gallery"
    on public.gallery for select
    using (true);

-- Only admins can manage gallery
drop policy if exists "Admins can manage gallery" on public.gallery;
create policy "Admins can manage gallery"
    on public.gallery for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
