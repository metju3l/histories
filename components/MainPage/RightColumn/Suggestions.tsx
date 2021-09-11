import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Suggestions: FC<{
  suggestedUsers: any;
  data: any;
}> = ({ suggestedUsers, data }) => {
  return suggestedUsers.data?.suggestedUsers ? (
    <>
      <h2 className="text-center font-semibold text-lg">
        {data!.isLogged ? 'People you might know' : 'Popular users'}
      </h2>
      <div className="flex flex-col text-white ml-2 mt-6">
        {suggestedUsers!.data!.suggestedUsers.map((user: any) => {
          return (
            <div
              className="flex items-center mb-6 justify-between w-full"
              key={user!.id}
            >
              <div className="flex">
                <Link href={`/${user!.username}`}>
                  <a className="relative rounded-full w-12 h-12 mr-4">
                    <Image
                      src={`https://avatars.dicebear.com/api/initials/${
                        user!.firstName
                      }%20${user!.lastName}.svg`}
                      layout="fill"
                      objectFit="contain"
                      objectPosition="center"
                      className="rounded-full"
                      alt="Profile picture"
                    />
                  </a>
                </Link>
                <div>
                  <Link href={`/${user!.username}`}>
                    {`${user!.firstName} ${user!.lastName}`}
                  </Link>
                  <br />
                  <a>@{user!.username}</a>
                </div>
              </div>
              {data!.isLogged && (
                <button className="bg-[#2D89FE] px-4 py-1 mt-1 rounded-xl">
                  Follow
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  ) : (
    <div>loading</div>
  );
};

export default Suggestions;
