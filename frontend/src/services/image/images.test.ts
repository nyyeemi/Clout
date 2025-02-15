import {register} from '../auth/register';
import loginService from '../auth/login';
import {getAccessToken, setAccessToken} from '../utils';
import {deleteUser} from '../user/users';
import imageService, {CustomImage} from './images';

jest.mock('@react-native-async-storage/async-storage');

describe('Image api integration', () => {
  let testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
  };

  let id: number;
  let img: CustomImage;
  const image_url =
    'https://www.paramountshop.com/cdn/shop/files/spongebob-squarepants-life-sized-cardboard-cutout-standee-725187.jpg?v=1718292084';

  beforeAll(async () => {
    const response = await register(
      testUser.username,
      testUser.email,
      testUser.password,
    );
    id = response.id;
    const data = await loginService.login(testUser.username, testUser.password);
    await setAccessToken(data.accessToken);
  });

  it('should add a new image for user', async () => {
    const data = await imageService.create(image_url);
    expect(data.image_url).toBe(image_url);
    expect(data.user_id).toBe(id);
    img = data;
  });

  it('should get all images for logged in user', async () => {
    const data = await imageService.getAll();
    console.log(data);
    expect(data).toContainEqual(img);
  });

  afterAll(async () => {
    if (id) {
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          await deleteUser(id, accessToken);
        }
      } catch (error: any) {
        console.error(error.response?.data || error.message);
      }
    }
  });
});
