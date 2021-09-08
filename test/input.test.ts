import { ValidateUsername } from '../lib/validation';

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
