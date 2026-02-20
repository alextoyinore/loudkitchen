-- 02_menu.sql
-- Menu items table

create table if not exists public.menu_items (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    price numeric(10,2) not null,
    category text not null,
    image_url text,
    is_available boolean not null default true,
    created_at timestamptz default now()
);

-- RLS
alter table public.menu_items enable row level security;

-- Public can read all menu items
drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
    on public.menu_items for select
    using (true);

-- Only admins can insert/update/delete
drop policy if exists "Admins can manage menu items" on public.menu_items;
create policy "Admins can manage menu items"
    on public.menu_items for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
