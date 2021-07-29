import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import worldMap from '@public/worldMap.png';
import { FaLanguage } from 'react-icons/fa';
import { IoLogoWordpress } from 'react-icons/io';
import { AiFillGithub } from 'react-icons/ai';
import Link from 'next/link';
import { Menu } from '@headlessui/react';

const Home = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>About hiStories</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="hiStories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-inter ">
        <ul className="bg-opacity-50 backdrop-filter text-white backdrop-blur-md bg-black w-full fixed top-0 z-20">
          <Link href="/">
            <li className="active py-1.5 px-4 ml-8 float-left">
              <a className="text-center display-block">
                <IoLogoWordpress size={42} />{' '}
                {/* hope that oonce here will be some normal logo xdd :(*/}
              </a>
            </li>
          </Link>
          <Link href="/">
            <li className="active py-4 px-4 float-left">
              <a className="text-center display-block">About</a>
            </li>
          </Link>
          <Link href="/">
            <li className="active py-4 px-4 float-left">
              <a className="text-center display-block">Idea behind this</a>
            </li>
          </Link>
          <Link href="/">
            <li className="active py-4 px-4 float-left">
              <a className="text-center">Explore map</a>
            </li>
          </Link>{' '}
          <Link href="/">
            <li className="active py-4 px-4 float-left">
              <a className="text-center">Development</a>
            </li>
          </Link>
          <li className="active py-1 mr-8 float-right">
            <a className="text-center">
              <Menu>
                <Menu.Button>
                  <FaLanguage size={42} />
                </Menu.Button>
                <Menu.Items className="shadow-custom absolute bg-white text-blue-500 rounded-xl px-4 py-2 right-8 top-18 mt-2 display-flex flex-col">
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    Česky
                  </div>
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    Slovensky
                  </div>
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    English
                  </div>
                  <div className="py-1.5 hover:text-green-400 cursor-pointer">
                    Español
                  </div>
                </Menu.Items>
              </Menu>
            </a>
          </li>
        </ul>
        <div>
          <section className="h-screen bg-darkGray pt-64">
            <h1 className="text-center font-bold text-white text-9xl m-auto w-2/3">
              hiStories
            </h1>
            <h2 className="text-center text-lightGray text-4xl w-2/3 m-auto ">
              share history with the whole world idk just placeholder
            </h2>
          </section>{' '}
          <section className="min-h-screen bg-white pt-64">
            <h1 className="text-center font-bold text-black text-9xl m-auto w-2/3">
              A New Kind of Social site
            </h1>
            <h2 className="text-center text-lightGray font-bold text-4xl font w-2/3 m-auto ">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Consequatur nulla, fuga
            </h2>
            <p className="text-center text-lightGray text-xl w-2/3 m-auto">
              More Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              Totam, obcaecati aut sunt sequi tempora provident iste accusantium
              ea vitae ipsam quas veritatis voluptates molestias aperiam, ab
              deleniti tempore eos minima adipisci! Quod quaerat labore odio
              quibusdam accusamus, in earum assumenda error, explicabo ullam
              <br />
              <button className="text-white bg-blue-500 rounded-xl text-xl px-6 py-2 mt-12">
                Browse photos
              </button>
            </p>
            <div className="text-white text-center z-10 w-3/4 m-auto rounded-2xl text-xl py-48 mt-12 relative top-32">
              <Link href="/">
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
          <section className="bg-black text-white pt-64 w-full pb-10 display-block">
            <h1 className="text-center font-bold text-9xl m-auto w-2/3">
              I already do not know what to write here
            </h1>
          </section>
        </div>
        <footer
          className="text-white py-14 pl-12"
          style={{ backgroundColor: '#141617' }}
        >
          <div className="display-flex w-full">
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
              <Link href="https://www.github.com/krystofex">
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
