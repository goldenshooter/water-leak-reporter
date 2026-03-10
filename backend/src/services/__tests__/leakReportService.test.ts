import { describe, expect, it, vi } from 'vitest';
import { AlertQueueClient } from '../../clients/alertQueueClient.js';
import { LeakReport } from '../../models/leakReport.js';
import { LeakReportRepository } from '../../repositories/leakReportRepository.js';
import { LeakReportService } from '../leakReportService.js';

class FakeRepository implements LeakReportRepository {
  private readonly items: LeakReport[] = [];

  async create(report: LeakReport): Promise<LeakReport> {
    this.items.unshift(report);
    return report;
  }

  async list(): Promise<LeakReport[]> {
    return [...this.items];
  }
}

describe('LeakReportService', () => {
  it('creates leak report with default status open', async () => {
    const repository = new FakeRepository();
    const queueClient: AlertQueueClient = { sendHighSeverityLeakReported: vi.fn() };

    const service = new LeakReportService({
      repository,
      alertQueueClient: queueClient,
      now: () => new Date('2026-03-09T00:00:00.000Z'),
      generateId: () => 'WL-123456',
    });

    const created = await service.createReport({
      reporterName: 'Taylor',
      location: 'Main Rd',
      severity: 'medium',
    });

    expect(created).toMatchObject({
      id: 'WL-123456',
      reporterName: 'Taylor',
      location: 'Main Rd',
      severity: 'medium',
      status: 'open',
      createdAt: '2026-03-09T00:00:00.000Z',
    });

    expect(queueClient.sendHighSeverityLeakReported).not.toHaveBeenCalled();
  });

  it('sends queue message for high severity leaks', async () => {
    const repository = new FakeRepository();
    const queueClient: AlertQueueClient = { sendHighSeverityLeakReported: vi.fn() };

    const service = new LeakReportService({
      repository,
      alertQueueClient: queueClient,
      now: () => new Date('2026-03-09T00:00:00.000Z'),
      generateId: () => 'WL-999999',
    });

    const created = await service.createReport({
      reporterName: 'Jordan',
      location: 'Bridge Ave',
      severity: 'high',
    });

    expect(queueClient.sendHighSeverityLeakReported).toHaveBeenCalledTimes(1);
    expect(queueClient.sendHighSeverityLeakReported).toHaveBeenCalledWith(created);
  });

  it('does not send queue message for low severity leaks', async () => {
    const repository = new FakeRepository();
    const queueClient: AlertQueueClient = { sendHighSeverityLeakReported: vi.fn() };

    const service = new LeakReportService({
      repository,
      alertQueueClient: queueClient,
    });

    await service.createReport({
      reporterName: 'Jordan',
      location: 'Bridge Ave',
      severity: 'low',
    });

    expect(queueClient.sendHighSeverityLeakReported).not.toHaveBeenCalled();
  });
});
