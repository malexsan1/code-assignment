import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = JSON.parse(req.body);

  res.status(200).json({ user });
}
