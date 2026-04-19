-- (No changes to scenario constraints — keeping work, relocation, relationship)

-- Add conversation_id to consultations so Bitácora can expand full chat
ALTER TABLE public.consultations
  ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL;
