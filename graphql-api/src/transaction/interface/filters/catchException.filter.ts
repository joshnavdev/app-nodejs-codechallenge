/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Catch, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { GraphQLError } from 'graphql/error';
import { z } from 'zod';

interface MicroserviceException {
  error: {
    type: string;
    statusCode: number;
    message: string;
  };
}

@Catch()
export class CatchExceptionFilter implements GqlExceptionFilter {
  private isMicroserviceException(exception: unknown): exception is MicroserviceException {
    const microserviceExceptionSchema = z.object({
      error: z.object({
        statusCode: z.number(),
        message: z.string(),
        type: z.string(),
      }),
    });

    return microserviceExceptionSchema.safeParse(exception).success;
  }

  private hasMessage(exception: unknown): exception is { message: string } {
    const messageSchema = z.object({
      message: z.string(),
    });

    return messageSchema.safeParse(exception).success;
  }

  catch(exception: unknown) {
    if (exception instanceof GraphQLException) {
      return exception;
    }

    if (this.isMicroserviceException(exception)) {
      const {
        error: { message, statusCode },
      } = exception;

      return new GraphQLError(message, {
        extensions: {
          statusCode: statusCode,
          message: message,
          code: HttpStatus[statusCode] || HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
        },
      });
    }

    return new GraphQLError('Internal server error', {
      extensions: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.hasMessage(exception) ? exception.message : String(exception),
        code: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      },
    });
  }
}
