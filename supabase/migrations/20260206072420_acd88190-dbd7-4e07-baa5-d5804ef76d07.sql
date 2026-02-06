-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('starter', 'professional', 'enterprise');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'cancelled', 'pending');

-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'station_owner', 'listener');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'listener',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create radio_stations table
CREATE TABLE public.radio_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  frequency TEXT,
  genre TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  stream_url TEXT,
  is_live BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  listeners_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.radio_stations(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan subscription_plan NOT NULL DEFAULT 'starter',
  status subscription_status NOT NULL DEFAULT 'pending',
  max_listeners INTEGER NOT NULL DEFAULT 100,
  price_usd DECIMAL(10, 2) NOT NULL DEFAULT 29.00,
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for listener tracking
CREATE TABLE public.station_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.radio_stations(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_listeners INTEGER NOT NULL DEFAULT 0,
  unique_listeners INTEGER NOT NULL DEFAULT 0,
  peak_listeners INTEGER NOT NULL DEFAULT 0,
  total_listening_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (station_id, date)
);

-- Create listener sessions table for real-time tracking
CREATE TABLE public.listener_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.radio_stations(id) ON DELETE CASCADE NOT NULL,
  listener_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER
);

-- Create custom app requests table
CREATE TABLE public.custom_app_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES public.radio_stations(id) ON DELETE CASCADE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  requirements TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.station_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listener_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_app_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user owns a station
CREATE OR REPLACE FUNCTION public.owns_station(_user_id UUID, _station_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.radio_stations
    WHERE id = _station_id
      AND owner_id = _user_id
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Radio stations policies - approved stations are public
CREATE POLICY "Anyone can view approved stations"
  ON public.radio_stations FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Station owners can view their own stations"
  ON public.radio_stations FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Station owners can update their stations"
  ON public.radio_stations FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create stations"
  ON public.radio_stations FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Station owners can view their subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (public.owns_station(auth.uid(), station_id));

CREATE POLICY "Station owners can update their subscription"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (public.owns_station(auth.uid(), station_id));

-- Analytics policies
CREATE POLICY "Station owners can view their analytics"
  ON public.station_analytics FOR SELECT
  TO authenticated
  USING (public.owns_station(auth.uid(), station_id));

-- Listener sessions policies
CREATE POLICY "Station owners can view their listener sessions"
  ON public.listener_sessions FOR SELECT
  TO authenticated
  USING (public.owns_station(auth.uid(), station_id));

CREATE POLICY "Anyone can create listener sessions"
  ON public.listener_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sessions can be updated"
  ON public.listener_sessions FOR UPDATE
  USING (true);

-- Custom app requests policies
CREATE POLICY "Station owners can view their app requests"
  ON public.custom_app_requests FOR SELECT
  TO authenticated
  USING (public.owns_station(auth.uid(), station_id));

CREATE POLICY "Station owners can create app requests"
  ON public.custom_app_requests FOR INSERT
  TO authenticated
  WITH CHECK (public.owns_station(auth.uid(), station_id));

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Default role is listener
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'listener');
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radio_stations_updated_at
  BEFORE UPDATE ON public.radio_stations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_app_requests_updated_at
  BEFORE UPDATE ON public.custom_app_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for station logos
INSERT INTO storage.buckets (id, name, public) VALUES ('station-logos', 'station-logos', true);

-- Storage policies for station logos
CREATE POLICY "Anyone can view station logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'station-logos');

CREATE POLICY "Authenticated users can upload station logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'station-logos');

CREATE POLICY "Users can update their own station logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'station-logos');