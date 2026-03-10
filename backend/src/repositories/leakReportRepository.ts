import { LeakReport } from '../models/leakReport.js';

export interface LeakReportRepository {
  create(report: LeakReport): Promise<LeakReport>;
  list(): Promise<LeakReport[]>;
}
