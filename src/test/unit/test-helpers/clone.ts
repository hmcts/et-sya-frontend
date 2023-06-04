// Useful when tests use a common value which might be modified within the test
export const clone = (object: unknown): unknown => {
  return JSON.parse(JSON.stringify(object));
};
