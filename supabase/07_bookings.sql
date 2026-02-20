-- 07_bookings.sql
-- Bookings table

create table if not exists public.bookings (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    phone text,
    date date not null,
    time text not null,
    guests integer not null,
    notes text,
    status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
    created_at timestamptz default now()
);

-- RLS
alter table public.bookings enable row level security;

-- Anyone can create a booking
drop policy if exists "Public can insert bookings" on public.bookings;
create policy "Public can insert bookings"
    on public.bookings for insert
    with check (true);

-- Only admins can read and update bookings
drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
    on public.bookings for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
