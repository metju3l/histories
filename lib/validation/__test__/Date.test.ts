import { ValidateDate } from '..';

test('Date', () => {
  // correct
  expect(ValidateDate(22843729)).toEqual({
    error: null,
  });
  expect(ValidateDate(new Date().getTime() - 10)).toEqual({
    error: null,
  });

  // wrong
  expect(ValidateDate(new Date().getTime() + 1000)).toEqual({
    error: 'Invalid date',
  });
  // @ts-expect-error
  expect(ValidateDate()).toEqual({
    error: 'Invalid date',
  });
  // @ts-expect-error
  expect(ValidateDate(undefined)).toEqual({
    error: 'Invalid date',
  });
  expect(ValidateDate(new Date().getTime() + 250000)).toEqual({
    error: 'Invalid date',
  });
  expect(ValidateDate(-50000000000500)).toEqual({
    error: 'Invalid date',
  });
});
