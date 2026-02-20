-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Public reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

-- Anyone can insert a review
CREATE POLICY "Anyone can insert a review" ON reviews
    FOR INSERT WITH CHECK (true);

-- Only admins can update or delete reviews
CREATE POLICY "Admins can update reviews" ON reviews
    FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete reviews" ON reviews
    FOR DELETE USING (is_admin());
