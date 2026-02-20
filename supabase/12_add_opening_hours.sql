-- Add opening_hours to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS opening_hours TEXT DEFAULT 'Mon - Fri: 9am - 10pm, Sat - Sun: 10am - 11pm';
