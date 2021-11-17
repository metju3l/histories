import { Layout } from '@components/Layout';
import SubmitButton from '@components/LoadingButton/SubmitButton';
import { useLoginMutation } from '@graphql/user.graphql';
import Cookie from 'js-cookie';
import Link from 'next/link';
import Router from 'next/router';
import React, { FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Login: FC = () => {
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const formInputs = {
    username: '',
    password: '',
  };

  const [formValues, setFormValues] = useState(formInputs);

  return (
    <Layout redirectLogged title={'login | hiStories'}>
      <div className="p-10 m-auto max-w-[27rem]">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setIsLoading(true);
            try {
              const result = await login({
                variables: formValues,
              });
              if (result.data?.login !== 'error') {
                // login successful
                Cookie.set('jwt', result.data?.login as string, {
                  sameSite: 'strict',
                });
                Router.reload();
              }
            } catch (error) {
              // @ts-ignore
              toast.error(error.message);
            }
            setIsLoading(false);
          }}
        >
          <FormInput
            placeholder="username or email"
            type="text"
            value={formValues.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, username: e.target.value });
            }}
          />

          <FormInput
            placeholder="password"
            type="password"
            value={formValues.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormValues({ ...formValues, password: e.target.value });
            }}
          />

          <div className="pt-2 mb-2">
            <SubmitButton isLoading={isLoading} text="Log in" />
          </div>
          <Link href="/register">
            <a className="pl-2 underline">create new account</a>
          </Link>
        </form>
      </div>
    </Layout>
  );
};

const FormInput = (props: any) => {
  return (
    <div className="w-full mb-2">
      <input
        {...props}
        className="w-full h-10 px-3 mt-2 mb-1 leading-tight text-gray-700 border rounded-lg shadow appearance-none focus:outline-none focus:shadow-outline"
        required={true}
        type={props.type ?? 'text'}
      />
    </div>
  );
};

export default Login;
