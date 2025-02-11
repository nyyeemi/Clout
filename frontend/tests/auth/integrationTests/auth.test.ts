import {login} from '../../../src/services/auth/login';
import {refreshAccessToken} from '../../../src/services/auth/refreshToken';
import {register} from '../../../src/services/auth/register';
import {deleteUser} from '../../../src/services/user/users';

describe('API integration tests', () => {
  let testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
  };

  let accessToken = '';
  let refreshToken = '';
  let id: number;

  it('should register a user successfully (real API call)', async () => {
    const response = await register(
      testUser.username,
      testUser.email,
      testUser.password,
    );

    expect(response).toHaveProperty('id');
    id = response.id;
    expect(response.username).toBe(testUser.username);
    expect(response.email).toBe(testUser.email);
  });

  it('should login successfully and receive tokens (real API call)', async () => {
    const response = await login(testUser.username, testUser.password);

    expect(response).toHaveProperty('access');
    expect(response).toHaveProperty('refresh');

    accessToken = response.access;
    refreshToken = response.refresh;
  });

  it('should refresh access token successfully (real API call)', async () => {
    const response = await refreshAccessToken(refreshToken);

    expect(response).toHaveProperty('access');
    expect(response.access).not.toBe(accessToken);
  });

  it('should fail login with incorrect credentials', async () => {
    await expect(login('wronguser', 'wrongpassword')).rejects.toHaveProperty(
      'detail',
    );
  });

  it('should fail refreshing token with invalid refresh token', async () => {
    await expect(
      refreshAccessToken('invalid_refresh_token'),
    ).rejects.toHaveProperty('detail');
  });

  afterAll(async () => {
    if (id) {
      try {
        await deleteUser(id, accessToken);
      } catch (error: any) {
        console.error(error.response?.data || error.message);
      }
    }
  });
});
