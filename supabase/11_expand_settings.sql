-- 11_expand_settings.sql
-- Add more dynamic fields to site_settings for the homepage

alter table public.site_settings 
add column if not exists site_name text default 'LoudKitchen',
add column if not exists hero_title text default 'LOUD[KITCHEN]',
add column if not exists hero_subtitle text default 'A symphony of flavors in a vibrant atmosphere.',
add column if not exists about_title text default 'Taste the [Rhythm]',
add column if not exists about_text text default 'At Loudkitchen, we believe dining is an experience that engages all senses. From our carefully curated playlists to our visually stunning dishes, every detail is designed to amplify your evening.',
add column if not exists about_image_url text default 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200';

-- Update the existing row with defaults if they are null
update public.site_settings
set 
    site_name = coalesce(site_name, 'LoudKitchen'),
    hero_title = coalesce(hero_title, 'LOUD[KITCHEN]'),
    hero_subtitle = coalesce(hero_subtitle, 'A symphony of flavors in a vibrant atmosphere.'),
    about_title = coalesce(about_title, 'Taste the [Rhythm]'),
    about_text = coalesce(about_text, 'At Loudkitchen, we believe dining is an experience that engages all senses. From our carefully curated playlists to our visually stunning dishes, every detail is designed to amplify your evening.'),
    about_image_url = coalesce(about_image_url, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200')
where id = 1;
