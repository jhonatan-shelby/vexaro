-- Add WhatsApp and notification settings to profiles
ALTER TABLE public.profiles 
  ADD COLUMN whatsapp_number TEXT,
  ADD COLUMN whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN timezone TEXT NOT NULL DEFAULT 'America/Lima',
  ADD COLUMN daily_summary_time TIME NOT NULL DEFAULT '20:00:00';

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'whatsapp', 'goal_alert', 'calendar_alert')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can read their own notifications."
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications."
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications."
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- System or Service Role can insert (Edge Functions)
-- But for local development flexibility, we can allow users to insert or use Service Role bypassing RLS.
CREATE POLICY "Users can insert their own notifications."
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
