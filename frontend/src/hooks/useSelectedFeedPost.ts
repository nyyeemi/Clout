import {useDispatch, useSelector} from 'react-redux';

import {setSelectedPost} from '../redux/slices/selectedPostSlice';
import {RootState} from '../redux/store/store';

import {PostType} from '../types/types';

export const useSelectedFeedPost = () => {
  const selectedPost = useSelector(
    (state: RootState) => state.selectedPost.selectedPost,
  );
  const dispatch = useDispatch();

  return {
    selectedPost,
    setSelectedPost: (post: PostType | null) => dispatch(setSelectedPost(post)),
  };
};
