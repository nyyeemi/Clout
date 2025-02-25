import React from 'react';
import {Image, Pressable, SafeAreaView, Text, View} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import {horizontalScale, verticalScale} from '../../assets/styles/scaling';
import {User} from '../../services/user/users';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {FlatList} from 'react-native-gesture-handler';
import {CustomImage} from '../../services/image/images';

type UserStatistics = {
  textField: string;
  data: number;
};

const mockData: UserStatistics[] = [
  {textField: 'posts', data: 0},
  {textField: 'followers', data: 69420},
  {textField: 'following', data: 1},
];

const UserInfoBox = ({data, textField}: UserStatistics): JSX.Element => {
  console.log('InfoBox');
  return (
    <View style={style.box}>
      <Text style={style.boxNumber}>{data}</Text>
      <Text style={style.boxText}>{textField}</Text>
    </View>
  );
};

type UserInfoBarProps = {
  data: UserStatistics[];
};

const ProfilePicture = ({uri}: {uri: string}) => {
  return (
    <View>
      <Image source={{uri}} resizeMode="contain" style={style.image} />
    </View>
  );
};

const UserInfoBar = ({data}: UserInfoBarProps): JSX.Element => {
  console.log('InfoBar', data);
  return (
    <View style={style.infoBar}>
      <ProfilePicture
        uri={
          'https://cdn-images.dzcdn.net/images/artist/77220ccb5a36d0e5df2c9e47f2c89de4/1900x1900-000000-80-0-0.jpg'
        }
      />
      {data.map(obj => (
        <UserInfoBox
          key={obj.textField}
          data={obj.data}
          textField={obj.textField}
        />
      ))}
    </View>
  );
};

const mockUser: User = {
  id: 0,
  username: 'johtaja.clout',
  email: 'johtaja@johtaja.johtaja',
  bio: 'L5 Software Engineer @Clout',
};

const ProfileActionButton = ({text}: {text: string}): JSX.Element => {
  return (
    <View>
      <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? '#f5f5f5' : '#f0f0f0',
          },
          style.button,
        ]}
        onPress={() => console.log('press profileactionbutton')}>
        <Text style={[style.name, {textAlign: 'center'}]}>{text}</Text>
      </Pressable>
    </View>
  );
};

// image grid definitions
type ImageBoxProps = {
  image: CustomImage;
  onPress: () => void;
};

const ImageBox = ({image, onPress}: ImageBoxProps): JSX.Element => (
  <>
    <Pressable
      style={({pressed}) => [{opacity: pressed ? 0.5 : 1}]}
      onPress={onPress}>
      <Image
        source={{uri: image.image_url}}
        resizeMode="cover"
        style={style.imageBox}
      />
    </Pressable>
  </>
);

const ImageGrid = ({data}: {data: CustomImage[]}): JSX.Element => {
  const renderItem = ({item}: {item: CustomImage}) => {
    return (
      <ImageBox
        image={item}
        onPress={() => console.log(`pressed image id: ${item.id}`)}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item.id)}
        numColumns={3}
      />
    </View>
  );
};

const baseImageMock: CustomImage = {
  id: 1,
  user: mockUser,
  image_url:
    'https://i.guim.co.uk/img/media/b1c1caa029d6f186f9d6b3fabb7f02517eb9c33b/0_58_2528_1519/master/2528.jpg?width=1200&quality=85&auto=format&fit=max&s=a80cc1503df75e0c9d04b78ed226229e',
  thumbnail_url: null,
  caption: null,
  created_at: '01122024',
  is_visible: true,
};

const mockImageList: CustomImage[] = [
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

// main / upper screen
export const ProfileScreen = (): JSX.Element => {
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: globalStyle.defaultPadding.paddingHorizontal,
          paddingTop: globalStyle.defaultPadding.paddingVertical,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            textAlignVertical: 'bottom',
          }}>
          {mockUser.username}
        </Text>
        <Pressable onPress={() => console.log('pressed')}>
          <FontAwesomeIcon icon={faBars} size={20} />
        </Pressable>
      </View>

      <View style={style.container}>
        <UserInfoBar data={mockData} />
        <View style={{paddingBottom: 10}}>
          <Text style={style.name}>{mockUser.username}</Text>
          <Text>{mockUser.bio}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            paddingVertical: 6,
          }}>
          <ProfileActionButton text="Edit profile" />
          <ProfileActionButton text="Share profile" />
        </View>
      </View>
      <View style={style.divider} />
      <ImageGrid data={mockImageList} />
    </SafeAreaView>
  );
};
