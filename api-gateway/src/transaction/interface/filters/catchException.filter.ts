import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { HttpExceptionFilter } from './httpException.filter';

@Catch()
export default class CatchExceptionFilter implements ExceptionFilter {
  private readonly delegate = new HttpExceptionFilter();

  catch(exception: unknown, host: ArgumentsHost) {
    let httpException: HttpException;

    if (exception instanceof HttpException) {
      httpException = exception;
    } else if (exception instanceof Error) {
      httpException = new InternalServerErrorException(exception.message);
      httpException.stack = exception.stack;
    } else {
      httpException = new InternalServerErrorException('An unexpected error occurred');
    }

    this.delegate.catch(httpException, host);
  }
}
