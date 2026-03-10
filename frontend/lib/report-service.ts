import { CreateReportInput, WaterLeakReport } from '@/types/report';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }

  return process.env.BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071/api';
}

function normalizeErrorMessage(errorBody: unknown): string {
  if (!errorBody || typeof errorBody !== 'object') {
    return 'Request failed.';
  }

  const body = errorBody as { message?: unknown; errors?: unknown };
  if (typeof body.message === 'string') {
    if (Array.isArray(body.errors) && body.errors.every((item) => typeof item === 'string')) {
      return `${body.message} ${body.errors.join(' ')}`.trim();
    }
    return body.message;
  }

  return 'Request failed.';
}

export async function getReports(): Promise<WaterLeakReport[]> {
  const response = await fetch(`${getApiBaseUrl()}/leak-reports`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load reports (${response.status}).`);
  }

  const data = (await response.json()) as WaterLeakReport[];
  return [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function submitReport(input: CreateReportInput): Promise<WaterLeakReport> {
  const response = await fetch(`${getApiBaseUrl()}/leak-reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch {
      // ignore non-JSON error response
    }
    throw new Error(normalizeErrorMessage(errorBody) || `Failed to submit report (${response.status}).`);
  }

  return (await response.json()) as WaterLeakReport;
}
