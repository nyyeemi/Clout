import {CustomUser} from '../Vote/mock';

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

const IMAGELIST_LENGTH = 10;

export const mockUser: CustomUser = {
  id: 0,
  username: 'Johtaja1',
  email: 'johtaja@johtaja.johtaja',
  bio: 'L5 Software Engineer @Clout',
  num_followers: 420,
  num_following: 0,
  profile_picture_url:
    'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
  num_posts: IMAGELIST_LENGTH,
};

export const mockUserList: CustomUser[] = [
  {
    id: 0,
    username: 'Johtaja1',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 420,
    num_following: 0,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 1,
    username: 'Johtaja2',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 320,
    num_following: 55,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 2,
    username: 'Johtaja3',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 4230,
    num_following: 122,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 3,
    username: 'Johtaja4',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 20,
    num_following: 1,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 4,
    username: 'Johtaja5',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 410,
    num_following: 110,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 5,
    username: 'Johtaja6',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 770,
    num_following: 20,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 6,
    username: 'Johtaja7',
    email: 'johtaja@johtajasdasdasdaa.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 7270,
    num_following: 2011,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
];

export const baseImageMock: CustomImage = {
  id: 1,
  user: mockUserList[0],
  image_url:
    'https://i.guim.co.uk/img/media/b1c1caa029d6f186f9d6b3fabb7f02517eb9c33b/0_58_2528_1519/master/2528.jpg?width=1200&quality=85&auto=format&fit=max&s=a80cc1503df75e0c9d04b78ed226229e',
  thumbnail_url: null,
  caption:
    'Amazing SPONGEBOB picture. Took this one when i was drinking white ultra monster. PS. collaboration with monster would be great wink wink.',
  created_at: '01122024',
  is_visible: true,
  num_likes: 4,
  num_comments: 3,
};

export const mockImageList: CustomImage[] = [
  baseImageMock,
  {
    ...baseImageMock,
    id: 2,
    image_url:
      'https://static.wikia.nocookie.net/louser/images/1/15/Eheheh.png/revision/latest?cb=20130218225046',
    num_likes: 2,
    //user: mockUserList[1],
  },
  {
    ...baseImageMock,
    id: 3,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDMXtoTWSqW0jfC1eIqJUEak0uNt_GOvYq8w&s',
    num_likes: 1,
    user: mockUserList[2],
  },
  {
    ...baseImageMock,
    id: 4,
    image_url: 'https://pbs.twimg.com/media/F9xhN65WQAATLoU.jpg',
    num_likes: 0,
    user: mockUserList[3],
  },
  {
    ...baseImageMock,
    id: 5,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGntJMFAROF9MNVt6ippW2IfBwlxtBkS7jg&s',
    num_likes: 0,
    user: mockUserList[4],
  },
  {
    ...baseImageMock,
    id: 6,
    image_url:
      'https://ultimateguard.com/media/8a/19/c9/1728480928/SQR-050001-277-011-00_dark_0001.jpg?1728480928',
    num_likes: 0,
    //user: mockUserList[5],
  },
  {
    ...baseImageMock,
    id: 7,
    image_url:
      'https://spinnaker-watches.com/cdn/shop/articles/pizza_delivery_106.jpg?v=1721710885',
    num_likes: 0,
    //user: mockUserList[6],
  },
];

export const mockLikes = [
  {
    id: 1,
    user_id: 0,
    image_id: 1,
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    image_id: 1,
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 3,
    image_id: 1,
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 2,
    image_id: 2,
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 1,
    image_id: 3,
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 2,
    image_id: 1,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 3,
    image_id: 2,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 0,
    image_id: 3,
    created_at: '2024-03-07T12:25:00Z',
  },
];

export const mockComments = [
  {
    id: 1,
    user_id: 0,
    image_id: 1,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    image_id: 1,
    comment: 'HIENO KUVA joo',
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 3,
    image_id: 1,
    comment: 'HIENO KUVA hei hoi hai',
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 2,
    image_id: 2,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 1,
    image_id: 3,
    comment: 'ONPA HIenooo',
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 2,
    image_id: 1,
    comment: 'katos katos',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 3,
    image_id: 2,
    comment: 'terve mikä kuva',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 0,
    image_id: 1,
    comment: 'HIENO KUVA hahaha',
    created_at: '2024-03-07T12:00:00Z',
  },
];
