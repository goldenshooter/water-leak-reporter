import { NextResponse } from 'next/server';

function getBackendApiBaseUrl(): string {
  return process.env.BACKEND_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7071/api';
}

export async function GET(): Promise<NextResponse> {
  try {
    const response = await fetch(`${getBackendApiBaseUrl()}/leak-reports`, {
      method: 'GET',
      cache: 'no-store',
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Backend API unavailable.' }, { status: 502 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const response = await fetch(`${getBackendApiBaseUrl()}/leak-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: await request.text(),
    });

    const text = await response.text();
    return new NextResponse(text, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Backend API unavailable.' }, { status: 502 });
  }
}
