import type { Coordinates } from './location';

export interface CreateReportDTO {
  title: string;
  description: string;
  coordinates: Coordinates;
  address: string;
  attachments?: Array<File>;
}
