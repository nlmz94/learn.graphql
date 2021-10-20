import { gql } from 'apollo-server-express';
import userSchema from './user.js';
import postSchema from './post.js';

const baseSchema = gql`
	scalar Date
	type User {
		_: Boolean
	}

	type Post {
		_: Boolean
	}

	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`;

export default [baseSchema, userSchema, postSchema];
