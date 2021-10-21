import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { ForbiddenError } from 'apollo-server';

const adminRole = 'admin';
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
		posts: async (_parent, _args, { dataSources }) => {
			return dataSources.prisma.post.findMany({
				include: { author: true, comments: true },
			});
		},
		post: async (_parent, { id }, { dataSources }) => {
			return dataSources.prisma.post.findUnique({
				where: { id: id },
				include: { author: true, comments: true },
			});
		},
		comments: async (_parent, { postid }, { dataSources }) => {
			return dataSources.prisma.post.findMany({
				where: { postid: postid },
				include: { author: true, parent: true, comments: true },
			});
		},
		comment: async (_parent, { id }, { dataSources }) => {
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
		//update post and update comment are identical
		updatePost: async (_parent, { id, content }, { req, dataSources }) => {
			const intId = +id;
			const originalPost = await dataSources.prisma.post.findUnique({ where: { id: intId } });
			if (!user(req).role || (user(req).role !== adminRole && originalPost.userid === parseInt(user(req).id)))
				return new ForbiddenError('Not Authorized');
			return dataSources.prisma.post.update({
				where: { id: intId },
				data: { content: content, updatedat: new Date() },
			});
		},
		deletePost: async (_parent, { id }, { req, dataSources }) => {
			const intId = +id;
			const originalPost = await dataSources.prisma.post.findUnique({ where: { id: intId } });
			if (!user(req).role || (user(req).role !== adminRole && originalPost.userid === parseInt(user(req).id)))
				return new ForbiddenError('Not Authorized');
			return dataSources.prisma.post.delete({ where: { id: intId } });
		},
		addComment: async (_parent, { postid, content }, { req, dataSources }) => {
			const intPostId = +postid;
			return dataSources.prisma.post.create({
				data: { content: content, userid: user(req).id, createdat: new Date(), postid: intPostId },
			});
		},
		deleteComment: async (_parent, { id }, { req, dataSources }) => {
			const intId = +id;
			const originalComment = await dataSources.prisma.post.findUnique({ where: { id: intId } });
			if (!user(req).role || (user(req).role !== adminRole && originalComment.userid === parseInt(user(req).id)))
				return new ForbiddenError('Not Authorized');
			return dataSources.prisma.post.delete({
				where: { id: intId },
			});
		},
	},
};
