-- 03_blog.sql
-- Blog posts table

create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique not null,
    excerpt text,
    content text,
    cover_image text,
    author text,
    tags text[] default '{}',
    published boolean not null default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
    before update on public.blog_posts
    for each row execute procedure public.set_updated_at();

-- RLS
alter table public.blog_posts enable row level security;

-- Public can read published posts
drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
    on public.blog_posts for select
    using (published = true);

-- Admins can read/write all posts
drop policy if exists "Admins can manage all blog posts" on public.blog_posts;
create policy "Admins can manage all blog posts"
    on public.blog_posts for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() and role in ('admin', 'superadmin')
        )
    );
