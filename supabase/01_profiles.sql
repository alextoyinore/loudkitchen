-- 01_profiles.sql
-- Profiles table linked to auth.users

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    full_name text,
    avatar_url text,
    role text not null default 'user' check (role in ('user', 'admin', 'superadmin', 'staff')),
    created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
    insert into public.profiles (id, email, full_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', '')
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
    on public.profiles for select
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );

-- NOTE: After running this migration, manually set your first admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
