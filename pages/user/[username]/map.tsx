import { ApolloClient, InMemoryCache } from '@apollo/client';
import UserLayout from '@components/Layouts/User';
import Marker from '@components/Modules/Minimap/Marker';
import { PostsDocument, usePostsQuery } from '@graphql/post.graphql';
import { UserDocument } from '@graphql/user.graphql';
import {
  GetCookieFromServerSideProps,
  IsJwtValid,
  SSRRedirect,
} from '@lib/functions';
import Viewport from '@lib/types/viewport';
import { GetServerSidePropsContext } from 'next';
import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { Default } from 'shared/config/MapStyles';

import UrlPrefix from '../../../shared/config/UrlPrefix';
import { ValidateUsername } from '../../../shared/validation';
import { LoginContext } from '../../_app';

const UserMapPage: React.FC<{
  user: {
    username: string;
    firstName: string;
    lastName: string;
    profile: string;
  };
  postsTmp: any;
}> = ({ user, postsTmp }) => {
  // login context
  const loginContext = React.useContext(LoginContext);

  const [viewport, setViewport] = useState<Viewport>({
    latitude: 50,
    longitude: 15,
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });

  const postsQuery = usePostsQuery({
    variables: {
      input: {
        filter: { take: 1 },
      },
    },
  });

  return (
    <UserLayout
      user={user}
      currentTab="map"
      head={{
        title: `${user.firstName}'s map | hiStories`,
        description: `${user.firstName}'s map of posts on HiStories`,
        canonical: `https://www.histories.cc/user/${user.username}/map`,
        openGraph: {
          title: `${user.firstName} ${user.lastName} | HiStories`,
          type: 'website',
          images: [
            {
              url: user.profile.startsWith('http')
                ? user.profile
                : UrlPrefix + user.profile,
              width: 92,
              height: 92,
              alt: `${user.firstName}'s profile picture`,
            },
          ],
          url: `https://www.histories.cc/user/${user.username}/map`,
          description: `${user.firstName}'s map of posts on HiStories`,
          site_name: 'Profil map page',
          profile: user,
        },
      }}
    >
      <ReactMapGL
        {...viewport}
        {...{
          width: '100%',
          height: '100%',
          className: 'rounded-lg',
          mapStyle: Default, // MAPBOX STYLE
          mapboxApiAccessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN, // MAPBOX API ACCESS TOKEN
        }}
        onViewportChange={setViewport}
      >
        {
          // postsQuery.loading ?
          postsTmp.map((post: any) => (
            <Marker
              key={post.id}
              latitude={post.place.latitude}
              longitude={post.place.longitude}
              onClick={
                // on click set viewport to marker location
                () =>
                  setViewport({
                    latitude: post.place.latitude,
                    longitude: post.place.longitude,
                    zoom: 14,
                    bearing: 0,
                    pitch: 0,
                  })
              }
            />
          ))
        }
      </ReactMapGL>
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req } = ctx;
  const jwt = GetCookieFromServerSideProps(req.headers.cookie, 'jwt');
  const anonymous = jwt === null ? true : IsJwtValid(jwt);

  // create new apollo graphql client
  const client = new ApolloClient({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ??
      'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  });

  // fetch user query
  if (!req.url?.startsWith('_next') && ctx.query.username != 'manifest.json') {
    // check if username is valid, if not redirect to 404 page with argument
    if (typeof ctx.query.username !== 'string')
      return SSRRedirect('/404?error=user_does_not_exist');

    const validateUsername = ValidateUsername(ctx.query.username).error;
    if (validateUsername) return SSRRedirect('/404?error=user_does_not_exist');

    const { data: userData } = await client.query({
      query: UserDocument,
      variables: { username: ctx.query.username },
    });

    const { data: postsData } = await client.query({
      query: PostsDocument,
      variables: {
        input: {
          filter: {
            authorUsername: ctx.query.username,
            skip: 0,
            take: 200,
          },
        },
      },
    });

    // return props
    return {
      props: {
        user: userData.user,
        postsTmp: postsData.posts,
        anonymous,
      },
    };
  }
  return {
    // @ts-ignore
    // this should not be needed 🤷‍♀️
    props: { user: { username: ctx.query.username }, anonymous },
  };
};
export default UserMapPage;
