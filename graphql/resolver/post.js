export default {
	Query: {
		getAllPosts: async (parent, args, { dataSources }) => {
			return await dataSources.prisma.posts.findMany();
		},
		getPost: async (parent, { id }, { dataSources }) => {
			return await dataSources.prisma.posts.findById(id);
		},
	},
};
