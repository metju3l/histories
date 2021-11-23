import 'react-dropdown/style.css';

import { PostCard } from '@components/PostCard';
import { ProfilePage } from '@components/ProfilePage';
import { useCollectionQuery } from '@graphql/collection.graphql';
import { NextPageContext } from 'next';
import React, { FC } from 'react';
import Dropdown from 'react-dropdown';

const Collections: FC<{ id: number }> = ({ id }) => {
  const { data, loading, error } = useCollectionQuery({ variables: { id } });

  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (loading) return <div>loading</div>;
  if (error || data === undefined) return <div>error</div>;

  return (
    <>
      <ProfilePage
        title={`${data.collection?.name} | hiStories`}
        username={data.collection.author.username}
        rightColumn={
          <div>
            <div className="flex items-center justify-between w-full px-4 pb-4">
              <span className="flex items-center text-white">
                <div className="mr-2"> sort by</div>
                <Dropdown
                  options={sortOptions}
                  onChange={(e) => {
                    // save the sort option in url query
                  }}
                  value={sortOptions[0]}
                  placeholder="Select an option"
                  className="w-36"
                />
              </span>
            </div>
            <div className="">
              {data.collection.posts.map((post) => (
                <PostCard key={post!.id} id={post!.id} isLoggedQuery={null} />
              ))}
            </div>
          </div>
        }
      />
    </>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    id: number;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      id: parseInt(context.query.id),
    },
  };
};

export default Collections;
