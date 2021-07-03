import { CheckEmail, CheckPassword, CheckUsername } from '../lib/validator';

test('email', () => {
  expect(CheckEmail('email@example.com')).toBe(true);
  expect(CheckEmail('email@example.co.uk')).toBe(true);
  expect(CheckEmail('email@example.co.')).toBe(false);
  expect(CheckEmail('email@example.')).toBe(false);
  expect(CheckEmail('email@example')).toBe(false);
  expect(CheckEmail('@example.com')).toBe(false);
});

test('password', () => {
  expect(CheckPassword('#df237See')).toBe(true);
  expect(CheckPassword('Password')).toBe(true);
  expect(CheckPassword('short')).toBe(false);
  expect(CheckPassword('#df237S')).toBe(false);
});

test('username', () => {
  expect(CheckUsername('username')).toBe(true);
  expect(CheckUsername('username_123')).toBe(true);
  expect(CheckUsername('user.name')).toBe(true);
  expect(CheckUsername('user')).toBe(true);
  expect(CheckUsername('user.')).toBe(false);
  expect(CheckUsername('username&')).toBe(false);
});
