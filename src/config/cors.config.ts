export const allowedOrigins = (process.env.ALLOWED_ORIGIN as string).split(' ');

export default {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
