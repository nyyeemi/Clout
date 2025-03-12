import {CustomUser} from '../Profile/components/ProfileInfoCard';

export type CustomImage = {
  id: number;
  user: CustomUser;
  image_url: string;
  thumbnail_url: string | null;
  caption: string | null;
  created_at: string;
  is_visible: boolean;
};

const IMAGELIST_LENGTH = 10;

export const mockUser: CustomUser = {
  id: 0,
  username: 'Johtaja',
  email: 'johtaja@johtaja.johtaja',
  bio: 'L5 Software Engineer @Clout',
  num_followers: 420,
  num_following: 0,
  profile_picture_url:
    'https://static.wikia.nocookie.net/joke-battles/images/d/df/Gigachad.png/revision/latest/scale-to-width-down/400?cb=20230812064835',
  num_posts: IMAGELIST_LENGTH,
};

export const baseImageMock: CustomImage = {
  id: 1,
  user: mockUser,
  image_url:
    'https://i.guim.co.uk/img/media/b1c1caa029d6f186f9d6b3fabb7f02517eb9c33b/0_58_2528_1519/master/2528.jpg?width=1200&quality=85&auto=format&fit=max&s=a80cc1503df75e0c9d04b78ed226229e',
  thumbnail_url: null,
  caption: null,
  created_at: '01122024',
  is_visible: true,
};

export const mockImageList: CustomImage[] = [
  baseImageMock,
  {
    ...baseImageMock,
    id: 2,
    image_url:
      'https://static.wikia.nocookie.net/louser/images/1/15/Eheheh.png/revision/latest?cb=20130218225046',
  },
  {
    ...baseImageMock,
    id: 3,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDMXtoTWSqW0jfC1eIqJUEak0uNt_GOvYq8w&s',
  },
  {
    ...baseImageMock,
    id: 4,
    image_url: 'https://pbs.twimg.com/media/F9xhN65WQAATLoU.jpg',
  },
  {
    ...baseImageMock,
    id: 5,
    image_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGntJMFAROF9MNVt6ippW2IfBwlxtBkS7jg&s',
  },
  {
    ...baseImageMock,
    id: 6,
    image_url:
      'https://ultimateguard.com/media/8a/19/c9/1728480928/SQR-050001-277-011-00_dark_0001.jpg?1728480928',
  },
  {
    ...baseImageMock,
    id: 7,
    image_url:
      'https://spinnaker-watches.com/cdn/shop/articles/pizza_delivery_106.jpg?v=1721710885',
  },
];
