import RunCypherQuery from '@src/database/RunCypherQuery';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

async function UpdateHashes() {
  if (
    fs.existsSync('./public/hashes.txt') &&
    Date.now() - fs.statSync('./public/hashes.txt').mtime.getTime() > 3600000
  ) {
    const query = `
    MATCH (post:Post)
    WHERE NOT post.url IS NULL
    RETURN COLLECT(post.url) AS url
    `;

    const [res] = await RunCypherQuery({ query });

    const hashes = res.records[0].get('url').flat();
    fs.writeFileSync('./public/hashes.txt', hashes.join('\n'));

    return 'hashes.txt is older than 1 hour, updated';
  } else return 'hashes.txt is up to date';
}

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ success: await UpdateHashes() });
};

export default Handler;
