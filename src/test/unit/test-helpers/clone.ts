// Useful when tests use a common value which might be modified within the test
export const clone = <Type>(object: Type): Type => {
  return JSON.parse(JSON.stringify(object));
};
