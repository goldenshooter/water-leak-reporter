import { createEmailClientFromEnv } from '../../clients/emailClient.js';
import { createAlertQueueClientFromEnv } from '../../clients/serviceBusClient.js';
import { InMemoryLeakReportRepository } from '../../repositories/inMemoryLeakReportRepository.js';
import { LeakReportService } from '../../services/leakReportService.js';
import { NotificationService } from '../../services/notificationService.js';

const repository = new InMemoryLeakReportRepository();
const alertQueueClient = createAlertQueueClientFromEnv();
const emailClient = createEmailClientFromEnv();

export const leakReportService = new LeakReportService({
  repository,
  alertQueueClient,
});

export const notificationService = new NotificationService({
  emailClient,
});
