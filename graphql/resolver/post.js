import jwt from 'jsonwebtoken';

const adminRole = 'admin';
const user = (req) => {
	if (req.get('Authorization')) {
		return jwt.verify(req.get('Authorization'), process.env.JWT_SECRET);
	}
};

export default {
	Query: {
		posts: async (_parent, _args, { req, dataSources }) => {
			if (user(req).role === adminRole) {
				return dataSources.prisma.post.findMany({
					include: { author: true, comments: true },
				});
			}
		},
		post: async (_parent, { id }, { req, dataSources }) => {
			return dataSources.prisma.post.findUnique({
				where: { id: id },
				include: { author: true, comments: true },
			});
		},
		comments: async (_parent, { postid }, { req, dataSources }) => {
			return dataSources.prisma.post.findMany({
				where: { postid: postid },
				include: { author: true, parent: true, comments: true },
			});
		},
		comment: async (_parent, { id }, { req, dataSources }) => {
			return dataSources.prisma.post.findUnique({
				where: { id: id },
				include: { author: true, parent: true, comments: true },
			});
		},
	},
	Mutation: {
		addPost: async (_parent, { content }, { req, dataSources }) => {
			return dataSources.prisma.post.create({
				data: { content: content, userid: user(req).id, createdat: new Date() },
			});
		},
		updatePost: async (_parent, { id, content }, { req, dataSources }) => {
			const intId = +id;
			const originalPost = await dataSources.prisma.post.findUnique({ where: { id: intId } });
			if (user(req).role === adminRole || originalPost.userid == parseInt(user(req).id)) {
				return dataSources.prisma.post.update({
					where: { id: intId },
					data: { content: content, updatedat: new Date() },
				});
			}
		},
		deletePost: async (_parent, { id }, { req, dataSources }) => {
			const intId = +id;
			return dataSources.prisma.post.delete({ where: { id: intId } });
		},
		addComment: async (_parent, { postid, content }, { req, dataSources }) => {
			const intPostId = +postid;
			return dataSources.prisma.post.create({
				data: { content: content, userid: user(req).id, createdat: new Date(), postid: intPostId },
			});
		},
		updateComment: async (_parent, { id, content }, { req, dataSources }) => {
			const intId = +id;
			return dataSources.prisma.post.update({
				where: { id: intId },
				data: { content: content, updatedat: new Date() },
			});
		},
		deleteComment: async (_parent, { id }, { req, dataSources }) => {
			const intId = +id;
			return dataSources.prisma.post.delete({
				where: { id: intId },
			});
		},
	},
};
