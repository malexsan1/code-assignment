import jwt from 'jsonwebtoken';

import { AuthPayload } from '@core/entities';
import { NextApiRequest } from 'next';

export const createJWT = (
  payload: AuthPayload,
  key: string = process.env.JWT_SECRET,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, key, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });
};

export const verifyToken = (
  token: string,
  key: string = process.env.JWT_SECRET,
): AuthPayload | null => {
  try {
    return jwt.verify(token, key) as AuthPayload;
  } catch (err) {
    console.error('Failed to verify JWT:', err.message);
    return null;
  }
};

export const getCookies = (req: NextApiRequest): Record<string, string> => {
  if (!req.headers.cookie) return {};

  const cookieItems = req.headers.cookie.split('; ');

  return cookieItems.reduce((acc, el) => {
    const [key, value] = el.split('=');

    return {
      ...acc,
      [key]: value,
    };
  }, {});
};
