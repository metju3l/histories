import { useCollectionQuery } from '@graphql/collection.graphql';
import hoverHandler from '@hooks/hoverHandler';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const CollectionCard: React.FC<{ id: number }> = ({ id }) => {
  // get collection data
  const { data, loading, error } = useCollectionQuery({ variables: { id } });

  const [hover, setHover] = useState(false);

  if (loading) return <div>loading</div>;
  if (data?.collection === undefined || error)
    // loading placeholder
    return (
      <a
        className="relative cursor-pointer w-[18rem] h-96 bg-[#242427] rounded-xl"
        {...hoverHandler(setHover)}
      >
        <div
          className={`absolute bottom-0 w-full backdrop-filter backdrop-blur-xl rounded-xl ${
            hover ? 'h-full' : ''
          }`}
        >
          <p className="w-full h-10 p-2 text-white bg-black border-t border-gray-400 opacity-70 rounded-b-xl"></p>
        </div>
      </a>
    );

  return (
    <Link href={`/collection/${id}`}>
      <a
        className="relative cursor-pointer w-[18rem] h-96 bg-[#242427] rounded-xl"
        {...hoverHandler(setHover)}
      >
        <Image
          src={
            'https://histories-bucket.s3.eu-central-1.amazonaws.com/1636471330157-3398b12b.jpg'
          }
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="rounded-xl"
          alt="Profile picture"
        />
        <div
          className={`absolute bottom-0 w-full backdrop-filter backdrop-blur-xl rounded-xl ${
            hover ? 'h-full' : ''
          }`}
        >
          <p
            className={`w-full p-2 text-white bg-black opacity-70 ${
              hover
                ? 'h-full rounded-xl'
                : 'border-t border-gray-400 rounded-b-xl'
            }`}
          >
            {/* on hover show description */}
            {hover ? (
              <>
                <a className="font-semibold">{data.collection.name}</a>
                <br />
                <p className="pt-4 break-words whitespace-pre-wrap">
                  {data.collection.description}
                </p>
              </>
            ) : (
              data.collection.name
            )}
          </p>
        </div>
      </a>
    </Link>
  );
};

export default CollectionCard;
