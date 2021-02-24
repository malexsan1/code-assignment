import { NextApiResponse } from 'next';

function generateRandomToken() {
  // poor man's JWT
  return Math.random().toString(16).substr(2, 14);
}

export default function handler(_, res: NextApiResponse) {
  res.status(200).json({ token: generateRandomToken() });
}
