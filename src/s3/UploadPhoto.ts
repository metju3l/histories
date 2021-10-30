import AWS from 'aws-sdk';
import { uuid } from 'uuidv4';
import sharp from 'sharp';
import streamToPromise from 'stream-to-promise';

const UploadPhoto = async (photo: any) => {
  if (!process.env.S3_BUCKET) throw new Error('S3 bucket is not defined');
  if (!process.env.S3_ACCESS_KEY)
    throw new Error('S3 access key is not defined');
  if (!process.env.S3_SECRET_ACCESS_KEY)
    throw new Error('S3 secret access key is not defined');

  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  const { createReadStream, mimetype } = await photo;
  if (!mimetype.startsWith('image/')) throw new Error('file is not a image');

  const uniqueFileName = `${new Date().getTime()}-${uuid().substring(
    0,
    8
  )}.jpg`;

  const stream = await createReadStream();
  const buffer = await streamToPromise(stream);

  const image = await sharp(buffer)
    .resize(1080, 1080, { withoutEnlargement: true })
    .jpeg()
    .toBuffer();

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: uniqueFileName,
    Body: image,
    ACL: 'public-read',
  };

  const promise = await s3
    .upload(params, (error: any, data: any) => {
      if (error) throw new Error(error.message);
    })
    .promise();

  return promise.Location;
};

export default UploadPhoto;
