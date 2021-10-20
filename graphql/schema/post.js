import { gql } from 'apollo-server-express';

export default gql`
	type Post {
		id: ID!
		author: 	User!
		content: 	String!
		createdat: 	Date!
		updatedat: 	Date
		userid:    	Int!
  		comments:  	[Post]   
  		parent:     Post
  		postid:    	Int
	}
	extend type Query {
		posts: [Post!]!
		post(id: Int!): Post!
		comments: [Post!]!
		comment(id: Int!): Post!
	}
	extend type Mutation {
		addPost(content: String!): Post!
		updatePost(id: ID!, content: String): Post!
		deletePost(id: ID!): Post!
		addComment(postid: ID!, content: String): Post!
		updateComment(id: ID!, content: String): Post!
		deleteComment(id: ID!): Post!
	}
`;