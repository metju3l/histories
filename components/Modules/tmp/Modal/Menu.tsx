import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import React from 'react';

type MenuProps = {
  items: { title: string; onClick?: () => void; href?: string }[];
};

const MenuComponent: React.FC<MenuProps> = ({ items, children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left z-[100]">
      <Menu.Button>{children}</Menu.Button>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 p-2 mt-2 bg-white shadow-2xl z-[100] origin-top-right divide-y divide-gray-100 rounded-xl focus:outline-none">
          {items.map((item, index) => (
            <Menu.Item as="div" key={index} onClick={item.onClick}>
              {item.href ? (
                <Link href={item.href} passHref>
                  <button className="w-full p-2 cursor-pointer hover:bg-[#EEF3F5] rounded-xl">
                    {item.title}
                  </button>
                </Link>
              ) : (
                <button className="w-full p-2 cursor-pointer hover:bg-[#EEF3F5] rounded-xl">
                  <a className="w-full">{item.title}</a>
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default MenuComponent;
