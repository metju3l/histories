import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import NavbarItem from '../components/modules/navbar/NavbarItem';
import CityImage from '@public/assets/city.png';
import LogoBlack from '@public/logo/big-black.svg';

const AboutPage: React.FC = () => {
  return (
    <div>
      <nav className="fixed z-40 w-full bg-white border-b border-gray-200 dark:text-white dark:bg-[#171716] dark:border-gray-800">
        <div className="flex items-center justify-between h-full max-w-4xl px-4 pt-4 m-auto">
          <NavbarItem text="Home" href="/" active={false} />
        </div>
      </nav>
      <div className="absolute left-0 w-full h-screen z-[-10]">
        <Image
          src={CityImage}
          alt="city"
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          className="m-auto"
        />
      </div>

      <div className="max-w-6xl p-12 m-auto pt-36">
        <div className="relative flex justify-center h-16">
          <Image
            src={LogoBlack}
            alt="Histories logo"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* ABOUT */}
        <div className="flex flex-col items-center pt-20 text-6xl gap-6 pt-[50vh]">
          <h1 className="text-6xl font-semibold">About</h1>
        </div>
        <p className="pt-4 text-xl">
          Histories is a platform for sharing historical photos with advanced
          search and filtering. But we are not just a photo sharing platform. We
          are the community. If you want to explore amazing history of your
          city, let's join us! Also feel free to check out{' '}
          <Link href="/">
            <a className="text-brand">map</a>
          </Link>
          . If you have more questions about this project you can also check a{' '}
          <Link href="https://docs-histories.netlify.app/docs/intro/">
            <a className="text-brand">documentation</a>
          </Link>
          .
        </p>

        {/* ABOUT */}
        <div className="flex flex-col items-center pt-20 text-6xl gap-6">
          <h1 className="text-6xl font-semibold">Source code</h1>
        </div>
        <p className="pt-4 text-xl">
          Histories is entirely open source. You can find the{' '}
          <Link href="https://github.com/histories-cc/histories">
            <a className="text-brand">source code</a>
          </Link>{' '}
          on Github. If you want to report bug or request some feature, you can
          do it{' '}
          <Link href="https://github.com/histories-cc/histories/issues/new/choose">
            <a className="text-brand">here</a>
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
