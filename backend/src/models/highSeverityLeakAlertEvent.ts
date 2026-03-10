import { Severity } from './leakReport.js';

export interface HighSeverityLeakAlertEvent {
  eventType: 'leak-report.high-severity';
  leakReportId: string;
  severity: Severity;
  location: string;
  createdAt: string;
}
