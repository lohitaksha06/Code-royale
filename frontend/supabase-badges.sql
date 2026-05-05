-- Create Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);

-- Create User Badges Table
CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Service role can manage user badges" ON public.user_badges USING (true) WITH CHECK (true);

-- Insert some default badges
INSERT INTO public.badges (name, description, icon) VALUES
('First Blood', 'Win your first 1v1 match', '🩸'),
('10-Day Streak', 'Log in for 10 consecutive days', '🔥'),
('DSA Master', 'Solve 100 Data Structure & Algorithm problems', '🧠'),
('Social Butterfly', 'Add 5 friends on Code Royale', '🦋'),
('Early Adopter', 'Joined during the Beta phase', '🚀')
ON CONFLICT (name) DO NOTHING;
