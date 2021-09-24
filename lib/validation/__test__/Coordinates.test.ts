import { ValidateCoordinates } from '..';

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
  // @ts-expect-error
  expect(ValidateCoordinates([0, undefined])).toEqual({
    error: 'Invalid coordinates',
  });
  // @ts-expect-error
  expect(ValidateCoordinates([undefined, 27])).toEqual({
    error: 'Invalid coordinates',
  });
  // @ts-expect-error
  expect(ValidateCoordinates([null, null])).toEqual({
    error: 'Invalid coordinates',
  });
});
