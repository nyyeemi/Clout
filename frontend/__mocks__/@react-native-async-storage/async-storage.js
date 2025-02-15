const storage = {};

export default {
  setItem: jest.fn(async (key, value) => {
    storage[key] = value; // Store real token during the test
    return Promise.resolve();
  }),
  getItem: jest.fn(async key => {
    return Promise.resolve(storage[key] || null); // Return stored token
  }),
  removeItem: jest.fn(async key => {
    delete storage[key];
    return Promise.resolve();
  }),
};
