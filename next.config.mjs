// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images:{
//         domain:['res.cloudinary.com']
//     }
// };

// export default nextConfig;
// next.config.mjs
import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs";

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.CLIENT_ID || '',
  oauthServer: process.env.AUTH_SERVER || 'https://auth.civic.com/oauth',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default withCivicAuth(nextConfig);
