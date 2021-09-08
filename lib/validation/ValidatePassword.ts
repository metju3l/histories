const ValidatePassword = (password: string) => {
  // password is too short
  if (password.length < 8)
    return { error: 'Password has to be longer than 8 characters' };
  // password is too long
  else if (password.length > 128)
    return { error: 'Password has to be shorter than 128 characters' };
  // password is ok
  else return { error: null };
};

export default ValidatePassword;
