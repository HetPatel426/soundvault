-- Full-text search RPC (returns user's tracks matching query)
CREATE OR REPLACE FUNCTION public.search_tracks(search_query text)
RETURNS SETOF public.tracks
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
AS $$
BEGIN
  IF search_query IS NULL OR trim(search_query) = '' THEN
    RETURN;
  END IF;
  RETURN QUERY
  SELECT * FROM public.tracks
  WHERE auth.uid() = user_id
  AND search_vector @@ plainto_tsquery('english', trim(search_query))
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', trim(search_query))) DESC;
END;
$$;
