import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = JSON.parse(req.body);

  console.log('waiwai', user);

  res.status(200).json({ user });
}
