-- Remove status settings entry from site_settings table
DELETE FROM site_settings WHERE key = 'status';
