import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { toast } from 'react-hot-toast';

import { LoginContext } from '../../../pages/_app';
import DropdownItem from '../Dropdown/DropdownItem';
import DropdownTransition from '../Dropdown/DropdownTransition';

export type OptionsMenuProps = {
  id: number;
  author: {
    id: number;
  };
};

const OptionsMenu: React.FC<OptionsMenuProps> = ({ author, id, children }) => {
  const loginContext = React.useContext(LoginContext);

  return (
    <Menu as="div" className="relative">
      <Menu.Button as="div" className="flex items-center gap-2">
        {children}
      </Menu.Button>
      <Transition as={Fragment} {...DropdownTransition}>
        <Menu.Items
          as="div"
          className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
        >
          {loginContext.data?.me?.id === author.id ? (
            <>
              {/* REPORT */}
              <DropdownItem text="Delete post" top />
            </>
          ) : (
            loginContext.data?.me?.id && (
              <>
                {/* REPORT */}
                <DropdownItem text="Report" top />

                {/* UNFOLLOW */}
                <DropdownItem text="Unfollow" />
              </>
            )
          )}
          {/* GO TO POST */}
          <Menu.Item>
            <DropdownItem
              text="Go to post"
              href={`/post/${id}`}
              top={!loginContext.data?.me?.id}
            />
          </Menu.Item>

          {/* COPY LINK */}
          <Menu.Item>
            <DropdownItem
              text="Copy link"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://www.histories.cc/post/${id}`
                );
                toast.success('Link copied to clipboard');
              }}
            />
          </Menu.Item>

          {/* CANCEL */}
          <Menu.Item>
            <DropdownItem text="Cancel" onClick={() => {}} bottom />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default OptionsMenu;
