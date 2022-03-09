export const IsValidBio = (bio?: string | null): boolean => {
  return (bio || ' ').length < 512;
};

export const IsValidComment = (comment: string): boolean => {
  return comment.length > 0 && comment.length < 512;
};
