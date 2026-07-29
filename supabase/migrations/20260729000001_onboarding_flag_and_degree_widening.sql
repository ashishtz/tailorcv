-- Track onboarding completion so login can route users back into an
-- unfinished onboarding flow (previously there was no completion signal at
-- all: abandoning onboarding made it permanently unreachable).
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- The degree CHECK only allowed Bachelor's/Master's, surfacing as a dead-end
-- two-option select in the UI. Widen to common credentials.
ALTER TABLE education DROP CONSTRAINT IF EXISTS education_degree_check;
ALTER TABLE education ADD CONSTRAINT education_degree_check
  CHECK (degree IN ('High School', 'Associate', 'Bachelor''s', 'Master''s', 'PhD', 'Diploma', 'Certificate', 'Other'));
