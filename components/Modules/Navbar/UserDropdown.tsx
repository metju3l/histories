import { Menu, Transition } from '@headlessui/react';
import LogOut from '@lib/functions/LogOut';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import UrlPrefix from 'shared/config/UrlPrefix';

import { LoginContext } from '../../layouts';
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
          objectPosition="center"
          alt="Profile picture"
          quality={40}
        />
      </Menu.Button>
      <Transition as={Fragment} {...DropdownTransition}>
        <Menu.Items as="div" className="dropdown">
          <Link href={`/user/${loginContext.data!.me!.username}`} passHref>
            <Menu.Item as="div" className="rounded-t-lg dropdown-item">
              {loginContext.data!.me!.username}
            </Menu.Item>
          </Link>

          <Link href="/create/post" passHref>
            <Menu.Item as="div" className="dropdown-item">
              {t('create_post')}
            </Menu.Item>
          </Link>

          <Link href="/settings" passHref>
            <Menu.Item as="div" className="dropdown-item">
              {t('settings')}
            </Menu.Item>
          </Link>

          <Menu.Item
            as="div"
            className="rounded-b-lg dropdown-item"
            onClick={() => LogOut()}
          >
            {t('logout')}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserDropdown;
