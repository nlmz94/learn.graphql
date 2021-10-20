import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import typeDefs from '../graphql/schema/index.js';
import resolvers from '../graphql/resolver/index.js';
import pkg from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

export async function launch(port = 42069) {
	const app = express();
	const { PrismaClient } = pkg;
	const prisma = new PrismaClient();
	const corsOpts = { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] };
	const headers = (req) => {
		console.log(req.headers['Authorization']);
		console.log(req.headers['Bruh']);
	}

	/*const getMe = async (req) => {
		const token = req.headers['Authorization'];
		if (token) {
			try {
				return jwt.verify(token.substring(7), process.env.JWT_SECRET);
			} catch (e) {
				throw new AuthenticationError('Your session expired. Sign in again.');
			}
		} else {
			return 'bruh';
		}
	};*/
	const server = new ApolloServer({
		introspection: true,
		typeDefs,
		resolvers,
		dataSources: () => {
			return { prisma: prisma };
		},
		context: async ({ req }) => {await headers(req);},
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
