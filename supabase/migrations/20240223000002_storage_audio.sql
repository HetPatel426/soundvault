-- Storage bucket: audio (private, no public URLs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio',
  'audio',
  false,
  52428800, -- 50MB
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/x-m4a', 'audio/mp4', 'audio/wav', 'audio/x-wav']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS: users can only read/write their own folder audio/{user_id}/*
CREATE POLICY "audio_select_own"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "audio_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "audio_update_own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "audio_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio' AND (storage.foldername(name))[1] = auth.uid()::text);
