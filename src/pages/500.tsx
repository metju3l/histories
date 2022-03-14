import { Button } from '@components/elements';
import { Layout } from '@components/layouts';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import PragueCastlePhoto from 'public/assets/prague-castle.jpg';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactMapGL, { Marker } from 'react-map-gl';

const Error404Page: React.FC = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  return (
    <Layout
      head={{
        title: `${t('unexpected_server_error')} | Histories`,
        description: `Create new collection or post`,
        canonical: 'https://www.histories.cc/create/',
        openGraph: {
          title: `Create | Histories`,
          type: 'website',
          url: 'https://www.histories.cc/500',
          description: `Create new collection or post`,
          site_name: 'Create page',
        },
      }}
    >
      <div className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full bg-white/60 dark:bg-black/60 gap-6">
        <h1 className="text-3xl font-semibold">
          {t('unexpected_server_error')}
        </h1>
        <Link href="/" passHref>
          <Button>{t('refresh')}</Button>
        </Link>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-200">
        <ReactMapGL
          width="100%"
          height="100%"
          pitch={47}
          bearing={20}
          className="relative rounded-lg"
          mapStyle={`mapbox://styles/mapbox/${
            resolvedTheme === 'dark' ? 'dark' : 'light'
          }-v10`}
          latitude={50.0911474}
          longitude={14.4019565}
          zoom={16.71}
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
          <Marker latitude={50.091} longitude={14.4007}>
            <div className="relative text-gray-100 bg-white border border-gray-200 rounded-lg shadow-xl w-[200px] h-[300px] -translate-x-1/2 -translate-y-full">
              <Image
                src={PragueCastlePhoto}
                width="100%"
                height="100%"
                alt="Prague castle"
                layout="fill"
                objectFit="cover"
                quality={10}
                className="rounded-lg grayscale"
              />
              <svg
                className="absolute -bottom-[27px] left-1/2 -translate-x-1/2"
                width="72"
                height="27"
                viewBox="0 0 72 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36 27L0.492958 0L71.507 0L36 27Z"
                  stroke="rgb(229 231 235)"
                  fill="currentColor"
                />
              </svg>
            </div>
          </Marker>
        </ReactMapGL>
      </div>
    </Layout>
  );
};

export default Error404Page;
