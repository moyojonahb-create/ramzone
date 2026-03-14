
-- Create the trigger for auto-creating profiles and roles on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add INSERT policy on subscriptions so station owners can create their subscription
CREATE POLICY "Station owners can create subscription"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (owns_station(auth.uid(), station_id));
