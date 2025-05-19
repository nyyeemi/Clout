export type LikeType = {
  id: string;
  owner: CustomUser;
  image_id: string;
  created_at: string;
};

export type CustomUser = {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string;
  num_followers: number;
  num_following: number;
  profile_picture_url: string;
  num_posts: number;
};

export type PostType = {
  id: string;
  owner: CustomUser;
  owner_id: string;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
  num_likes: number;
  num_comments: number;
  is_liked_by_current_user: boolean;
};

export type CommentType = {
  id: string;
  owner: CustomUser;
  owner_id: string;
  post_id: string;
  content: string;
  created_at: string;
};

export type FollowType = {
  id: string;
  user_id1: string;
  user_id2: string;
};

//
//REDUX TYPES
//
export type PostRequestType = {
  image_url: string;
  thumbnail_url: string;
  caption: string;
  is_visible: boolean;
};

export type GetPostRequestType = {
  last_post_created_at?: string;
};

export type PostTypeWithCount = {
  data: PostType[];
  count: number;
};

export type CommentTypeWithCount = {
  data: CommentType[];
  count: number;
};

export type GetCommentsRequestType = {
  post_id: string;
  last_comment_created_at?: string;
  created_at?: string;
};

export type CommentRequestType = {
  content: string;
  post_id: string;
};

export type CommentDeleteRequestType = {
  post_id: string;
  comment_id: string;
};

export type LikeTypeWithCount = {
  data: LikeType[];
  count: number;
};

export type GetLikesRequestType = {
  post_id: string;
  last_like_created_at?: string;
};

export type ProfileType = CustomUser & {
  num_followers: number;
  num_following: number;
  is_followed_by_current_user: boolean;
};

export type ProfilePostsType = {
  data: PostType[];
  count: number;
};

export type ProfileFollowerType = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  profile_picture_url: string;
  is_followed_by_current_user: boolean;
};

export type ProfileFollowersType = {
  data: ProfileFollowerType[];
  count: number;
};

export type Message = {
  message: string;
};

export type FollowMutationPayload = {
  user_id: string;
  username: string;
};
/*{
"email": "user@example.com",
      "username": "string",
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "first_name": "string",
      "last_name": "string",
      "bio": "string",
      "profile_picture_url": "string"
}*/
