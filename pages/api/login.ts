import { NextApiRequest, NextApiResponse } from 'next';

import { createJWT } from '../../lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = JSON.parse(req.body);

  const token = await createJWT({ username, password });

  res.status(200).json({ token });
}
