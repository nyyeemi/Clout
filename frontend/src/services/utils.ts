import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};

export const setAccessToken = async (accessToken: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
  } catch (error) {
    console.error('Error retrieving token', error);
  }
};
