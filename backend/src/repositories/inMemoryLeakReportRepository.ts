import { LeakReport } from '../models/leakReport.js';
import { LeakReportRepository } from './leakReportRepository.js';

export class InMemoryLeakReportRepository implements LeakReportRepository {
  private readonly reports: LeakReport[] = [];

  async create(report: LeakReport): Promise<LeakReport> {
    this.reports.unshift(report);
    return report;
  }

  async list(): Promise<LeakReport[]> {
    return [...this.reports];
  }
}
