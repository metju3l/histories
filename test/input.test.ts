import { ValidateUsername, ValidateEmail } from '../lib/validation';

test('username', () => {
  // correct
  expect(ValidateUsername('kahy9')).toEqual({ error: null });
  expect(ValidateUsername('_krystofex_')).toEqual({ error: null });
  expect(ValidateUsername('czM1K3')).toEqual({ error: null });
  expect(ValidateUsername('pephis')).toEqual({ error: null });

  // wrong
  expect(ValidateUsername('idk')).toEqual({
    error: 'Username has to be longer than 3 characters',
  });
  expect(ValidateUsername('')).not.toEqual({ error: null });
  expect(ValidateUsername('krystofex/xx')).toEqual({
    error:
      'Username can only contain letters, numbers, underscores and periods',
  });
  expect(ValidateUsername('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')).toEqual({
    error: 'Username has to be shorter than 32 characters',
  });
});

test('email', () => {
  // correct
  expect(ValidateEmail('email@example.com')).toEqual({ error: null });
  expect(ValidateEmail('email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('e-mail@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('test.email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('example@example-domain.org')).toEqual({ error: null });

  // wrong
  expect(ValidateEmail('@example.com')).not.toEqual({ error: null });
  expect(ValidateEmail('email@example')).not.toEqual({ error: null });
  expect(ValidateEmail('example@.com')).not.toEqual({ error: null });
  expect(ValidateEmail('example.com')).not.toEqual({ error: null });
  expect(ValidateEmail('ema/il@example')).not.toEqual({ error: null });
  expect(ValidateEmail('.com')).not.toEqual({ error: null });
  expect(ValidateEmail('')).not.toEqual({ error: null });
});
