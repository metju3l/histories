import { Menu, Transition } from '@headlessui/react';
import LogOut from '@lib/functions/LogOut';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import UrlPrefix from 'shared/config/UrlPrefix';

import { LoginContext } from '../../Layouts';
import DropdownItem from '../Dropdown/DropdownItem';
import DropdownTransition from '../Dropdown/DropdownTransition';

const UserDropdown: React.FC = () => {
  const loginContext = React.useContext(LoginContext);

  const { t } = useTranslation();

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        as="div"
        className="relative w-8 h-8 border-2 border-transparent rounded-full cursor-pointer transition ease-in-out hover:border-gray-200"
      >
        <Image
          className="rounded-full gray-400"
          src={
            // if user has a profile picture add IPFS gateway to hash
            loginContext.data!.me!.profile.startsWith('http')
              ? loginContext.data!.me!.profile
              : UrlPrefix + loginContext.data!.me!.profile
          }
          layout="fill"
          objectFit="contain"
          loading='eager'
          objectPosition="center"
          alt="Profile picture"
          quality={40}
        />
      </Menu.Button>
      <Transition as={Fragment} {...DropdownTransition}>
        <Menu.Items
          as="div"
          className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
        >
          <DropdownItem
            text={loginContext.data!.me!.username}
            href={`/user/${loginContext.data!.me!.username}`}
            top
          />
          <DropdownItem text={t('create post')} href="/create/post" />
          <DropdownItem text={t('settings')} href="/settings" />
          <DropdownItem text={t('logout')} onClick={() => LogOut()} bottom />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
