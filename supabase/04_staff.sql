-- 04_staff.sql
-- Staff table

create table if not exists public.staff (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text not null,
    bio text,
    image_url text,
    sort_order integer default 0,
    created_at timestamptz default now()
);

-- RLS
alter table public.staff enable row level security;

-- Public can read all staff
drop policy if exists "Public can read staff" on public.staff;
create policy "Public can read staff"
    on public.staff for select
    using (true);

-- Only admins can manage staff
drop policy if exists "Admins can manage staff" on public.staff;
create policy "Admins can manage staff"
    on public.staff for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
