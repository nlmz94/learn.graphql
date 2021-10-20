import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../graphql/schema/index.js';
import resolvers from '../graphql/resolver/index.js';
import pkg from '@prisma/client';
import cors from 'cors';

export async function launch(port = 42069) {
	const app = express();
	const { PrismaClient } = pkg;
	const prisma = new PrismaClient();
	const corsOpts = { origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] };
	const server = new ApolloServer({
		typeDefs,
		resolvers,
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
