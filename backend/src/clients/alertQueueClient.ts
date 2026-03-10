import { LeakReport } from '../models/leakReport.js';

export interface AlertQueueClient {
  sendHighSeverityLeakReported(report: LeakReport): Promise<void>;
}

export class NoopAlertQueueClient implements AlertQueueClient {
  async sendHighSeverityLeakReported(_report: LeakReport): Promise<void> {
    return Promise.resolve();
  }
}
