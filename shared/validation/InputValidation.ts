import validator from 'validator';

export const IsValidBio = (bio?: string | null): boolean => {
  return (bio || ' ').length < 512;
};

export const IsValidComment = (comment: string): boolean => {
  return comment.length > 0 && comment.length < 512;
};

export const IsValidUsername = (username: string): boolean => {
  return (
    validator.isAlphanumeric(username) &&
    username.length > 2 &&
    username.length < 256
  );
};

export const IsValidName = (name: string): boolean => {
  return (
    validator.isAlphaLocales.find((locale) =>
      validator.isAlphanumeric(name, locale)
    ) != null &&
    name.length > 2 &&
    name.length < 256
  );
};
