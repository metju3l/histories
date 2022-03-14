import { Layout } from '@components/layouts';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { HiCollection, HiFolderOpen } from 'react-icons/hi';

const CreatePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout
      head={{
        title: `Create | Histories`,
        description: `Create new collection or post`,
        canonical: 'https://www.histories.cc/create/',
        openGraph: {
          title: `Create | Histories`,
          type: 'website',
          url: 'https://www.histories.cc/create/',
          description: `Create new collection or post`,
          site_name: 'Create page',
        },
      }}
    >
      <div className="flex flex-col w-full max-w-6xl px-6 m-auto mt-6 mt-24 gap-4">
        <span>{t('create_page_description')}</span>
        <Link href="/create/post" passHref>
          <div className="flex items-center px-4 py-1 text-lg font-semibold text-gray-700 border border-gray-200 rounded-lg cursor-pointer gap-2 hover:bg-gray-200 w-fit">
            <HiFolderOpen className="w-4 h-4" />
            {t('create_post')}
          </div>
        </Link>
        <Link href="/create/collection" passHref>
          <div className="flex items-center px-4 py-1 text-lg font-semibold text-gray-700 border border-gray-200 rounded-lg cursor-pointer gap-2 hover:bg-gray-200 w-fit">
            <HiCollection className="w-4 h-4" />
            {t('create_collection')}
          </div>
        </Link>
      </div>
    </Layout>
  );
};

export default CreatePage;
