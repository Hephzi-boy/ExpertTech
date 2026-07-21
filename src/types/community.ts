import { type CommunityPost } from '../data/mockData';

export type FeedPost = CommunityPost & {
  authorId?: number;
  authorUsername?: string;
  isLikePending?: boolean;
  isLiked?: boolean;
  remoteId?: number;
};

export type FeedComment = {
  author: {
    displayName: string;
    id: number;
    username: string;
  };
  content: string;
  createdAt: string;
  id: number;
  postId: number;
};
