const ValidateUsername = (username: string) => {
  // if username is undefined || null || ""
  if (!username)
    return { error: 'Username has to be longer than 3 characters' };

  const regex = new RegExp('^[a-zA-Z0-9_.]{4,32}$');
  if (regex.test(username)) return { error: null };
  else {
    if (username.length < 4)
      return { error: 'Username has to be longer than 3 characters' };
    else if (username.length > 32)
      return { error: 'Username has to be shorter than 32 characters' };
    else
      return {
        error:
          'Username can only contain letters, numbers, underscores and periods',
      };
  }
};

export default ValidateUsername;
