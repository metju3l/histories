import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';

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
        <Menu.Items className="absolute z-[100] right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-2xl  focus:outline-none p-2">
          {items.map((item, index) => (
            <Menu.Item as="div" key={index} onClick={item.onClick}>
              {item.href ? (
                <Link href={item.href} passHref>
                  <button className="p-2 cursor-pointer hover:bg-[#EEF3F5] rounded-xl w-full">
                    {item.title}
                  </button>
                </Link>
              ) : (
                <button className="p-2 cursor-pointer hover:bg-[#EEF3F5] rounded-xl w-full">
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
