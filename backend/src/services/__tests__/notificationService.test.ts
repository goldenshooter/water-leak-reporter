import { describe, expect, it, vi } from 'vitest';
import { EmailClient } from '../../clients/emailClient.js';
import { HighSeverityLeakAlertEvent } from '../../models/highSeverityLeakAlertEvent.js';
import { NotificationService } from '../notificationService.js';

const sampleEvent: HighSeverityLeakAlertEvent = {
  eventType: 'leak-report.high-severity',
  leakReportId: 'WL-123456',
  severity: 'high',
  location: '22 Vintry Drive, Kumeu 0810',
  createdAt: '2026-03-09T09:00:00.000Z',
};

describe('NotificationService', () => {
  it('sends email when email client is configured', async () => {
    const emailClient: EmailClient = {
      isConfigured: vi.fn(() => true),
      sendHighSeverityAlert: vi.fn(async () => Promise.resolve()),
    };

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const service = new NotificationService({ emailClient });

    await service.notifyHighSeverityLeak(sampleEvent);

    expect(emailClient.sendHighSeverityAlert).toHaveBeenCalledTimes(1);
    expect(emailClient.sendHighSeverityAlert).toHaveBeenCalledWith(sampleEvent);
    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('logs a clear console alert when email is not configured', async () => {
    const emailClient: EmailClient = {
      isConfigured: vi.fn(() => false),
      sendHighSeverityAlert: vi.fn(async () => Promise.resolve()),
    };

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const service = new NotificationService({ emailClient });

    await service.notifyHighSeverityLeak(sampleEvent);

    expect(emailClient.sendHighSeverityAlert).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.[0]).toContain('[ALERT] High severity leak detected');
    expect(warnSpy.mock.calls[0]?.[0]).toContain('WL-123456');

    warnSpy.mockRestore();
  });
});
