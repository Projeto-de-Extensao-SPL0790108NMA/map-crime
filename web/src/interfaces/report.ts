import type { Coordinates } from './location';

export interface CreateReportDTO {
  title: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  attachments?: Array<File>;
}

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface TimelineEvent {
  id: string;
  action: 'created' | 'status_updated' | 'comment_added' | 'assigned_to_user';
  metadata: Record<string, any>;
  createdBy?: {
    name?: string;
    organization: string;
  };
  createdAt: string;
}

interface Attachment {
  url: string;
  name: string;
  type: string;
  size: number;
}

export interface AnonymousReport {
  code: string;
  status: ReportStatus;
  title: string;
  coordinates: Coordinates;
  address: string;
  assignedTo?: string;
  timeline: Array<TimelineEvent>;
  attachments: Array<Attachment>;
  note?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
