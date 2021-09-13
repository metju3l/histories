import { Navbar } from '@components/Navbar';
import {
  useIsLoggedQuery,
  useSuggestedUsersQuery,
} from '@graphql/user.graphql';
import React, { FC } from 'react';

import Suggestions from './RightColumn/Suggestions';
import Menu from './LeftColumn/Menu';
import Post from '@components/Post/Post';

const Layout: FC = () => {
  const { data, loading, error } = useIsLoggedQuery();
  const suggestedUsers = useSuggestedUsersQuery();

  if (loading) return <div>loading</div>;
  if (error) return <div>error</div>;
  if (suggestedUsers.data) console.log(suggestedUsers.data);

  return (
    <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <Navbar data={data} />
      <div className="flex max-w-screen-xl m-auto">
        <div className="w-[30%] p-[1em] hidden xl:block">
          <div className="sticky top-20">
            <Menu data={data} />
          </div>
        </div>
        <div className="xl:w-[40%] md:w-[60%] w-full p-[1em] mt-2">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
        {/* RIGHT COLUMN */}
        <div className="w-[40%] xl:w-[30%] p-[1em] hidden md:block">
          <div className="sticky top-20">
            <div className="w-full p-[1em] bg-white shadow-lg dark:bg-[#343233] rounded-xl text-text-light dark:text-white mb-8 ">
              <Suggestions data={data} suggestedUsers={suggestedUsers} />
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Layout;
