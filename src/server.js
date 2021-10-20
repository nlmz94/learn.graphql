import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import typeDefs from '../graphql/schema/index.js';
import resolvers from '../graphql/resolver/index.js';
import pkg from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

export async function launch(port = 42068) {
	const app = express();
	const { PrismaClient } = pkg;
	const prisma = new PrismaClient();
	const corsOpts = { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] };
	const user = (req) => {
		if (req.get('Authorization')) {
			return jwt.verify(req.get('Authorization'), process.env.JWT_SECRET);
		}
	};
	const server = new ApolloServer({
		introspection: true,
		typeDefs,
		resolvers,
		context: ({ req }) => {
			return { user: user(req) };
		},
		dataSources: () => {
			return { prisma: prisma };
		},
	});
	await server.start();
	server.applyMiddleware({ app });
	app.use(cors(corsOpts));
	await prisma
		.$connect()
		.then(() => {
			app.listen(port, () => console.log(`API started at: http://localhost:${port}${server.graphqlPath}`));
		})
		.catch((err) => {
			console.error(err);
		});
}
