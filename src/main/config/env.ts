export const env = {
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'cl3@n@rch',
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '547112707027635',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '8e89e40cf92572352d5fe39601f7fdfa'
  }
}
