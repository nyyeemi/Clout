import {CustomImage, CustomUser} from '../types/types';

const IMAGELIST_LENGTH = 10;

export const mockUser: CustomUser = {
  id: 1,
  username: 'Johtaja1',
  first_name: 'Johtaja',
  last_name: 'McJohtaja',
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
    id: 1,
    username: 'Johtaja1',
    first_name: 'Johtaja',
    last_name: 'McJohtaja',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 420,
    num_following: 0,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 2,
    username: 'Johtaja2',
    first_name: 'Johto',
    last_name: 'Jaajotain',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 320,
    num_following: 55,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 3,
    username: 'Johtaja3',
    first_name: 'Johta',
    last_name: 'GigaChad',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 4230,
    num_following: 122,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 4,
    username: 'Johtaja4',
    first_name: 'Johan',
    last_name: 'Tajaja',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 20,
    num_following: 1,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 5,
    username: 'Johtaja5',
    first_name: 'Johtimies',
    last_name: 'Von Johto',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 410,
    num_following: 110,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 6,
    username: 'Johtaja6',
    first_name: 'Johto',
    last_name: 'Majuri',
    email: 'johtaja@johtaja.johtaja',
    bio: 'L5 Software Engineer @Clout',
    num_followers: 770,
    num_following: 20,
    profile_picture_url:
      'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
    num_posts: IMAGELIST_LENGTH,
  },
  {
    id: 7,
    username: 'Johtaja7',
    first_name: 'Johto',
    last_name: 'Jormanen',
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
  id: 101,
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
    id: 102,
    image_url:
      'https://static.wikia.nocookie.net/louser/images/1/15/Eheheh.png/revision/latest?cb=20130218225046',
    num_likes: 2,
  },
  {
    ...baseImageMock,
    id: 103,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDMXtoTWSqW0jfC1eIqJUEak0uNt_GOvYq8w&s',
    num_likes: 1,
    user: mockUserList[2],
  },
  {
    ...baseImageMock,
    id: 104,
    image_url: 'https://pbs.twimg.com/media/F9xhN65WQAATLoU.jpg',
    num_likes: 0,
    user: mockUserList[3],
  },
  {
    ...baseImageMock,
    id: 105,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGntJMFAROF9MNVt6ippW2IfBwlxtBkS7jg&s',
    num_likes: 0,
    user: mockUserList[4],
  },
  {
    ...baseImageMock,
    id: 106,
    image_url:
      'https://ultimateguard.com/media/8a/19/c9/1728480928/SQR-050001-277-011-00_dark_0001.jpg?1728480928',
    num_likes: 0,
  },
  {
    ...baseImageMock,
    id: 107,
    image_url:
      'https://spinnaker-watches.com/cdn/shop/articles/pizza_delivery_106.jpg?v=1721710885',
    num_likes: 0,
  },
];

export let mockLikes = [
  {
    id: 1,
    user_id: 1,
    image_id: 101,
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 2,
    image_id: 101,
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 4,
    image_id: 101,
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 3,
    image_id: 102,
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 2,
    image_id: 103,
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 3,
    image_id: 101,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 4,
    image_id: 102,
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 1,
    image_id: 103,
    created_at: '2024-03-07T12:25:00Z',
  },
];

export let mockComments = [
  {
    id: 1,
    user_id: 1,
    image_id: 101,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:00:00Z',
  },
  {
    id: 2,
    user_id: 2,
    image_id: 101,
    comment: 'HIENO KUVA joo',
    created_at: '2024-03-07T12:05:00Z',
  },
  {
    id: 3,
    user_id: 4,
    image_id: 101,
    comment: 'HIENO KUVA hei hoi hai',
    created_at: '2024-03-07T12:10:00Z',
  },
  {
    id: 4,
    user_id: 3,
    image_id: 102,
    comment: 'HIENO KUVA',
    created_at: '2024-03-07T12:15:00Z',
  },
  {
    id: 5,
    user_id: 2,
    image_id: 103,
    comment: 'ONPA HIenooo',
    created_at: '2024-03-07T12:20:00Z',
  },
  {
    id: 6,
    user_id: 3,
    image_id: 101,
    comment: 'katos katos',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 7,
    user_id: 4,
    image_id: 102,
    comment: 'terve mikä kuva',
    created_at: '2024-03-07T12:25:00Z',
  },
  {
    id: 8,
    user_id: 1,
    image_id: 101,
    comment: 'HIENO KUVA hahaha',
    created_at: '2024-03-07T12:00:00Z',
  },
];

export let mockFollowRelations = [
  {id: 0, user_id1: 1, user_id2: 2},
  {id: 1, user_id1: 1, user_id2: 3},
  {id: 2, user_id1: 2, user_id2: 4},
  {id: 3, user_id1: 3, user_id2: 5},
  {id: 4, user_id1: 3, user_id2: 6},
  {id: 5, user_id1: 4, user_id2: 2},
  {id: 6, user_id1: 5, user_id2: 3},
  {id: 7, user_id1: 5, user_id2: 6},
  {id: 8, user_id1: 6, user_id2: 7},
  {id: 9, user_id1: 7, user_id2: 1},
  {id: 10, user_id1: 7, user_id2: 2},
  {id: 11, user_id1: 7, user_id2: 4},
  {id: 12, user_id1: 7, user_id2: 6},
];

type TupleType = [CustomImage, CustomImage];

let extendedMockImageList: TupleType[] = [];
let uri_idx: number;
let uri_idx2: number;

for (let i = 0; i < IMAGELIST_LENGTH; i += 1) {
  uri_idx = Math.floor(Math.random() * mockImageList.length);
  uri_idx2 = Math.floor(Math.random() * mockImageList.length);

  extendedMockImageList.push([
    {...baseImageMock, id: i, image_url: mockImageList[uri_idx].image_url},
    {...baseImageMock, id: i + 1, image_url: mockImageList[uri_idx2].image_url},
  ]);
}

export default extendedMockImageList;
