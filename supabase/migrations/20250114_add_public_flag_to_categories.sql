-- Add is_public column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create hidden_categories table for tracking which categories users have hidden
CREATE TABLE IF NOT EXISTS hidden_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id, category_id)
);
