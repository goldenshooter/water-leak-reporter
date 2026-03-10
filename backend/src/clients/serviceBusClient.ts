import { ServiceBusClient } from '@azure/service-bus';
import { LeakReport } from '../models/leakReport.js';
import { AlertQueueClient, NoopAlertQueueClient } from './alertQueueClient.js';

export class AzureServiceBusAlertQueueClient implements AlertQueueClient {
  constructor(
    private readonly serviceBusClient: ServiceBusClient,
    private readonly queueName: string,
  ) {}

  async sendHighSeverityLeakReported(report: LeakReport): Promise<void> {
    const sender = this.serviceBusClient.createSender(this.queueName);

    try {
      await sender.sendMessages({
        contentType: 'application/json',
        subject: 'leak-report.high-severity',
        body: {
          eventType: 'leak-report.high-severity',
          leakReportId: report.id,
          severity: report.severity,
          location: report.location,
          createdAt: report.createdAt,
        },
      });
    } finally {
      await sender.close();
    }
  }
}

export function createAlertQueueClientFromEnv(): AlertQueueClient {
  const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
  const queueName = process.env.SERVICE_BUS_QUEUE_NAME;

  if (!connectionString || !queueName) {
    return new NoopAlertQueueClient();
  }

  return new AzureServiceBusAlertQueueClient(new ServiceBusClient(connectionString), queueName);
}
