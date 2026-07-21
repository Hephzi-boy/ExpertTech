import { communityPosts } from '../data/mockData';
import { type FeedComment, type FeedPost } from '../types/community';

const API_BASE_URL = process.env.EXPO_PUBLIC_BASE_URL?.trim().replace(/\/+$/, '');
const DEFAULT_FEED_VIEWER_USER_ID = Number(process.env.EXPO_PUBLIC_FEED_USER_ID ?? '3');
const REQUEST_TIMEOUT_MS = 15000;

type ApiUserSummary = {
  display_name: string;
  id: number;
  username: string;
};

type ApiPostResponse = {
  author: ApiUserSummary;
  comments_count: number;
  content: string;
  created_at: string;
  id: number;
  image_url: string | null;
  likes_count: number;
};

type ApiCommentResponse = {
  author: ApiUserSummary;
  content: string;
  created_at: string;
  id: number;
  post_id: number;
};

type PaginatedPostsResponse = {
  items: ApiPostResponse[];
  limit: number;
  next_offset: number | null;
  offset: number;
  total: number;
};

type PaginatedCommentsResponse = {
  items: ApiCommentResponse[];
  limit: number;
  next_offset: number | null;
  offset: number;
  total: number;
};

type MutationResponse = {
  message: string;
};

type ValidationErrorPayload = {
  detail?: Array<{
    loc?: Array<number | string>;
    msg?: string;
  }> | string;
  message?: string;
};

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('Missing EXPO_PUBLIC_BASE_URL in the project environment.');
  }

  return API_BASE_URL;
}

function getFeedViewerUserId() {
  if (Number.isFinite(DEFAULT_FEED_VIEWER_USER_ID) && DEFAULT_FEED_VIEWER_USER_ID > 0) {
    return DEFAULT_FEED_VIEWER_USER_ID;
  }

  return 3;
}

function extractErrorMessage(payload: unknown) {
  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload.trim();
  }

  if (payload && typeof payload === 'object') {
    const maybeValidationError = payload as ValidationErrorPayload;

    if (typeof maybeValidationError.message === 'string' && maybeValidationError.message.trim().length > 0) {
      return maybeValidationError.message.trim();
    }

    if (typeof maybeValidationError.detail === 'string' && maybeValidationError.detail.trim().length > 0) {
      return maybeValidationError.detail.trim();
    }

    if (Array.isArray(maybeValidationError.detail) && maybeValidationError.detail.length > 0) {
      return maybeValidationError.detail
        .map((item) => item.msg?.trim())
        .filter((message): message is string => Boolean(message))
        .join(', ');
    }
  }

  return null;
}

async function request<T>(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      signal: controller.signal,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(extractErrorMessage(payload) ?? `Request failed with status ${response.status}.`);
    }

    return payload as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The server took too long to respond. Please try again.');
    }

    throw error instanceof Error ? error : new Error('Unexpected network error.');
  } finally {
    clearTimeout(timeoutId);
  }
}

function mapApiCommentToFeedComment(comment: ApiCommentResponse): FeedComment {
  return {
    author: {
      displayName: comment.author.display_name,
      id: comment.author.id,
      username: comment.author.username,
    },
    content: comment.content,
    createdAt: comment.created_at,
    id: comment.id,
    postId: comment.post_id,
  };
}

function mapApiPostToFeedPost(post: ApiPostResponse, index: number): FeedPost {
  const fallbackPost = communityPosts[index % communityPosts.length];

  return {
    ...fallbackPost,
    author: post.author.display_name,
    authorId: post.author.id,
    authorUsername: post.author.username,
    category: post.image_url ? 'Property' : fallbackPost.category,
    comments: post.comments_count,
    id: `remote-post-${post.id}`,
    imageAssetVariant: undefined,
    imageUri: post.image_url ?? undefined,
    mediaAspectRatio: undefined,
    isLiked: false,
    isLikePending: false,
    likes: post.likes_count,
    likedByAvatars: [],
    likedByHandle: '',
    mediaDotCount: undefined,
    mediaKind: post.image_url ? 'image' : undefined,
    message: post.content,
    otherLikes: 0,
    postedAt: formatRelativeTime(post.created_at),
    remoteId: post.id,
    saves: fallbackPost.saves,
    statusLabel: post.image_url ? fallbackPost.statusLabel : undefined,
    statusTone: post.image_url ? fallbackPost.statusTone : undefined,
  };
}

export function formatRelativeTime(value: string) {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 'Just now';
  }

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return 'Just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(timestamp));
}

export function getDefaultFeedPosts(): FeedPost[] {
  return communityPosts.map((post) => ({
    ...post,
    isLiked: false,
    isLikePending: false,
  }));
}

export async function fetchFeedPosts(limit = 10, offset = 0) {
  const response = await request<PaginatedPostsResponse>(`/posts?limit=${limit}&offset=${offset}`);

  return response.items.map(mapApiPostToFeedPost);
}

export async function fetchPostComments(postId: number, limit = 20, offset = 0) {
  const response = await request<PaginatedCommentsResponse>(
    `/posts/${postId}/comments?limit=${limit}&offset=${offset}`,
  );

  return response.items.map(mapApiCommentToFeedComment);
}

export async function createPostComment(postId: number, content: string) {
  const response = await request<ApiCommentResponse>(`/posts/${postId}/comments`, {
    body: JSON.stringify({
      content,
      user_id: getFeedViewerUserId(),
    }),
    method: 'POST',
  });

  return mapApiCommentToFeedComment(response);
}

export async function likePost(postId: number) {
  return request<MutationResponse>(`/posts/${postId}/like`, {
    body: JSON.stringify({
      user_id: getFeedViewerUserId(),
    }),
    method: 'POST',
  });
}
