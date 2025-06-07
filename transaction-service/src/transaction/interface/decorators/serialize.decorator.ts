import { UseInterceptors } from '@nestjs/common';
import SerializerInterceptor from '../interceptors/serializer.interceptor';

interface ClassConstructor {
  new (...args: any);
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(SerializerInterceptor(dto));
}
