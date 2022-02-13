import MainLayout from '@components/layouts/Main';
import PageNotFoundTemplate from '@components/templates/PageNotFound';
import React from 'react';

const PageNotFound: React.FC = () => {
  return (
    <MainLayout
      head={{
        title: `Page not found | HiStories`,
        description: `Page not found`,
        canonical: 'https://www.histories.cc/404',
        openGraph: {
          title: `Page not found | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/404',
          description: `Page not found`,
          site_name: '404',
        },
      }}
    >
      <PageNotFoundTemplate />
    </MainLayout>
  );
};

export default PageNotFound;
