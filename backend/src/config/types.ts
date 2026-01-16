export type EmailStatus =
  | "scheduled"
  | "processing"
  | "sent"
  | "failed";

export interface User {
  id: string;
  google_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: Date;
}

export interface EmailBatch {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  start_time: Date;
  delay_between_emails_seconds: number;
  hourly_limit: number;
  total_emails: number;
  created_at: Date;
}

export interface EmailJob {
  id: string;
  batch_id: string;
  recipient_email: string;
  scheduled_at: Date;
  status: EmailStatus;
  sent_at?: Date;
  error_message?: string;
  bull_job_id?: string;
  created_at: Date;
}
