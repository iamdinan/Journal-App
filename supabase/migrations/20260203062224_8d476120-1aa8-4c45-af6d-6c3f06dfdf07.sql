-- Create posts table to store blog posts
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (allowing all operations for public access)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read posts" 
ON public.posts 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can create posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Anyone can update posts" 
ON public.posts 
FOR UPDATE 
USING (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete posts" 
ON public.posts 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample posts
INSERT INTO public.posts (title, content, excerpt, created_at, updated_at) VALUES
('The Art of Minimalism', 'Minimalism is not about having less. It''s about making room for more of what matters. In a world cluttered with noise and distractions, choosing simplicity becomes an act of rebellion. When we strip away the unnecessary, we discover what truly brings us joy and purpose.

The journey toward minimalism begins with a single question: Does this add value to my life? This simple inquiry, applied consistently, transforms not just our physical spaces but our mental landscapes as well.', 'Minimalism is not about having less. It''s about making room for more of what matters. In a world cluttered with noise and distractions...', now(), now()),
('Finding Stillness in Motion', 'There is a peculiar peace that comes from moving through the world with intention. Whether walking through a quiet forest or navigating a busy street, stillness is something we carry within us.

The ancient philosophers understood this well. They knew that external chaos need not disturb our inner calm. The practice of finding stillness in motion is perhaps the most practical form of meditation available to modern life.', 'There is a peculiar peace that comes from moving through the world with intention. Whether walking through a quiet forest or navigating...', now() - interval '1 day', now() - interval '1 day'),
('On the Beauty of Imperfection', 'The Japanese concept of wabi-sabi teaches us to find beauty in imperfection. A cracked vase, weathered wood, the asymmetry of handmade objects—these imperfections tell stories that perfection never could.

In our pursuit of flawlessness, we often forget that it is our rough edges that make us interesting. Our scars, our mistakes, our peculiarities—these are not flaws to hide but features to embrace.', 'The Japanese concept of wabi-sabi teaches us to find beauty in imperfection. A cracked vase, weathered wood, the asymmetry of...', now() - interval '2 days', now() - interval '2 days');