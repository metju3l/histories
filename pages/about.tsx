import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { AiFillAndroid } from 'react-icons/ai';

import NavbarItem from '../components/Modules/Navbar/NavbarItem';
import IphoneImage from '../public/assets/iphone.png';
import NotebookImage from '../public/assets/notebook.png';
import AndroidImage from '../public/assets/pixel.png';
import TabletImage from '../public/assets/tablet.png';
import LogoWhite from '../public/logo/big-black.svg';

const AboutPage: React.FC = () => {
  return (
    <div>
      <nav className="fixed z-40 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800">
        <div className="flex items-center justify-between h-full max-w-4xl px-4 pt-4 m-auto">
          <NavbarItem text="Home" href="/" active={false} />
        </div>
      </nav>
      <div className="p-12 pt-36 max-w-6xl m-auto">
        <div className="relative flex justify-center h-16">
          <Image
            src={LogoWhite}
            alt="Histories logo"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* ABOUT */}
        <div className="flex text-6xl pt-20 flex-col items-center gap-6">
          <h1 className="text-6xl font-semibold">About</h1>
        </div>
        <p className="pt-4 text-xl">
          Histories is a platform for sharing historical photos with advanced
          search and filtering. But we are not just a photo sharing platform. We
          are the community. If you want to explore amazing history of your
          city, let's join us! Also feel free to check out{' '}
          <Link href="/map">
            <a className="text-brand">map</a>
          </Link>
          . If you have more questions about this project you can also check a{' '}
          <Link href="/faq">
            <a className="text-brand">documentation</a>
          </Link>
          .
        </p>
        {/* DOWNLAOD */}
        <div className="flex text-6xl pt-20 flex-col items-center gap-6">
          <h1 className="text-6xl font-semibold">Download</h1>
          <h3 className="text-4xl">Use Histories anytime anywhere</h3>
        </div>
        {/* DOWNLOAD GRID */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 pt-20">
          {/* WEB APP */}
          <div className="flex items-center flex-col gap-8">
            {/* HEADING */}
            <h2 className="text-4xl">Web App</h2>

            {/* IAMGE */}
            <div className="relative w-full h-80">
              <Image
                src={TabletImage}
                alt="tablet"
                placeholder="blur"
                layout="fill"
                objectFit="contain"
              />
            </div>

            {/* BUTTON */}
            <Link href="/" passHref>
              <button className="bg-gradient-to-br text-lg from-[#ff9a00] to-[#ff7300] text-white font-semibold py-2 px-6 rounded-xl min-w-[150px]">
                Go to website
              </button>
            </Link>
          </div>

          {/* DESKTOP */}
          <div className="flex items-center flex-col gap-8">
            {/* HEADING */}
            <h2 className="text-4xl">Desktop</h2>

            {/* IAMGE */}
            <div className="relative w-full h-80">
              <Image
                src={NotebookImage}
                alt="tablet"
                placeholder="blur"
                layout="fill"
                objectFit="contain"
              />
            </div>

            {/* BUTTON */}
            <button className="bg-gradient-to-br text-lg from-[#ff9a00] to-[#ff7300] text-white font-semibold py-2 px-6 rounded-xl min-w-[150px]">
              Install
            </button>
          </div>

          {/* MOBILE */}
          <div className="flex items-center flex-col gap-8">
            {/* HEADING */}
            <h2 className="text-4xl">Mobile</h2>

            {/* IAMGE */}
            <div className="grid grid-cols-2 h-80 w-full">
              <div className="relative w-full h-80">
                <Image
                  placeholder="blur"
                  src={IphoneImage}
                  alt="tablet"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div className="relative w-full h-80">
                <Image
                  src={AndroidImage}
                  placeholder="blur"
                  alt="tablet"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button className="flex text-lg items-center gap-1 bg-gradient-to-br from-[#ff9a00] to-[#ff7300] text-white font-semibold py-2 px-6 rounded-xl min-w-[150px]">
              <AiFillAndroid className="w-6 h-6" /> In progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
