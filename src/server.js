import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import typeDefs from '../graphql/schema/index.js';
import resolvers from '../graphql/resolver/index.js';
import pkg from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from 'apollo-server';

export async function launch(port = 42069) {
	const app = express();
	const { PrismaClient } = pkg;
	const prisma = new PrismaClient();
	const corsOpts = { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] };
/*	const getMe = async (req) => {
		const token = req.headers['x-token'];
		if (token) {
			try {
				return jwt.verify(token, env('JWT_SECRET'));
			} catch (e) {
				throw new AuthenticationError('Your session expired. Sign in again.');
			}
		} else {
			return new ForbiddenError('You are not authenticated');
		}
	};*/
	const server = new ApolloServer({
		introspection: true,
		typeDefs,
		resolvers,
		dataSources: () => {
			return { prisma: prisma };
		},
		/*context: async ({ req }) => {
			return await getMe(req);
		},*/
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
