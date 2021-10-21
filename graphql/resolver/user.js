import { AuthenticationError, UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ForbiddenError } from 'apollo-server';

const adminRole = 'admin';
const createToken = async (user, secret, expiresIn) => {
	const { id, email, role } = user;
	return jwt.sign({ id, email, role }, secret, { expiresIn });
};
const user = (req) => {
	if (req.get('Authorization')) {
		try {
			return jwt.verify(req.get('Authorization'), process.env.JWT_SECRET);
		} catch (err) {
			throw new AuthenticationError('Your session expired. Sign in again.');
		}
	}
};

export default {
	Query: {
		users: async (_parent, _args, { req, dataSources }) => {
			if (user(req).role !== adminRole) return new ForbiddenError('Not Authorized');
			return dataSources.prisma.user.findMany({ include: { posts: true } });
		},
		user: async (_parent, { id }, { req, dataSources }) => {
			if (user(req).role !== adminRole) return new ForbiddenError('Not Authorized');
			return dataSources.prisma.user.findUnique({ where: { id: id }, include: { posts: true } });
		},
	},
	Mutation: {
		register: async (_parent, { email, password, firstname, lastname }, { dataSources }) => {
			const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));
			return dataSources.prisma.user.create({
				data: { email: email, password: hashedPassword, firstname: firstname, lastname: lastname },
			});
		},
		login: async (_parent, { email, password }, { dataSources }) => {
			const user = await dataSources.prisma.user.findUnique({ where: { email: email } });
			if (!user) {
				throw new UserInputError('No user found with this login credentials.');
			} else if (!bcrypt.compare(password, user.password)) {
				throw new AuthenticationError('Invalid password.');
			} else {
				const token = await createToken(user, process.env.JWT_SECRET, '10h');
				return dataSources.prisma.token.create({
					data: { token: token },
				});
			}
		},
	},
};
