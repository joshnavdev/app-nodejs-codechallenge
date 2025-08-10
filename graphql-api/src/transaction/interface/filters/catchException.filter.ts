/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Catch, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { GraphQLError } from 'graphql/error';

interface MicroserviceException {
  type: string;
  statusCode: number;
  message: string;
}

@Catch()
export class CatchExceptionFilter implements GqlExceptionFilter {
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

  catch(exception: unknown) {
    if (exception instanceof GraphQLException) {
      return exception;
    }

    if (this.isMicroserviceException(exception)) {
      return new GraphQLError(exception.message, {
        extensions: {
          statusCode: exception.statusCode,
          message: exception.message,
          code: HttpStatus[exception.statusCode] || HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
        },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception instanceof Error ? exception.message : String(exception),
        code: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      },
    });
  }
}
