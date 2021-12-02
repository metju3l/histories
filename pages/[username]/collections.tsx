import 'react-dropdown/style.css';

import CreateCollectionModal from '@components/Collection/CreateCollectionModal';
import { CollectionCard } from '@components/CollectionCard';
import { ProfilePage } from '@components/ProfilePage';
import { useGetUserInfoQuery, useIsLoggedQuery } from '@graphql/user.graphql';
import { PlusIcon } from '@heroicons/react/solid';
import { NextPageContext } from 'next';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import Dropdown from 'react-dropdown';

const Collections: FC<{ username: string }> = ({ username }) => {
  const router = useRouter();
  const { data, loading, error, refetch } = useGetUserInfoQuery({
    variables: { username: username },
  });
  const logged = useIsLoggedQuery();
  const [createModal, setCreateModal] = useState(false);
  const sortOptions = [
    { value: 'hot', label: 'Hot' },
    { value: 'mostliked', label: 'Most liked' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
  ];

  if (error) {
    return <div>error...</div>;
  }
  if (loading || logged.loading) return <div>loading</div>;
  if (logged.error) {
    console.log(logged.error);
    return <div>error</div>;
  }
  if (data === null || data === undefined)
    return <div>user does not exist</div>;
  const isLogged = logged.data!.isLogged;

  return (
    <>
      <CreateCollectionModal
        openState={createModal}
        setOpenState={setCreateModal}
        refetch={refetch}
      />
      <ProfilePage
        title={`${data.user.firstName}'s collections | hiStories`}
        username={data.user.username}
        rightColumn={
          <div>
            <div className="flex items-center justify-between w-full px-4 pb-4">
              <div className="">
                {isLogged && (
                  <PlusIcon
                    className="w-6 h-6 text-white"
                    onClick={() => {
                      setCreateModal(true);
                    }}
                  />
                )}
              </div>
              <span className="flex items-center text-white">
                <div className="mr-2"> sort by</div>
                <Dropdown
                  options={sortOptions}
                  onChange={(e) => {
                    // save the sort option in url query
                    router.replace({
                      pathname: `/${data.user.username}/collections`,
                      query: {
                        sortBy: e.value,
                      },
                    });
                  }}
                  value={sortOptions[0]}
                  placeholder="Select an option"
                  className="w-36"
                />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-10">
              {
                // @ts-ignore
                data.user?.collections &&
                  // @ts-ignore
                  data.user.collections.map((collection: any) => (
                    <CollectionCard id={collection!.id} key={collection!.id} />
                  ))
              }
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
    username: string;
  };
}> => {
  return {
    props: {
      // @ts-ignore
      username: context.query.username.toString(),
    },
  };
};

export default Collections;
