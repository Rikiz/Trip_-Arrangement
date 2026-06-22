-- Run this in Supabase SQL Editor to set up the database tables.

CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_name TEXT NOT NULL,
  departure_city TEXT NOT NULL,
  total_days INTEGER NOT NULL,
  destinations TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
  respondent_name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  budget TEXT NOT NULL,
  pace TEXT NOT NULL,
  physical_condition TEXT[] NOT NULL DEFAULT '{}',
  dietary_restrictions TEXT[] NOT NULL DEFAULT '{}',
  chronotype TEXT NOT NULL,
  must_sees TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE UNIQUE NOT NULL,
  draft JSONB NOT NULL DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security but allow all operations (personal app)
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on trips" ON trips FOR ALL USING (true);
CREATE POLICY "Allow all on responses" ON responses FOR ALL USING (true);
CREATE POLICY "Allow all on recommendations" ON recommendations FOR ALL USING (true);
