'use client';

import { FormEvent, useMemo, useState } from 'react';
import { submitReport } from '@/lib/report-service';
import { CreateReportInput, LeakType, Severity } from '@/types/report';
import { Card } from '@/components/ui/card';

type FormState = CreateReportInput;
type FormErrors = Partial<Record<keyof FormState, string>>;

const leakTypeOptions: LeakType[] = ['burst pipe', 'street leak', 'meter leak', 'unknown'];
const severityOptions: Severity[] = ['low', 'medium', 'high'];

const initialForm: FormState = {
  reporterName: '',
  email: '',
  phone: '',
  location: '',
  leakType: undefined,
  severity: 'medium',
  description: '',
};

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.reporterName.trim()) {
    errors.reporterName = 'Reporter name is required.';
  }

  if (!form.location.trim()) {
    errors.location = 'Location is required.';
  }

  if (!form.severity) {
    errors.severity = 'Severity is required.';
  }

  if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function ReportForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccessId(null);
    setSubmitError(null);

    try {
      const payload: CreateReportInput = {
        reporterName: form.reporterName.trim(),
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        location: form.location.trim(),
        leakType: form.leakType,
        severity: form.severity,
        description: form.description?.trim() || undefined,
      };

      const result = await submitReport(payload);
      setSuccessId(result.id);
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit report right now. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  return (
    <Card>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Leak report details</h2>
          <p className="mt-1 text-sm text-slate-600">Fields marked with * are required.</p>
        </div>
      </div>

      {successId ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Report submitted successfully. Tracking ID: <span className="font-semibold">{successId}</span>
        </div>
      ) : null}

      {submitError ? (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{submitError}</div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Reporter name *"
            value={form.reporterName}
            onChange={(value) => updateField('reporterName', value)}
            error={errors.reporterName}
            placeholder="e.g. Alex Smith"
          />

          <FormField
            label="Email"
            type="email"
            value={form.email || ''}
            onChange={(value) => updateField('email', value)}
            error={errors.email}
            placeholder="name@example.com"
          />

          <FormField
            label="Phone"
            value={form.phone || ''}
            onChange={(value) => updateField('phone', value)}
            placeholder="Optional"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Leak type</label>
            <select
              value={form.leakType || ''}
              onChange={(event) => updateField('leakType', (event.target.value || undefined) as LeakType | undefined)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">Select leak type</option>
              {leakTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormField
          label="Address or location description *"
          value={form.location}
          onChange={(value) => updateField('location', value)}
          error={errors.location}
          placeholder="Street address, landmark, or nearby intersection"
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Severity *</label>
          <select
            value={form.severity}
            onChange={(event) => updateField('severity', event.target.value as Severity)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {severityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.severity ? <p className="mt-1 text-xs text-rose-700">{errors.severity}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            rows={4}
            value={form.description || ''}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Add details like leak behavior, nearby hazards, or when it started."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">Submitting sends data to the backend API.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-32 items-center justify-center rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-400"
          >
            {isSubmitting ? 'Submitting...' : 'Submit report'}
          </button>
        </div>

        {hasErrors ? (
          <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            Please fix the highlighted fields before submitting.
          </p>
        ) : null}
      </form>
    </Card>
  );
}

function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      {error ? <p className="mt-1 text-xs text-rose-700">{error}</p> : null}
    </div>
  );
}
