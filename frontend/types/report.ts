export type LeakType = 'burst pipe' | 'street leak' | 'meter leak' | 'unknown';

export type Severity = 'low' | 'medium' | 'high';

export type ReportStatus = 'open' | 'in progress' | 'resolved';

export interface WaterLeakReport {
  id: string;
  reporterName: string;
  email?: string;
  phone?: string;
  location: string;
  leakType?: LeakType;
  severity: Severity;
  description?: string;
  status: ReportStatus;
  createdAt: string;
}

export interface CreateReportInput {
  reporterName: string;
  email?: string;
  phone?: string;
  location: string;
  leakType?: LeakType;
  severity: Severity;
  description?: string;
}
