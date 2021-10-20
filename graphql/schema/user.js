import { gql } from 'apollo-server-express';
export default gql`
	type User {
		id: ID
		email: String!
		password:  String!
  		firstname: String!
  		lastname:  String!
  		Post:      [Post]
	}
	extend type Query {
		users: [User!]!
		user(id: Int!): User!
	}
	extend type Mutation {
		register(email: String!, password: String!, firstname: String!, lastname: String!): User!
	}
`;
