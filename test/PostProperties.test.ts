import { ValidateCoordinates, ValidateDate } from '../lib/validation';

test('Coordinates', () => {
  // correct
  expect(ValidateCoordinates([50.2031777, 15.4742032])).toEqual({
    error: null,
  });
  expect(ValidateCoordinates([-89.2426777, -56.5822032])).toEqual({
    error: null,
  });
  expect(ValidateCoordinates([0, 0])).toEqual({
    error: null,
  });

  // wrong
  expect(ValidateCoordinates([-92, 0])).toEqual({
    error: 'Invalid latitude',
  });
  expect(ValidateCoordinates([92, 0])).toEqual({
    error: 'Invalid latitude',
  });
  expect(ValidateCoordinates([0, 200])).toEqual({
    error: 'Invalid longitude',
  });
  expect(ValidateCoordinates([0, -200])).toEqual({
    error: 'Invalid longitude',
  });
});

test('Date', () => {
  // correct
  expect(ValidateDate(22843729)).toEqual({
    error: null,
  });

  // wrong
  expect(ValidateDate(new Date().getTime() + 1000)).toEqual({
    error: 'Invalid date',
  });
  expect(ValidateDate(new Date().getTime() + 250000)).toEqual({
    error: 'Invalid date',
  });
  expect(ValidateDate(-50000000000500)).toEqual({
    error: 'Invalid date',
  });
});
