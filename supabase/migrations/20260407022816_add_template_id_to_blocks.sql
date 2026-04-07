-- Add template_id to surgical_blocks
ALTER TABLE public.surgical_blocks ADD COLUMN IF NOT EXISTS template_id UUID;
ALTER TABLE public.surgical_blocks DROP CONSTRAINT IF EXISTS surgical_blocks_template_id_fkey;
ALTER TABLE public.surgical_blocks ADD CONSTRAINT surgical_blocks_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.surgical_block_templates(id) ON DELETE SET NULL;
