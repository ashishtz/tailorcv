-- Retired templates (minimal, modern, professional were not ATS-friendly;
-- jake was renamed to compact). getTemplateDef() already falls back to
-- 'classic' for unknown ids, but remapping keeps each resume's stored
-- template honest and preserves the jake -> compact intent.
UPDATE resumes SET template_id = 'compact' WHERE template_id = 'jake';
UPDATE resumes SET template_id = 'classic'
  WHERE template_id IN ('minimal', 'modern', 'professional');
