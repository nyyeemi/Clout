export type LikeType = {
  id: number;
  owner: CustomUser;
  image_id: number;
  created_at: string;
};

export type CustomUser = {
  id: number;
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
  id: number;
  owner: CustomUser;
  owner_id: string;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
  num_likes: number | null;
  num_comments: number | null;
};

export type CommentType = {
  id: number;
  owner: CustomUser;
  owner_id: number;
  post_id: number;
  content: string;
  created_at: string;
};

export type FollowType = {
  id: number;
  user_id1: number;
  user_id2: number;
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

export type PostTypeWithCount = {
  data: PostType[];
  count: number;
};

export type CommentTypeWithCount = {
  data: CommentType[];
  count: number;
};

export type GetCommentsRequestType = {
  post_id: number;
  last_comment_created_at: string;
  created_at: string;
};

export type CommentRequestType = {
  content: string;
  post_id: number;
};

export type CommentDeleteRequestType = {
  post_id: number;
  comment_id: number;
};

export type LikeTypeWithCount = {
  data: LikeType[];
  count: number;
};

export type GetLikesRequestType = {
  post_id: number;
  last_like_created_at: string;
};

export type ProfileType = CustomUser & {
  num_followers: number;
  num_following: number;
};

export type ProfilePostsType = {
  data: PostType[];
  count: number;
};

export type ProfileFollowerType = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  profile_picture_url: string;
};

export type ProfileFollowersType = {
  data: ProfileFollowerType[];
  count: number;
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
