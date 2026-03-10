import { app, InvocationContext } from '@azure/functions';
import { HighSeverityLeakAlertEvent } from '../models/highSeverityLeakAlertEvent.js';
import { notificationService } from './shared/container.js';

function isHighSeverityLeakAlertEvent(payload: unknown): payload is HighSeverityLeakAlertEvent {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  return (
    candidate.eventType === 'leak-report.high-severity' &&
    typeof candidate.leakReportId === 'string' &&
    typeof candidate.severity === 'string' &&
    typeof candidate.location === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}

function parseQueueMessage(message: unknown): HighSeverityLeakAlertEvent {
  if (typeof message === 'string') {
    const parsed = JSON.parse(message) as unknown;
    if (isHighSeverityLeakAlertEvent(parsed)) {
      return parsed;
    }
    throw new Error('Message does not match HighSeverityLeakAlertEvent schema.');
  }

  if (isHighSeverityLeakAlertEvent(message)) {
    return message;
  }

  throw new Error('Queue message payload is invalid.');
}

export async function processHighSeverityLeakAlert(
  message: unknown,
  context: InvocationContext,
): Promise<void> {
  try {
    const event = parseQueueMessage(message);
    await notificationService.notifyHighSeverityLeak(event);
    context.log(`Processed high severity leak alert for report ${event.leakReportId}`);
  } catch (error) {
    context.error('Failed to process high severity leak alert message', error);
    throw error;
  }
}

app.serviceBusQueue('processHighSeverityLeakAlert', {
  connection: 'SERVICE_BUS_CONNECTION_STRING',
  queueName: '%SERVICE_BUS_QUEUE_NAME%',
  handler: processHighSeverityLeakAlert,
});
