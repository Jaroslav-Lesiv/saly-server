export const config = {
  PORT: process.env.PORT || '4441',
  SECRET: process.env.JWT_SECRET || 'secret',
  TTL: process.env.TTL || 360000000,
};
