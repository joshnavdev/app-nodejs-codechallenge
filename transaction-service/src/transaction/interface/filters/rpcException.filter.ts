import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcExceptionFilter extends BaseRpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    this.logger.error(exception);
    return super.catch(exception, host);
  }
}
