if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = `jest-${process.pid}`;
}
