import { Menu } from '@headlessui/react';
import worldMap from '@public/worldMap.png';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FaLanguage } from 'react-icons/fa';
import { IoLogoWordpress } from 'react-icons/io';

const Home: FC = () => {
  return (
    <>
      <Head>
        <title>About hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <body className="font-inter ">
        <ul className="fixed top-0 z-20 w-full text-white bg-black bg-opacity-50 backdrop-filter backdrop-blur-md">
          <Link href="/" passHref>
            <li className="float-left px-4 ml-8 active py-1.5">
              <a className="text-center display-block">
                <IoLogoWordpress size={42} />{' '}
                {/* hope that oonce here will be some normal logo xdd :(*/}
              </a>
            </li>
          </Link>
          <Link href="/" passHref>
            <li className="float-left px-4 py-4 active">
              <a className="text-center display-block">About</a>
            </li>
          </Link>
          <Link href="/" passHref>
            <li className="float-left px-4 py-4 active">
              <a className="text-center display-block">Idea behind this</a>
            </li>
          </Link>
          <Link href="/" passHref>
            <li className="float-left px-4 py-4 active">
              <a className="text-center">Explore map</a>
            </li>
          </Link>{' '}
          <Link href="/" passHref>
            <li className="float-left px-4 py-4 active">
              <a className="text-center">Development</a>
            </li>
          </Link>
          <li className="float-right py-1 mr-8 active">
            <a className="text-center">
              <Menu>
                <Menu.Button>
                  <FaLanguage size={42} />
                </Menu.Button>
                <Menu.Items className="absolute flex-col px-4 py-2 mt-2 text-blue-500 bg-white shadow-custom rounded-xl right-8 top-18 display-flex">
                  <div className="cursor-pointer py-1.5 hover:text-green-400">
                    Česky
                  </div>
                  <div className="cursor-pointer py-1.5 hover:text-green-400">
                    Slovensky
                  </div>
                  <div className="cursor-pointer py-1.5 hover:text-green-400">
                    English
                  </div>
                  <div className="cursor-pointer py-1.5 hover:text-green-400">
                    Español
                  </div>
                </Menu.Items>
              </Menu>
            </a>
          </li>
        </ul>
        <div>
          <section className="h-screen pt-64 bg-darkGray">
            <h1 className="w-2/3 m-auto font-bold text-center text-white text-9xl">
              hiStories
            </h1>
            <h2 className="w-2/3 m-auto text-4xl text-center text-lightGray">
              share history with the whole world idk just placeholder
            </h2>
          </section>{' '}
          <section className="min-h-screen pt-64 bg-white">
            <h1 className="w-2/3 m-auto font-bold text-center text-black text-9xl">
              A New Kind of Social site
            </h1>
            <h2 className="w-2/3 m-auto text-4xl font-bold text-center text-lightGray font">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consequatur nulla, fuga
            </h2>
            <p className="w-2/3 m-auto text-xl text-center text-lightGray">
              More Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Totam, obcaecati aut sunt sequi tempora provident iste accusantium
              ea vitae ipsam quas veritatis voluptates molestias aperiam, ab
              deleniti tempore eos minima adipisci! Quod quaerat labore odio
              quibusdam accusamus, in earum assumenda error, explicabo ullam
              <br />
              <button className="px-6 py-2 mt-12 text-xl text-white bg-blue-500 rounded-xl">
                Browse photos
              </button>
            </p>
            <div className="relative z-10 w-3/4 py-48 m-auto mt-12 text-xl text-center text-white rounded-2xl top-32">
              <Link href="/" passHref>
                <Image
                  src={worldMap}
                  alt="world map picture"
                  className="rounded-2xl "
                  layout="fill"
                  objectFit="cover"
                />
              </Link>
            </div>
          </section>
          <section className="w-full pt-64 pb-10 text-white bg-black display-block">
            <h1 className="w-2/3 m-auto font-bold text-center text-9xl">
              I already do not know what to write here
            </h1>
          </section>
        </div>
        <footer
          className="pl-12 text-white py-14"
          style={{ backgroundColor: '#141617' }}
        >
          <div className="w-full display-flex">
            <a className="mr-8">
              <Link href="/">Privacy Policy</Link>
            </a>
            <a className="mr-8">
              <Link href="/">Terms</Link>
            </a>
            <a className="mr-8">
              <Link href="/">Cookies</Link>
            </a>
            <a className="mr-8">
              <Link href="/">Contact us</Link>
            </a>
          </div>
          <br />
          <span className="pt-24 display-flex">
            <div className="inline-flex">
              © 2021
              <Link href="https://www.github.com/krystofex">
                <a className="ml-1">Kryštof Krátký</a>
              </Link>
              <Link href="https://www.github.com/krystofex" passHref>
                <AiFillGithub size={20} className="ml-2" />
              </Link>
            </div>
          </span>
        </footer>
      </body>
    </>
  );
};

export default Home;
