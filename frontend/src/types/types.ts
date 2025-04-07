export type LikeType = {
  id: number;
  user_id: number;
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

export type CustomImage = {
  id: number;
  user: CustomUser;
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
  user_id: number;
  image_id: number;
  comment: string;
  created_at: string;
};

export type FollowType = {
  id: number;
  user_id1: number;
  user_id2: number;
};
