import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { Layout } from '@components/layouts';
import { PostDocument, PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@src/functions';
import { motion } from 'framer-motion';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Blurhash } from 'react-blurhash';
import { useTranslation } from 'react-i18next';
import {
  HiOutlineCalendar,
  HiOutlineHeart,
  HiOutlineLocationMarker,
} from 'react-icons/hi';

interface PostDetailPageProps {
  post: PostQuery;
}

const CheckPost: React.FC<PostDetailPageProps> = ({ post }) => {
  const { t } = useTranslation<string>(); // i18n
  const [currentPhoto, setCurrentPhoto] = useState<number>(0);
  const [localLikeState, setLocalLikeState] = useState<boolean>(
    post.post.liked
  );

  return (
    <Layout
      head={{
        title: `Post | hiStories`,
        description: `Post Histories, place where you can share historical photos of places`,
        canonical: `https://www.histories.cc/post/${post.post.id}`,
        openGraph: {
          title: `Post | Histories`,
          type: 'website',
          url: `https://www.histories.cc/post/${post.post.id}`,
          description: `Post Histories`,
          site_name: 'Post page',
        },
      }}
    >
      <main className="m-auto mt-4 max-w-screen-xl">
        {/* PHOTO DATE */}
        <h2 className="flex items-center gap-2">
          <HiOutlineCalendar />
          {new Date(post.post.postDate).toLocaleDateString('cs', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex w-full gap-2">
          {/* PHOTO */}
          <div className="flex flex-col w-full h-full">
            <div className="relative w-full border border-gray-300 h-[80vh] shadow-sm rounded-xl">
              <Blurhash
                hash={post.post.photos[currentPhoto].blurhash}
                height="100%"
                width="100%"
                className="rounded-xl blurhash"
                punch={1}
                style={{ borderRadius: '50%' }}
              />
              <Image
                src={UrlPrefix + post.post.photos[currentPhoto].hash}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
                alt="post image"
              />
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setLocalLikeState(!localLikeState)}
              >
                <HiOutlineHeart
                  className={`w-6 h-6 ${
                    localLikeState
                      ? 'fill-red-500 stroke-red-500'
                      : 'stroke-black'
                  }`}
                />
              </motion.button>
              {post.post.likeCount}
            </div>
          </div>
          {/* RIGHT PANEL */}
          <div className="flex flex-col w-full">
            {/* PLACE */}
            <div className="flex gap-2">
              {/* PHOTO */}
              <div className="relative border border-gray-300 w-60 h-60 rounded-xl shadow-sm">
                <Blurhash
                  hash={post.post.place.preview!.blurhash}
                  height="100%"
                  width="100%"
                  className="rounded-xl blurhash"
                  punch={1}
                  style={{ borderRadius: '50%' }}
                />
                <Image
                  src={UrlPrefix + post.post.place.preview?.hash}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                  alt="Image of the place"
                />
              </div>
              {/* DESCRIPTION */}
              <div className="max-w-xs">
                <h1>{post.post.place.name}</h1>
                <Link
                  href={`/?lat=${post.post.place.latitude}&lng=${post.post.place.longitude}&zoom=18.5&place=${post.post.place.id}`}
                >
                  <a className="flex items-center">
                    <HiOutlineLocationMarker />
                    {t('show_on_map')}
                  </a>
                </Link>
                <p>{post.post.place.description}</p>
              </div>
            </div>
            {/* COMMENTS */}
            <div>{post.post.description}</div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;

  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    link: createHttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
        'http://localhost:3000/api/graphql',
      headers: {
        authorization: jwt ? `Bearer ${jwt}` : '',
      },
    }),

    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next')) {
    // check if post is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.id !== 'string')
      return SSRRedirect('/404?error=post_does_not_exist');

    try {
      const { data: postQuery }: { data: PostQuery } = await client.query({
        query: PostDocument,
        variables: { id: parseFloat(ctx.query.id) },
      });

      // return props
      return {
        props: {
          post: postQuery,
          anonymous,
        },
      };
    } catch (e) {
      return SSRRedirect('/404?error=post_does_not_exist');
    }
  }
  // this should not be needed 🤷‍♀️
  return {
    props: {},
  };
};

export default CheckPost;
