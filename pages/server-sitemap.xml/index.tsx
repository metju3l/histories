import { GetServerSideProps } from 'next';
import { gerServerSideSitemap, ISitemapField } from 'next-sitemap';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const fields: ISitemapField[] = [];

  return getServerSideProps(ctx, fields);
};

const Site = () => {};

export default Site;
