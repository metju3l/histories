import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loading } from '@nextui-org/react';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import { useSuggestedUsersQuery } from '@graphql/user.graphql';

const Suggestions: FC<{ logged: any }> = ({ logged }) => {
  const { data, loading, error } = useSuggestedUsersQuery();

  if (error)
    return (
      <>
        <h2 className="text-center font-semibold text-lg">
          {logged.isLogged ? 'People you might know' : 'Popular users'}
        </h2>
        <div className="w-full p-8">error</div>
      </>
    );

  if (loading)
    return (
      <>
        <h2 className="text-center font-semibold text-lg">
          {logged.isLogged ? 'People you might know' : 'Popular users'}
        </h2>
        <div className="w-full p-8">
          <Loading
            type="spinner"
            size="large"
            className="m-auto"
            color="gray"
          />
        </div>
      </>
    );

  return (
    <>
      <h2 className="text-center font-semibold text-lg">
        {logged.isLogged ? 'People you might know' : 'Popular users'}
      </h2>
      <div className="flex flex-col ml-2 mt-6">
        {data!.suggestedUsers &&
          data!.suggestedUsers.map((user: any) => {
            return (
              <div
                className="flex items-center mb-6 justify-between w-full"
                key={user.id}
              >
                <div className="flex">
                  <Link href={`/${user!.username}`}>
                    <a className="relative rounded-full w-12 h-12 mr-4">
                      <Image
                        src={GeneratedProfileUrl(
                          user!.firstName,
                          user!.lastName
                        )}
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                        className="rounded-full"
                        alt="Profile picture"
                      />
                    </a>
                  </Link>
                  <div>
                    <Link href={`/${user!.username}`} passHref>
                      <a>
                        {' '}
                        {`${user!.firstName} ${user!.lastName}`}
                        <br />@{user!.username}
                      </a>
                    </Link>
                  </div>
                </div>
                {logged.isLogged && (
                  <button className="bg-[#2D89FE] px-4 py-1 mt-1 rounded-xl">
                    Follow
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Suggestions;
