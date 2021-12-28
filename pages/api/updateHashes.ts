import RunCypherQuery from '@src/database/RunCypherQuery';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

async function UpdateHashes() {
  if (
    !fs.existsSync('./public/api/hashes.txt') ||
    (fs.existsSync('./public/api/hashes.txt') &&
      Date.now() - fs.statSync('./public/api/hashes.txt').mtime.getTime() >
        3600000)
  ) {
    const query = `
    CALL{
      MATCH (post:Post)
      WHERE NOT post.url IS NULL
      RETURN COLLECT(DISTINCT post.url) AS postUrls
  }
  CALL{
      MATCH (user:User)
      WHERE NOT user.profile STARTS WITH "http"
      RETURN COLLECT(DISTINCT user.profile) AS profileUrls
  }
  RETURN profileUrls, postUrls
    `;

    const [res] = await RunCypherQuery({ query });

    const hashes = [
      ...res.records[0].get('postUrls').flat(),
      ...res.records[0].get('profileUrls'),
    ];
    fs.writeFileSync('./public/api/hashes.txt', hashes.join('\n'));

    return 'hashes.txt is older than 1 hour, updated';
  } else return 'hashes.txt is up to date';
}

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ success: await UpdateHashes() });
};

export default Handler;
