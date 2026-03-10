import { describe, expect, it } from 'vitest';
import { ValidationError } from '../../models/errors.js';
import { validateCreateLeakReportPayload } from '../validation.js';

describe('validateCreateLeakReportPayload', () => {
  it('returns normalized input for valid payload', () => {
    const result = validateCreateLeakReportPayload({
      reporterName: '  Sam Lee  ',
      email: 'sam@example.com',
      phone: '021-111-333',
      location: '  12 Queen St  ',
      leakType: 'street leak',
      severity: 'high',
      description: '  Burst near curb  ',
    });

    expect(result).toEqual({
      reporterName: 'Sam Lee',
      email: 'sam@example.com',
      phone: '021-111-333',
      location: '12 Queen St',
      leakType: 'street leak',
      severity: 'high',
      description: 'Burst near curb',
    });
  });

  it('throws ValidationError when required fields are missing', () => {
    expect(() =>
      validateCreateLeakReportPayload({
        reporterName: '',
        location: '',
        severity: '',
      }),
    ).toThrow(ValidationError);
  });

  it('throws ValidationError on invalid severity', () => {
    expect(() =>
      validateCreateLeakReportPayload({
        reporterName: 'Sam',
        location: 'Main St',
        severity: 'urgent',
      }),
    ).toThrow('severity must be one of: low, medium, high.');
  });

  it('throws ValidationError on invalid email', () => {
    expect(() =>
      validateCreateLeakReportPayload({
        reporterName: 'Sam',
        email: 'bad-email',
        location: 'Main St',
        severity: 'low',
      }),
    ).toThrow('email must be a valid email address.');
  });
});
