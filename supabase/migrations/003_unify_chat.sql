-- Unify the 3 scenario-gated chats into a single daily session.
-- Historical rows keep their original scenario value; new conversations use 'general'.

ALTER TABLE public.conversations DROP CONSTRAINT IF EXISTS conversations_scenario_check;
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_scenario_check
  CHECK (scenario IN ('work','relocation','relationship','general'));

ALTER TABLE public.consultations DROP CONSTRAINT IF EXISTS consultations_scenario_check;
ALTER TABLE public.consultations
  ADD CONSTRAINT consultations_scenario_check
  CHECK (scenario IN ('work','relocation','relationship','general'));
