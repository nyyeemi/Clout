//import {AxiosResponse} from 'axios';
import instance, {API_URL} from '../utils';
import {mockComments} from '../../mock/mock';

type CommentType = {
  id: number;
  user_id: number;
  image_id: number;
  comment: string;
  created_at?: string;
};

/*
export const getAllComments = async (): Promise<CommentType[]> => {
  const response = await instance.get<CommentType[]>(`${API_URL}/comments/`);
  return response.data;
};
*/

//mock
export const getAllComments = async () => {
  return mockComments;
};

export const getCommentById = async (id: number): Promise<CommentType> => {
  const response = await instance.get<CommentType>(
    `${API_URL}/comments/${id}/`,
  );
  return response.data;
};

/*
export const postComment = async (newComment: {
  image_id: number;
  comment: string;
}): Promise<CommentType> => {
  const response = await instance.post<CommentType>(
    `${API_URL}/comments/`,
    newComment,
  );
  return response.data;
};
*/

//MOCK
export const postComment = async (newComment: {
  image_id: number;
  comment: string;
}) => {
  const response = {
    id: Date.now(),
    user_id: 0,
    image_id: newComment.image_id,
    comment: newComment.comment,
    created_at: new Date().toISOString(),
  };
  return response;
};

/*
export const deleteComment = async (
  comment_id: number,
): Promise<AxiosResponse> => {
  const response = await instance.delete(`${API_URL}/comments/${comment_id}`);
  return response.data;
};
*/

//MOCK
export const deleteComment = async (comment_id: number) => {
  console.log('Deleted comment', comment_id);
};
