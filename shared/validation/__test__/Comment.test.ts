import { ValidateComment } from '..';

test('Comment', () => {
  // correct
  expect(ValidateComment('My amazing description')).toEqual({
    error: null,
  });
  expect(
    ValidateComment('description with some awesome EMOJIS 😂😂😂🤔')
  ).toEqual({
    error: null,
  });
  expect(
    ValidateComment('Some other special characters $ üäëěšščěú ?!')
  ).toEqual({
    error: null,
  });
  expect(ValidateComment('')).toEqual({
    error: 'Comment cannot be empty',
  }); // empty description

  // correct
  expect(ValidateComment('Nice photo')).toEqual({
    error: null,
  });
});
