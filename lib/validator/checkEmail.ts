import isEmail from 'validator/lib/isEmail';

const CheckEmail = (email: string) => {
  return isEmail(email);
};

export default CheckEmail;
