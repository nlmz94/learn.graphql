export default {
	Query: {
		posts: async (_parent, _args, { dataSources }) => {
			return await dataSources.prisma.post.findMany({include: {author: true}});
		},
		post: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.post.findUnique({where: {id: id}});
		},
		comments: async (_parent, _args, { dataSources }) => {
			return await dataSources.prisma.post.findMany();
		},
		comment: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.post.findUnique({where: {id: id}});
		}
	},
	Mutation: {
		addPost: async (_parent, {content}, { dataSources }) => {
			return await dataSources.prisma.post.create({data: { content: content, userid: 2, createdat: new Date()}});
		},
		updatePost: async (_parent, {id, content}, { dataSources }) => {
			return await dataSources.prisma.post.update({where: {id: id}, data: { content: content, userid: 2, createdat: new Date()}});
		},
		deletePost: async (_parent, {id}, { dataSources }) => {
			return await dataSources.prisma.post.delete({where: {id: id}});
		}
	}
};
