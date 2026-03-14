ALTER TABLE public.radio_stations 
  ADD COLUMN IF NOT EXISTS shoutcast_host text,
  ADD COLUMN IF NOT EXISTS shoutcast_port integer,
  ADD COLUMN IF NOT EXISTS shoutcast_password text,
  ADD COLUMN IF NOT EXISTS mount_point text,
  ADD COLUMN IF NOT EXISTS azuracast_station_id integer;