const ValidateUsername = (username: string) => {
  // titles of pages
  const forbiddenUsernames = [
    'register',
    'login',
    'settings',
    'map',
    '404',
    '500',
  ];
  const regex = /^[a-zA-Z0-9_.]{4,32}$/i;

  // if username is undefined || null || ""
  if (!username)
    return { error: 'Username has to be longer than 3 characters' };
  // username cannot be same as title of page
  else if (forbiddenUsernames.includes(username.toLowerCase()))
    return { error: 'This username cannot be used' };

  if (regex.test(username)) return { error: null };
  else {
    // if username is too short
    if (username.length < 4)
      return { error: 'Username has to be longer than 3 characters' };
    // if username is too long
    else if (username.length > 32)
      return { error: 'Username has to be shorter than 32 characters' };
    // if username contains forbidden characters
    else
      return {
        error:
          'Username can only contain letters, numbers, underscores and periods',
      };
  }
};

export default ValidateUsername;
