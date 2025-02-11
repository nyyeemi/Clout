import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {refreshAccessToken} from '../../../src/services/auth/refreshToken';
import {register} from '../../../src/services/auth/register';
import {login} from '../../../src/services/auth/login';

const mock = new MockAdapter(axios);
const API_URL = 'http://localhost:8000/api/auth/';

describe('API calls', () => {
  afterEach(() => {
    mock.reset();
  });

  // registration tests
  it('should register a user successfully', async () => {
    const mockData = {id: 1, username: 'testuser', email: 'test@example.com'};

    mock.onPost(`${API_URL}register/`).reply(201, mockData);

    const response = await register(
      'testuser',
      'test@example.com',
      'password123',
    );

    expect(response).toEqual(mockData);
  });

  it('should fail to register a user with existing username', async () => {
    mock
      .onPost(`${API_URL}register/`)
      .reply(400, {detail: 'Username already exists'});

    await expect(
      register('testuser', 'test@example.com', 'password123'),
    ).rejects.toEqual({
      detail: 'Username already exists',
    });
  });

  // login
  it('should login successfully and return tokens', async () => {
    const mockData = {
      access: 'mock_access_token',
      refresh: 'mock_refresh_token',
    };

    mock.onPost(`${API_URL}login/`).reply(200, mockData);

    const response = await login('testuser', 'password123');

    expect(response).toEqual(mockData);
  });

  it('should fail login with wrong credentials', async () => {
    mock.onPost(`${API_URL}login/`).reply(401, {detail: 'Invalid credentials'});

    await expect(login('wronguser', 'wrongpassword')).rejects.toEqual({
      detail: 'Invalid credentials',
    });
  });

  // refresh tokens
  it('should refresh access token successfully', async () => {
    const mockData = {access: 'new_mock_access_token'};

    mock.onPost(`${API_URL}token/refresh/`).reply(200, mockData);

    const response = await refreshAccessToken('mock_refresh_token');
    expect(response).toEqual(mockData);
  });

  it('should fail refreshing token with invalid refresh token', async () => {
    mock
      .onPost(`${API_URL}token/refresh/`)
      .reply(401, {detail: 'Token is invalid or expired'});

    await expect(refreshAccessToken('invalid_refresh_token')).rejects.toEqual({
      detail: 'Token is invalid or expired',
    });
  });
});
