-- Stores the ?src= query parameter captured on /assessment so each submission
-- records which page drove it.
alter table public.assessments
add column if not exists src text;
notify pgrst,'reload schema';
