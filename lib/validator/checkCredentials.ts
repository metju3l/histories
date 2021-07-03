import { CheckEmail, CheckUsername, CheckPassword } from './';

const CheckCredentials = ({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) => {
  if (!CheckEmail(email)) return 'invalid email';
  else if (!CheckUsername(username)) return 'invalid username';
  else if (!CheckPassword(password)) return 'invalid password';
  else return '';
};
export default CheckCredentials;
