const ValidatePassword = (password: string) => {
  if (password.length < 8)
    return { error: 'Password has to be longer than 8 characters' };
  else if (password.length > 128)
    return { error: 'Password has to be shorter than 128 characters' };
  else return { error: null };
};

export default ValidatePassword;
