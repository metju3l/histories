import 'react-dropdown/style.css';

import { ProfilePage } from '@components/ProfilePage';
import { useIsLoggedQuery } from '@graphql/user.graphql';
import { NextPageContext } from 'next';
import React, { FC } from 'react';
import Dropdown from 'react-dropdown';

const Collections: FC<{ collection: number }> = ({ collection }) => {
  const logged = useIsLoggedQuery();
  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (logged.loading) return <div>loading</div>;

  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  const isLogged = logged.data!.isLogged;

  return (
    <>
      <ProfilePage
        title={`${collection} | hiStories`}
        username={'username'}
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
            <div className="grid grid-cols-3 gap-10"></div>
          </div>
        }
        menu={<></>}
      />
    </>
  );
};

export const getServerSideProps = async (
  context: NextPageContext
): Promise<{
  props: {
    collection: number;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      collection: parseInt(context.query.username),
    },
  };
};

export default Collections;
