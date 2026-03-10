import { EmailClient } from '../clients/emailClient.js';
import { HighSeverityLeakAlertEvent } from '../models/highSeverityLeakAlertEvent.js';

interface NotificationServiceOptions {
  emailClient: EmailClient;
}

export class NotificationService {
  constructor(private readonly options: NotificationServiceOptions) {}

  async notifyHighSeverityLeak(event: HighSeverityLeakAlertEvent): Promise<void> {
    if (this.options.emailClient.isConfigured()) {
      await this.options.emailClient.sendHighSeverityAlert(event);
      return;
    }

    console.warn(
      `[ALERT] High severity leak detected. id=${event.leakReportId} severity=${event.severity} location="${event.location}" createdAt=${event.createdAt}`,
    );
  }
}
