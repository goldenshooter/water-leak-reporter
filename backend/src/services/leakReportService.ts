import { AlertQueueClient } from '../clients/alertQueueClient.js';
import { CreateLeakReportInput, LeakReport } from '../models/leakReport.js';
import { LeakReportRepository } from '../repositories/leakReportRepository.js';

interface LeakReportServiceOptions {
  repository: LeakReportRepository;
  alertQueueClient: AlertQueueClient;
  now?: () => Date;
  generateId?: () => string;
}

export class LeakReportService {
  private readonly repository: LeakReportRepository;
  private readonly alertQueueClient: AlertQueueClient;
  private readonly now: () => Date;
  private readonly generateId: () => string;

  constructor(options: LeakReportServiceOptions) {
    this.repository = options.repository;
    this.alertQueueClient = options.alertQueueClient;
    this.now = options.now ?? (() => new Date());
    this.generateId = options.generateId ?? defaultIdGenerator;
  }

  async createReport(input: CreateLeakReportInput): Promise<LeakReport> {
    const report: LeakReport = {
      id: this.generateId(),
      reporterName: input.reporterName,
      email: input.email,
      phone: input.phone,
      location: input.location,
      leakType: input.leakType,
      severity: input.severity,
      description: input.description,
      status: 'open',
      createdAt: this.now().toISOString(),
    };

    const saved = await this.repository.create(report);

    if (saved.severity === 'high') {
      await this.alertQueueClient.sendHighSeverityLeakReported(saved);
    }

    return saved;
  }

  async listReports(): Promise<LeakReport[]> {
    return this.repository.list();
  }
}

function defaultIdGenerator(): string {
  return `WL-${Math.floor(100000 + Math.random() * 900000)}`;
}
