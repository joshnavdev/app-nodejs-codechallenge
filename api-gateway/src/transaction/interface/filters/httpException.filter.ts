import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionBody {
  statusCode: number;
  message: string | string[];
  timestamp: string;
  error?: string;
  stack?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let bodyResponse: HttpExceptionBody;

    if (typeof errorResponse === 'string') {
      bodyResponse = {
        statusCode: status,
        message: errorResponse,
        timestamp: new Date().toISOString(),
        stack: exception.stack,
      };
    } else {
      bodyResponse = {
        ...errorResponse,
        timestamp: new Date().toISOString(),
        stack: exception.stack,
      } as HttpExceptionBody;
    }

    this.logger.error(exception.stack);

    response.status(status).json(bodyResponse);
  }
}
