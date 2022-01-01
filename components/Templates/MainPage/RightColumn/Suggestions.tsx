import { useSuggestedUsersQuery } from '@graphql/user.graphql';
import GeneratedProfileUrl from '@lib/functions/GeneratedProfileUrl';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';

const Suggestions: FC<{ logged: any }> = ({ logged }) => {
  const { data, loading, error } = useSuggestedUsersQuery();

  if (error)
    return (
      <>
        <h2 className="font-semibold text-gray-600 text-md">
          {logged.me ? 'Suggestions for You' : 'Popular users'}
        </h2>
        <div className="w-full pl-[20%] mt-[2rem]">something went wrong</div>
      </>
    );

  if (loading)
    return (
      <>
        <h2 className="font-semibold text-gray-600 text-md">
          {logged.me ? 'Suggestions for You' : 'Popular users'}
        </h2>
        <div className="w-full mt-[4rem]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2400 2400"
            width="20"
            height="20"
            className="m-auto"
          >
            <g
              strokeWidth="200"
              strokeLinecap="round"
              stroke="#484A4D"
              fill="none"
            >
              <path d="M1200 600V100" />
              <path opacity=".5" d="M1200 2300v-500" />
              <path opacity=".917" d="M900 680.4l-250-433" />
              <path opacity=".417" d="M1750 2152.6l-250-433" />
              <path opacity=".833" d="M680.4 900l-433-250" />
              <path opacity=".333" d="M2152.6 1750l-433-250" />
              <path opacity=".75" d="M600 1200H100" />
              <path opacity=".25" d="M2300 1200h-500" />
              <path opacity=".667" d="M680.4 1500l-433 250" />
              <path opacity=".167" d="M2152.6 650l-433 250" />
              <path opacity=".583" d="M900 1719.6l-250 433" />
              <path opacity=".083" d="M1750 247.4l-250 433" />
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                keyTimes="0;0.08333;0.16667;0.25;0.33333;0.41667;0.5;0.58333;0.66667;0.75;0.83333;0.91667"
                values="0 1199 1199;30 1199 1199;60 1199 1199;90 1199 1199;120 1199 1199;150 1199 1199;180 1199 1199;210 1199 1199;240 1199 1199;270 1199 1199;300 1199 1199;330 1199 1199"
                dur="0.83333s"
                begin="0s"
                repeatCount="indefinite"
                calcMode="discrete"
              />
            </g>
          </svg>
        </div>
      </>
    );

  return (
    <>
      <h2 className="font-semibold text-gray-600 text-md">
        {logged.me ? 'Suggestions for You' : 'Popular users'}
      </h2>
      <div className="flex flex-col mt-6 ml-2">
        {data!.suggestedUsers &&
          data!.suggestedUsers.map((user: any) => {
            return (
              <div className="flex justify-between w-full mb-2" key={user.id}>
                <Link href={`/${user!.username}`} passHref>
                  <a className="flex cursor-pointer">
                    <a className="relative w-8 h-8 mt-2 mr-2 rounded-full">
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
                    <div className="flex flex-col">
                      <a className="font-semibold text-black text-md">
                        {' '}
                        {`${user!.firstName} ${user!.lastName}`}
                      </a>
                      <a className="text-sm text-gray-600">@{user!.username}</a>
                    </div>
                  </a>
                </Link>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Suggestions;
