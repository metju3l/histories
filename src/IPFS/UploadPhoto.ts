import { create } from 'ipfs-http-client';
import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';

const UploadPhoto = async (
  photo: any
): Promise<{ url: string; blurhash: string }> => {
  if (!process.env.INFURA_PROJECT_ID)
    throw new Error('Infura project ID is not defined');
  if (!process.env.INFURA_PROJECT_SECRET)
    throw new Error('Infura project secret is not defined');

  const auth =
    'Basic ' +
    Buffer.from(
      process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
    ).toString('base64');

  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });

  const { createReadStream, mimetype } = await photo;
  // check if file is image
  if (!mimetype.startsWith('image/')) throw new Error('file is not a image');

  const stream = await createReadStream();
  // await upload stream
  const buffer = await streamToPromise(stream);

  const imageBuffer = await sharp(buffer)
    .resize(2560, undefined, { withoutEnlargement: true })
    // convert image format to jpeg
    .jpeg()
    .toBuffer();

  const ipfsres = await client.add(imageBuffer);
  return { url: ipfsres.path, blurhash: '' };
};

export default UploadPhoto;
