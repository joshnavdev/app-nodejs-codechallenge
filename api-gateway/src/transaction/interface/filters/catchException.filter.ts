/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { HttpExceptionFilter } from './httpException.filter';

interface MicroserviceException {
  type: string;
  statusCode: number;
  message: string;
}

@Catch()
export default class CatchExceptionFilter implements ExceptionFilter {
  private readonly delegate = new HttpExceptionFilter();

  private isMicroserviceException(exception: unknown): exception is MicroserviceException {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'type' in exception &&
      typeof (exception as any).type === 'string' &&
      'statusCode' in exception &&
      typeof (exception as any).statusCode === 'number' &&
      'message' in exception &&
      typeof (exception as any).message === 'string'
    );
  }

  catch(exception: unknown, host: ArgumentsHost) {
    let httpException: HttpException;

    if (exception instanceof HttpException) {
      httpException = exception;
    } else if (this.isMicroserviceException(exception)) {
      httpException = new HttpException(exception.message, exception.statusCode);
    } else if (exception instanceof Error) {
      httpException = new InternalServerErrorException(exception.message);
      httpException.stack = exception.stack;
    } else {
      httpException = new InternalServerErrorException('An unexpected error occurred');
    }

    this.delegate.catch(httpException, host);
  }
}
