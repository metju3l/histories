import React from 'react';

const UserHasNoPostsYet: React.FC = ({ children }) => {
  return (
    <span className="px-8">
      <div className="bg-white border dark:border-gray-800 dark:bg-gray-900 lg:rounded-lg md:rounded-lg sm:rounded-lg shadow-sm dark:shadow-md">
        <div className="p-5 ">
          <div className="grid justify-items-center space-y-2">{children}</div>
        </div>
      </div>
    </span>
  );
};

export default UserHasNoPostsYet;
