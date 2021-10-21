import userResolver from './user.js';
import postResolver from './post.js';
import { GraphQLDateTime } from 'graphql-iso-date';

const customScalarResolver = { Date: GraphQLDateTime };
export default [customScalarResolver, userResolver, postResolver];
