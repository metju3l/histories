import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';
import { create } from 'ipfs-http-client';

const UploadPhoto = async (photo: any) => {
  const { createReadStream, mimetype } = await photo;
  if (!mimetype.startsWith('image/')) throw new Error('file is not a image');

  const stream = await createReadStream();
  const buffer = await streamToPromise(stream);

  const image = await sharp(buffer)
    .resize(1080, 1080, { withoutEnlargement: true })
    .jpeg()
    .toBuffer();

  const ipfs = create();
  const hash = await ipfs.add(image);
  // @ts-ignore
  return hash[0].path;
};

export default UploadPhoto;
