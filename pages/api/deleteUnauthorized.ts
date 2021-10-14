import DeleteUnauthorized from '@src/mutations/DeleteUnauthorized';
import type { NextApiRequest, NextApiResponse } from 'next';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ success: await DeleteUnauthorized() });
};

export default Handler;
