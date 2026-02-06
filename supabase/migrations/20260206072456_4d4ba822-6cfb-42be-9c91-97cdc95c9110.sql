-- Drop the overly permissive policies
DROP POLICY "Anyone can create listener sessions" ON public.listener_sessions;
DROP POLICY "Sessions can be updated" ON public.listener_sessions;

-- Create more restrictive policies for listener sessions
-- Allow authenticated users to create sessions
CREATE POLICY "Authenticated users can create listener sessions"
  ON public.listener_sessions FOR INSERT
  TO authenticated
  WITH CHECK (listener_id = auth.uid() OR listener_id IS NULL);

-- Allow updating only own sessions
CREATE POLICY "Users can update their own sessions"
  ON public.listener_sessions FOR UPDATE
  TO authenticated
  USING (listener_id = auth.uid());

-- Allow anonymous session creation for non-logged-in listeners (using anon role)
CREATE POLICY "Anonymous users can create sessions"
  ON public.listener_sessions FOR INSERT
  TO anon
  WITH CHECK (listener_id IS NULL);