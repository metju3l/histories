import {
  ValidateUsername,
  ValidateEmail,
  ValidatePassword,
  ValidateName,
} from '../lib/validation';

test('Username', () => {
  // correct
  expect(ValidateUsername('kahy9')).toEqual({ error: null });
  expect(ValidateUsername('_krystofex_')).toEqual({ error: null });
  expect(ValidateUsername('czM1K3')).toEqual({ error: null });
  expect(ValidateUsername('pephis')).toEqual({ error: null });

  // wrong
  expect(ValidateUsername('idk')).toEqual({
    error: 'Username has to be longer than 3 characters',
  }); // too short
  expect(ValidateUsername('')).not.toEqual({ error: null }); // 0 characters
  expect(ValidateUsername('krystofex/xx')).toEqual({
    error:
      'Username can only contain letters, numbers, underscores and periods',
  }); // forbidden characters
  expect(ValidateUsername('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')).toEqual({
    error: 'Username has to be shorter than 32 characters',
  }); // too long

  expect(ValidateUsername('Login')).toEqual({
    error: 'This username cannot be used',
  }); // same username as page title
  expect(ValidateUsername('register')).toEqual({
    error: 'This username cannot be used',
  }); // same username as page title
  expect(ValidateUsername('MAP')).toEqual({
    error: 'This username cannot be used',
  }); // same username as page title
});

test('Email', () => {
  // correct
  expect(ValidateEmail('email@example.com')).toEqual({ error: null });
  expect(ValidateEmail('EMAIL@example.com')).toEqual({ error: null });
  expect(ValidateEmail('email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('e-mail@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('test.email@example.co.uk')).toEqual({ error: null });
  expect(ValidateEmail('example@example-domain.org')).toEqual({ error: null });

  // wrong
  expect(ValidateEmail('@example.com')).not.toEqual({ error: null });
  expect(
    ValidateEmail(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@example.com'
    )
  ).not.toEqual({ error: null }); // too long
  expect(ValidateEmail('email@example')).not.toEqual({ error: null });
  expect(ValidateEmail('example@.com')).not.toEqual({ error: null });
  expect(ValidateEmail('example.com')).not.toEqual({ error: null });
  expect(ValidateEmail('ema/il@example')).not.toEqual({ error: null });
  expect(ValidateEmail('.com')).not.toEqual({ error: null });
  expect(ValidateEmail('')).not.toEqual({ error: null }); // 0 characters
});

test('Password', () => {
  // correct
  expect(ValidatePassword('somerandompassword')).toEqual({ error: null }); // normal password
  expect(ValidatePassword('*2cB7C~U')).toEqual({ error: null }); // 8 characters long
  expect(ValidatePassword('Hq=:bb.cTY:A7?GC')).toEqual({ error: null }); // 16 characters long

  // wrong
  expect(ValidatePassword('2short')).toEqual({
    error: 'Password has to be longer than 8 characters',
  }); // too short
  expect(ValidatePassword('')).toEqual({
    error: 'Password has to be longer than 8 characters',
  }); // 0 characters
  expect(
    ValidatePassword(
      '+"QDT#~9`kYpv^!y\bP@6Ch@GZv*Y$~q^FF]g$3.&cWH/G&(^`7aKa{{7_SM-9yKerwxcxtFTCtHqx"uV5)eNA5Pa)J^__"h{kBNG-4v%AJKp}y@Q;f(WU3*".^BeTxCqf'
    )
  ).toEqual({
    error: 'Password has to be shorter than 128 characters',
  }); // too long
});

test('Firstname and lastname', () => {
  // correct
  expect(ValidateName('Kryštof')).toEqual({ error: null }); // local characters
  expect(ValidateName('Sömething')).toEqual({ error: null }); // local characters

  // wrong
  expect(ValidateName('Frank?xxx')).toEqual({
    error: 'can\'t contain special characters like \\/*?!"<>|',
  }); // forbidden characters
  expect(ValidateName('')).toEqual({
    error: 'is empty',
  }); // empty
  expect(
    ValidateName(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    )
  ).toEqual({
    error: 'has to be shorter than 128 characters',
  }); // too long
});
