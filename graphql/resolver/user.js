import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';

const createToken = async (user, secret, expiresIn) => {
	const { id, email, role } = user;
	return jwt.sign({ id, email, role }, secret, { expiresIn });
};

export default {
	Query: {
		users: async (_parent, _args, { dataSources }) => {
			return await dataSources.prisma.user.findMany({ include: { posts: true } });
		},
		user: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.user.findUnique({ where: { id: id }, include: { posts: true } });
		},
	},
	Mutation: {
		register: async (_parent, { email, password, firstname, lastname }, { dataSources }) => {
			let result = 'o/';
			await bcrypt.hash(password, bcrypt.genSaltSync(10), null, async function encryptedPassword(err, hash) {
				if (err) {
					console.error(err);
					result = err;
				} else {
					result = hash;
					await dataSources.prisma.user.create({
						data: {
							email: email,
							password: hash,
							firstname: firstname,
							lastname: lastname,
						},
					});
				}
			});
			return result;
		},
		login: async (_parent, { email, password }, { dataSources }) => {
			let validPassword;
			const user = await dataSources.prisma.user.findUnique({ where: { email: email } });
			bcrypt.compare(password, user.password, function compareResult(err, result) {
				if (err) {
					console.error(err);
				} else {
					validPassword = result;
				}
			});
			if (!user) {
				throw new UserInputError('No user found with this login credentials.');
			} else if (!validPassword) {
				throw new AuthenticationError('Invalid password.');
			} else {
				const token = createToken(user, env('JWT_SECRET'), '30m');
				return await dataSources.prisma.token.create({ data: { token: token } });
			}
		},
	},
};
