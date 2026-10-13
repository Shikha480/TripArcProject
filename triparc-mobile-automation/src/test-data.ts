export interface User {
  username: string;
  password: string;
}

const users: Record<string, User> = {
  standard: { username: 'bod@example.com', password: '10203040' },
};

export const testData = {
  user(key: string): User {
    if (!users[key]) throw new Error(`No user called "${key}"`);
    return users[key];
  },
};
