import userResolver from './user.js';
import postResolver from './post.js';
import pkg from 'graphql-iso-date';
const { GraphQLDateTime } = pkg;

const customScalarResolver = { Date: GraphQLDateTime };
export default [customScalarResolver, userResolver, postResolver];
