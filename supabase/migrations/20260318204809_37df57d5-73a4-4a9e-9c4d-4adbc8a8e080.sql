
-- Admin can SELECT all stations (regardless of is_approved or owner)
CREATE POLICY "Admins can view all stations"
ON public.radio_stations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can UPDATE all stations (approve, toggle live, etc.)
CREATE POLICY "Admins can update all stations"
ON public.radio_stations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can SELECT all custom app requests
CREATE POLICY "Admins can view all app requests"
ON public.custom_app_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can UPDATE all custom app requests
CREATE POLICY "Admins can update all app requests"
ON public.custom_app_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.subscriptions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all analytics
CREATE POLICY "Admins can view all analytics"
ON public.station_analytics
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
