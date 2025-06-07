import { ClassSerializerInterceptor, PlainLiteralObject, Type } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

type ResponseType = PlainLiteralObject | PlainLiteralObject[];

export default function SerializerInterceptor(classToIntercept: Type): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private plainToClass(response: PlainLiteralObject) {
      return plainToInstance<Type, object>(classToIntercept, response);
    }

    private prepareResponse(response: ResponseType) {
      if (Array.isArray(response)) {
        return response.map((r: PlainLiteralObject) => this.plainToClass(r));
      }

      return this.plainToClass(response);
    }

    serialize(response: ResponseType, options: ClassTransformOptions): PlainLiteralObject | Array<PlainLiteralObject> {
      return super.serialize(this.prepareResponse(response), options);
    }
  };
}
