import React from 'react';

export type UserHasNoPostsYetProps = { firstName: string };

const UserHasNoPostsYet: React.FC<UserHasNoPostsYetProps> = ({ firstName }) => {
  return (
    <span className="px-8">
      <div className="bg-white border dark:border-gray-800 dark:bg-gray-900 lg:rounded-lg md:rounded-lg sm:rounded-lg shadow-sm dark:shadow-md">
        <div className="p-5 ">
          <div className="grid justify-items-center space-y-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                className="w-8 h-8 text-brand-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <div>
              <div>
                <span>
                  {firstName} doesn{"'"}t have any posts yet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
  );
};

export default UserHasNoPostsYet;
