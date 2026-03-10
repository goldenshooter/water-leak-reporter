import { ValidationError } from '../models/errors.js';
import { CreateLeakReportInput, LeakType, Severity } from '../models/leakReport.js';

const allowedLeakTypes: LeakType[] = ['burst pipe', 'street leak', 'meter leak', 'unknown'];
const allowedSeverities: Severity[] = ['low', 'medium', 'high'];

export function validateCreateLeakReportPayload(payload: unknown): CreateLeakReportInput {
  if (!payload || typeof payload !== 'object') {
    throw new ValidationError('Invalid payload.', ['Request body must be a JSON object.']);
  }

  const input = payload as Record<string, unknown>;
  const errors: string[] = [];

  const reporterName = asString(input.reporterName);
  const email = asOptionalString(input.email);
  const phone = asOptionalString(input.phone);
  const location = asString(input.location);
  const leakType = asOptionalString(input.leakType);
  const severity = asString(input.severity);
  const description = asOptionalString(input.description);

  if (!reporterName) errors.push('reporterName is required.');
  if (!location) errors.push('location is required.');

  if (!severity) {
    errors.push('severity is required.');
  } else if (!allowedSeverities.includes(severity as Severity)) {
    errors.push('severity must be one of: low, medium, high.');
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('email must be a valid email address.');
  }

  if (leakType && !allowedLeakTypes.includes(leakType as LeakType)) {
    errors.push('leakType must be one of: burst pipe, street leak, meter leak, unknown.');
  }

  if (errors.length > 0) {
    throw new ValidationError('Validation failed.', errors);
  }

  return {
    reporterName,
    email,
    phone,
    location,
    leakType: leakType as LeakType | undefined,
    severity: severity as Severity,
    description,
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
