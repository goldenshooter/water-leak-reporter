import nodemailer from 'nodemailer';
import { HighSeverityLeakAlertEvent } from '../models/highSeverityLeakAlertEvent.js';

export interface EmailClient {
  isConfigured(): boolean;
  sendHighSeverityAlert(event: HighSeverityLeakAlertEvent): Promise<void>;
}

export class NoopEmailClient implements EmailClient {
  isConfigured(): boolean {
    return false;
  }

  async sendHighSeverityAlert(_event: HighSeverityLeakAlertEvent): Promise<void> {
    return Promise.resolve();
  }
}

export class SmtpEmailClient implements EmailClient {
  constructor(
    private readonly transporter: nodemailer.Transporter,
    private readonly from: string,
    private readonly to: string,
  ) {}

  isConfigured(): boolean {
    return true;
  }

  async sendHighSeverityAlert(event: HighSeverityLeakAlertEvent): Promise<void> {
    const subject = `High Severity Leak Alert: ${event.leakReportId}`;
    const text = [
      'A high severity water leak has been reported.',
      `Report ID: ${event.leakReportId}`,
      `Severity: ${event.severity}`,
      `Location: ${event.location}`,
      `Created At: ${event.createdAt}`,
      `Event Type: ${event.eventType}`,
    ].join('\n');

    console.log("About to send SMTP email", {
      from: this.from,
      to: this.to,
      subject,
    });

    await this.transporter.sendMail({
      from: this.from,
      to: this.to,
      subject,
      text,
    });
    console.log("SMTP email sent");
  }
}

export function createEmailClientFromEnv(): EmailClient {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.ALERT_EMAIL_FROM;
  const to = process.env.ALERT_EMAIL_TO;

  if (!host || !port || !user || !pass || !from || !to) {
    return new NoopEmailClient();
  }

  const parsedPort = Number.parseInt(port, 10);
  if (Number.isNaN(parsedPort)) {
    return new NoopEmailClient();
  }

  console.log("Using SmtpEmailClient", {host, port, user, from, to});

  const transporter = nodemailer.createTransport({
    host,
    port: parsedPort,
    secure: parsedPort === 465,
    auth: {
      user,
      pass,
    },
  });

  return new SmtpEmailClient(transporter, from, to);
}
