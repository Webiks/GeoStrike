import { makeExecutableSchema } from 'graphql-tools';
import { map } from 'lodash';
import sourceResolvers from './resolvers';
import types from './types';

const typeDefs = map(types, type => type.schema);
const resolvers = Object.keys(sourceResolvers)
  .map(key => sourceResolvers[key])
  .reduce((prev, item) => ({ ...prev, ...item }), {});

export const schema: any = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
