-- The mentor needs to know the user's grammatical gender preference to adapt
-- Spanish adjective/pronoun flexion correctly in its responses.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender TEXT NOT NULL DEFAULT 'neutro'
  CHECK (gender IN ('femenino', 'masculino', 'neutro'));
