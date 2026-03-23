CREATE OR REPLACE FUNCTION notify_contact_email()
RETURNS trigger AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://hqnhovkfofbxfqtftewa.supabase.co/functions/v1/notify-contact',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxbmhvdmtmb2ZieGZxdGZ0ZXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5Njc0NTAsImV4cCI6MjA4OTU0MzQ1MH0.zXq1PTQyiJOS0rpOcTM7lttdwzH2StsEBlPkDULqAoQ'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_contact_submission ON contact_submissions;

CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_contact_email();
