import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { ValidationError } from '../models/errors.js';
import { leakReportService } from './shared/container.js';
import { validateCreateLeakReportPayload } from '../utils/validation.js';

export async function postLeakReports(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const body = await request.json();
    const input = validateCreateLeakReportPayload(body);
    const created = await leakReportService.createReport(input);

    return {
      status: 201,
      jsonBody: created,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        status: 400,
        jsonBody: {
          message: error.message,
          errors: error.details,
        },
      };
    }

    context.error('Unexpected error creating leak report', error);
    return {
      status: 500,
      jsonBody: {
        message: 'Internal server error.',
      },
    };
  }
}

app.http('postLeakReports', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'leak-reports',
  handler: postLeakReports,
});
