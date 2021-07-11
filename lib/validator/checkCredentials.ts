import isEmail from 'validator/lib/isEmail';

const CheckCredentials = ({
  username,
  password,
  email,
  firstName,
  lastName,
}: {
  username?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}): string => {
  if (!CheckEmail(email)) return 'invalid email';
  else if (!CheckUsername(username)) return 'invalid username';
  else if (!CheckPassword(password)) return 'invalid password';
  else if (!CheckName(firstName)) return 'invalid first name';
  else if (!CheckName(lastName)) return 'invalid last name';
  else return '';
};

const CheckEmail = (email: string | undefined) => {
  if (email === undefined) return true;
  return isEmail(email);
};

const CheckPassword = (password: string | undefined) => {
  if (password === undefined) return true;
  return password.length >= 8 && password.length <= 64;
};

const CheckUsername = (username: string | undefined) => {
  if (username === undefined) return true;

  const regex = new RegExp(
    '^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$'
  );
  return regex.test(username);
};

const CheckName = (name: string | undefined) => {
  if (name === undefined) return true;

  const regex = new RegExp(
    '^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$'
  );
  return regex.test(name);
};

export default CheckCredentials;
