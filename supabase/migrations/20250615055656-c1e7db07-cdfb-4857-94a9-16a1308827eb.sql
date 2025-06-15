
-- Create user progress table to store game progress
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_levels INTEGER[] DEFAULT '{}',
  current_level INTEGER DEFAULT 1,
  total_stars INTEGER DEFAULT 0,
  level_stars JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user progress
CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.user_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON public.user_progress 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
