// Shared constants for the candidate assessment. Safe to import from client
// and server code (contains no secrets).

export const ASSESSMENT_BUCKET = 'assessment-submissions';

// Must match file_size_limit on the storage bucket (see the SQL migration).
export const MAX_ZIP_BYTES = 50 * 1024 * 1024;

export const MAX_PORTFOLIO_LINKS = 10;
export const MAX_PORTFOLIO_LINK_LENGTH = 500;
export const MAX_PORTFOLIO_TEXT_LENGTH = 4000;

export const OTP_LENGTH = 6;

export type PortfolioInfo = {
  links: string[];
  text: string | null;
  submittedAt: string | null;
};

export type AssessmentState =
  | { status: 'anonymous'; durationMinutes: number }
  | {
      status: 'not_started';
      email: string;
      durationMinutes: number;
      taskTitle: string | null;
      taskAvailable: boolean;
    }
  | {
      status: 'in_progress';
      email: string;
      serverNow: string;
      startedAt: string;
      deadlineAt: string;
      task: { title: string; body: string };
    }
  | {
      status: 'expired';
      email: string;
      deadlineAt: string;
    }
  | {
      status: 'submitted';
      email: string;
      submittedAt: string;
      fileName: string | null;
      portfolio: PortfolioInfo;
    };
