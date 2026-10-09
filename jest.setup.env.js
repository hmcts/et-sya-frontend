if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = `jest-${process.pid}`;
}

if (!process.env.CSRF_SECRET) {
  process.env.CSRF_SECRET = `jest-${process.pid}`;
}
