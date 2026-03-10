import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { leakReportService } from './shared/container.js';

export async function getLeakReports(
  _request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const reports = await leakReportService.listReports();
    return {
      status: 200,
      jsonBody: reports,
    };
  } catch (error) {
    context.error('Unexpected error fetching leak reports', error);
    return {
      status: 500,
      jsonBody: {
        message: 'Internal server error.',
      },
    };
  }
}

app.http('getLeakReports', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'leak-reports',
  handler: getLeakReports,
});
