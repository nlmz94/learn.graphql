import { gql } from 'apollo-server-express';
export default gql`
	type Post {
		id: ID!
		body: String!
	}
	extend type Query {
		getAllPosts: [Post!]!
		getPost(id: Int!): [Post!]!
	}
	extend type Mutation {
		addPost(body: String!): Post!
		updatePost(id: ID!, body: String): Post!
		deletePost(id: ID!): Post!
	}
`;
