import { CheckCredentials } from '../lib/validation';

test('email', () => {
  expect(CheckCredentials({ email: 'email@example.com' })).toBe('');
  expect(CheckCredentials({ email: 'email@example.co.uk' })).toBe('');
  expect(CheckCredentials({ email: 'email@example.co.' })).not.toBe('');
  expect(CheckCredentials({ email: 'email@example.' })).not.toBe('');
  expect(CheckCredentials({ email: 'email@example' })).not.toBe('');
  expect(CheckCredentials({ email: '@example.com' })).not.toBe('');
});

test('password', () => {
  expect(CheckCredentials({ password: '#df237See' })).toBe('');
  expect(CheckCredentials({ password: 'Password' })).toBe('');
  expect(CheckCredentials({ password: 'short' })).not.toBe('');
  expect(CheckCredentials({ password: '#df237S' })).not.toBe('');
});

test('username', () => {
  expect(CheckCredentials({ username: 'username' })).toBe('');
  expect(CheckCredentials({ username: 'username_123' })).toBe('');
  expect(CheckCredentials({ username: 'user.name' })).toBe('');
  expect(CheckCredentials({ username: 'user' })).toBe('');
  expect(CheckCredentials({ username: 'user.' })).not.toBe('');
  expect(CheckCredentials({ username: 'username&' })).not.toBe('');
});

test('name', () => {
  expect(CheckCredentials({ firstName: 'Frantisek' })).toBe('');
  expect(CheckCredentials({ firstName: 'Elizabeth' })).toBe('');
  expect(CheckCredentials({ firstName: 'Eliza&#&#xv' })).not.toBe('');
});
