-- Drop existing constraint if it exists
ALTER TABLE public.patients DROP CONSTRAINT IF EXISTS patients_medical_record_not_empty;

-- Drop NOT NULL from column
ALTER TABLE public.patients ALTER COLUMN medical_record DROP NOT NULL;

-- Re-add constraint to prevent empty strings but allow NULLs
ALTER TABLE public.patients ADD CONSTRAINT patients_medical_record_not_empty CHECK (medical_record IS NULL OR medical_record <> '');
