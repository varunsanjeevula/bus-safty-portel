-- Add support for multiple images in feedback and incidents tables
-- This migration adds image_urls (JSON array) columns while keeping image_url for backward compatibility

-- Add image_urls column to incidents table (stores array of image URLs)
ALTER TABLE public.incidents
ADD COLUMN image_urls TEXT[] DEFAULT NULL;

-- Add image_urls column to feedback table (stores array of image URLs)
ALTER TABLE public.feedback
ADD COLUMN image_urls TEXT[] DEFAULT NULL;

-- Create an index on the new column for performance
CREATE INDEX idx_incidents_has_images ON public.incidents
USING gin (image_urls);

CREATE INDEX idx_feedback_has_images ON public.feedback
USING gin (image_urls);

-- Update existing records: if image_url exists, move it to image_urls array
UPDATE public.incidents 
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_urls IS NULL;

UPDATE public.feedback 
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_urls IS NULL;

-- Add comments to document the columns
COMMENT ON COLUMN public.incidents.image_urls IS 'Array of public URLs for all evidence photos uploaded with this incident report';
COMMENT ON COLUMN public.feedback.image_urls IS 'Array of public URLs for all photos uploaded with this feedback';
