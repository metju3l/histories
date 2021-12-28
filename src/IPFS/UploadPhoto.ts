import { create } from 'ipfs-http-client';

// upload to IPFS using Infura api
const UploadPhoto = async (
  photo: Buffer
): Promise<{ url: string; blurhash: string }> => {
  // if infura credentials are not set, throw error
  if (!process.env.INFURA_PROJECT_ID)
    throw new Error('Infura project ID is not defined');
  if (!process.env.INFURA_PROJECT_SECRET)
    throw new Error('Infura project secret is not defined');

  // create authentication string
  const auth =
    'Basic ' +
    Buffer.from(
      process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
    ).toString('base64');

  // create IPFS client
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const res = await client.add(photo); // upload file, Infura will automatically pin the file
  return { url: res.path, blurhash: '' };
};

export default UploadPhoto;
