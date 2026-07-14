-- A session should close when the topic reaches a real conclusion, not just
-- after a fixed number of messages. The model signals this itself; we persist
-- the flag so a page reload doesn't lose whether today's session already closed.
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS concluded BOOLEAN NOT NULL DEFAULT false;
