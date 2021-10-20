import { gql } from 'apollo-server-express';
export default gql`
	type Token {
		id: ID
		token: String!
	}
	type User {
		id: ID
		email: String!
		password: String!
		firstname: String!
		lastname: String!
		posts: [Post]
		role: String!
	}
	extend type Query {
		users: [User]
		user(id: Int!): User
	}
	extend type Mutation {
		register(email: String!, password: String!, firstname: String!, lastname: String!): User
		login(email: String!, password: String!): Token
	}
`;
