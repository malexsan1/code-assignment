import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const post = JSON.parse(req.body);

  console.log('post la server', post.title);

  res.status(200).json({ post });
}
