# Water Leak Reporter
A cloud-native full-stack demo application for reporting water leaks and triggering operational alerts.

The system demonstrates an **event-driven serverless architecture** using Azure Functions and Service Bus. High-severity leak reports are processed asynchronously and trigger email notifications.

## Live Demo
https://water-leak-reporter.vercel.app

## What It Demonstrates
- Full-stack architecture (frontend + backend)
- Serverless APIs using **Azure Functions**
- Event-driven messaging with **Azure Service Bus**
- Asynchronous background processing
- Email alerts for high-severity events
- Secure secret management using **Azure Key Vault**

## Tech Stack
**Frontend**
- Next.js (TypeScript, App Router, Tailwind CSS)
- Deployed on Vercel

**Backend**
- Azure Functions (TypeScript)

**Messaging**
- Azure Service Bus + Queue Trigger

**Notifications**
- SMTP email alerts

**Secrets**
- Azure Key Vault

## Architecture
```
Client (Web App)
│
▼
Azure Function API
│
▼
Azure Service Bus Queue
│
▼
Queue Trigger Function
(processHighSeverityLeakAlert)
│
▼
SMTP Email Notification
```

## High-Level Flow
1. User submits a leak report from the web app.
2. Backend processes the report.
3. High-severity reports publish an event to Service Bus.
4. Queue-triggered function consumes the event.
5. Notification service sends an email alert.
