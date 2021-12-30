import { Layout } from '@components/Layout';
import { useLoginMutation } from '@graphql/user.graphql';
import Cookie from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type Inputs = {
  login: string;
  password: string;
};

const Login: FC = () => {
  const [login] = useLoginMutation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      const result = await login({
        variables: {
          input: {
            username: data.login,
            password: data.password,
          },
        },
      });
      if (result.data?.login !== 'error') {
        // login successful
        Cookie.set('jwt', result.data?.login as string, {
          sameSite: 'strict',
        });
        Router.reload();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  async function GoogleSubmit(
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) {
    if ('tokenId' in response)
      try {
        const result = await login({
          variables: {
            input: {
              googleJWT: response.tokenId,
            },
          },
        });
        if (result.data?.login !== 'error') {
          // login successful
          Cookie.set('jwt', result.data?.login as string, {
            sameSite: 'strict',
          });
          Router.reload();
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    else toast.error('Google login failed');
  }

  return (
    <Layout
      redirectLogged
      head={{
        title: `Log in | HiStories`,
        description: `Log in to your HiStories account`,
        canonical: 'https://www.histories.cc/login',
        openGraph: {
          title: `Log in | HiStories`,
          type: 'website',
          url: 'https://www.histories.cc/login',
          description: `Log in to your HiStories account`,
          site_name: 'Log in page',
        },
      }}
    >
      <div className="p-10 m-auto max-w-[27rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <h4 className="pt-0 pb-2 font-medium text-gray-600">
              {t('username or email')}
            </h4>
            <input
              className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
              type="text"
              {...register('login', { required: true })}
            />
          </div>
          <div>
            <h4 className="pt-0 pb-2 font-medium text-gray-600">
              {t('password')}
            </h4>
            <input
              className="w-full px-2 text-gray-600 border border-gray-300 outline-none rounded-md focus:border-gray-500 py-1.5"
              type="password"
              {...register('password', { required: true })}
            />
          </div>
          <button
            type="submit"
            className="block px-4 mt-6 font-medium bg-gray-800 border border-gray-800 py-1.5 rounded-md text-gray-50"
          >
            {t(loading ? 'loading' : 'login')}
          </button>
          {
            // show login with google only if google client id is set
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                render={(renderProps) => (
                  <WithGoogle renderProps={renderProps} />
                )}
                buttonText="Login"
                onSuccess={GoogleSubmit}
                onFailure={() => toast.error('Google login failed')}
                cookiePolicy={'single_host_origin'}
              />
            )
          }

          <Link href="/register">
            <a className="pl-2 underline">{t('create new account')}</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

const WithGoogle: React.FC<{
  renderProps: {
    onClick: () => void;
    disabled?: boolean | undefined;
  };
}> = ({ renderProps }) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={renderProps.onClick}
      disabled={renderProps.disabled}
      type="submit"
      className="flex items-center justify-center px-4 mt-6 font-medium text-black bg-white border border-gray-800 gap-1 py-1.5 rounded-md"
    >
      <Image
        src="/assets/google.svg"
        height={18}
        width={18}
        alt="google logo"
        quality={60}
      />

      <a>{t('login')}</a>
    </button>
  );
};

export default Login;
