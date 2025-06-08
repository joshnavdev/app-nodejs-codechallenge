import { RpcException } from '@nestjs/microservices';

export default class RpcBusinessException extends RpcException {
  constructor(message: string, statusCode: number) {
    super({ message, statusCode, type: 'BusinessException' });
  }
}
