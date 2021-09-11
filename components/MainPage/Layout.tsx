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
    <body className="bg-[#DADADB] dark:bg-[#06080E]">
      <Navbar data={data} />
      <div className="flex text-black max-w-screen-xl m-auto">
        <div className="w-[30%] p-[1em]">
          <div className="sticky top-20">
            <Menu data={data} />
          </div>
        </div>
        <div className="w-[40%] p-[1em] mt-2">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
        {/* RIGHT COLUMN */}
        <div className="w-[30%] p-[1em]">
          <div className="sticky top-20">
            <div className="w-full p-[1em] bg-[#343233] rounded-xl text-white mb-8 ">
              <Suggestions data={data} suggestedUsers={suggestedUsers} />
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default Layout;
