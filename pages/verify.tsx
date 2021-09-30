import { Layout } from '@components/Layout';
import {
  useIsLoggedQuery,
  useVerifyTokenMutation,
} from '@graphql/user.graphql';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function Page() {
  const router = useRouter();
  const isLogged = useIsLoggedQuery();
  const [verifyToken] = useVerifyTokenMutation();
  const [isLoading, setIsLoading] = useState(false);

  if (isLogged.loading) return <div>loading</div>;

  if (router.query.token === undefined) return <div>check your email</div>;
  else
    return (
      <Layout dontRedirectUnverified title={''}>
        {isLoading ? (
          <Button loading loaderType="spinner" />
        ) : (
          <Button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              if (router.query.token !== undefined)
                try {
                  await verifyToken({
                    variables: { token: router.query.token.toString() },
                  });
                  toast.success('success');
                  router.replace('/login');
                } catch (error) {
                  // @ts-ignore
                  toast.error(error.message);
                }
              setIsLoading(false);
            }}
          >
            Authorize email
          </Button>
        )}
      </Layout>
    );
}
