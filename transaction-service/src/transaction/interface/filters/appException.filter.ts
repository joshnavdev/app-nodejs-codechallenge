import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppError } from '../../domain/errors/app.error';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: AppError) {
    const { message, statusCode, type } = exception;
    this.logger.error(exception);
    throw new RpcException({ message, statusCode, type });
  }
}
