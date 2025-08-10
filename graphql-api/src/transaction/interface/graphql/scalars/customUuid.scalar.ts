import { GraphQLScalarType } from 'graphql/type';
import { Kind } from 'graphql/language';

const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validate(uuid: unknown): string | never {
  if (typeof uuid !== 'string' || !regex.test(uuid)) {
    throw new Error('invalid uuid');
  }
  return uuid;
}

export const CustomUuidScalar = new GraphQLScalarType({
  name: 'UUID',
  description: 'Custom UUID scalar type',
  serialize: validate,
  parseValue: validate,
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new Error('UUID must be a string');
    }
    return validate(ast.value);
  },
});
