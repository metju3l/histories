import Head from 'next/head';
import { useEffect } from 'react';
import { supabase } from '../../utils/initSupabase';

const Log_in = () => {
  return (
    <>
      <Head>
        <title>log in</title>
        <meta name="description" content="login to histories" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Log_in;
