import { sign } from 'jsonwebtoken';

function SignJWT(id: string) {
  // create and return jwt
  return sign(
    // JWT payload
    {
      id,
    },
    process.env.JWT_SECRET!, // JWT secret
    {
      expiresIn: '360min', // JWT token expiration
    }
  );
}

export default SignJWT;
