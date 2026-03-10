export type LeakType = 'burst pipe' | 'street leak' | 'meter leak' | 'unknown';

export type Severity = 'low' | 'medium' | 'high';

export type LeakStatus = 'open' | 'in progress' | 'resolved';

export interface LeakReport {
  id: string;
  reporterName: string;
  email?: string;
  phone?: string;
  location: string;
  leakType?: LeakType;
  severity: Severity;
  description?: string;
  status: LeakStatus;
  createdAt: string;
}

export interface CreateLeakReportInput {
  reporterName: string;
  email?: string;
  phone?: string;
  location: string;
  leakType?: LeakType;
  severity: Severity;
  description?: string;
}
