export default {
	Query: {
		users: async (_parent, _args, { dataSources }) => {
			return await dataSources.prisma.user.findMany({include: {author: true}});
		},
		user: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.user.findUnique({where: {id: id}, include: {posts: true}});
		}
	},
	Mutation: {
		register: async (_parent, {email, password, firstname, lastname}, { dataSources }) => {
			return await dataSources.prisma.user.create({data: { email: email, password: password, firstname: firstname, lastname: lastname}});
		}
	}
};
