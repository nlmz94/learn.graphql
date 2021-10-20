export default {
	Query: {
		posts: async (_parent, _args, { dataSources }) => {
			return await dataSources.prisma.post.findMany({
				include: { author: true, comments: true },
			});
		},
		post: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.post.findUnique({
				where: { id: id },
				include: { author: true, comments: true },
			});
		},
		comments: async (_parent, { postid }, { dataSources }) => {
			return await dataSources.prisma.post.findMany({
				where: { postid: postid },
				include: { author: true, parent: true, comments: true },
			});
		},
		comment: async (_parent, { id }, { dataSources }) => {
			return await dataSources.prisma.post.findUnique({
				where: { id: id },
				include: { author: true, parent: true, comments: true },
			});
		},
	},
	Mutation: {
		addPost: async (_parent, { content }, { dataSources }) => {
			return await dataSources.prisma.post.create({
				data: { content: content, userid: 2, createdat: new Date() },
			});
		},
		updatePost: async (_parent, { id, content }, { dataSources }) => {
			const intId = +id;
			return await dataSources.prisma.post.update({
				where: { id: intId },
				data: { content: content, updatedat: new Date() },
			});
		},
		deletePost: async (_parent, { id }, { dataSources }) => {
			const intId = +id;
			return await dataSources.prisma.post.delete({ where: { id: intId } });
		},
		addComment: async (_parent, { postid, content }, { dataSources }) => {
			const intPostId = +postid;
			return await dataSources.prisma.post.create({
				data: { content: content, userid: 2, createdat: new Date(), postid: intPostId },
			});
		},
		updateComment: async (_parent, { id, content }, { dataSources }) => {
			const intId = +id;
			return await dataSources.prisma.post.update({
				where: { id: intId },
				data: { content: content, updatedat: new Date() },
			});
		},
		deleteComment: async (_parent, { id }, { dataSources }) => {
			const intId = +id;
			return await dataSources.prisma.post.delete({
				where: { id: intId },
			});
		},
	},
};
