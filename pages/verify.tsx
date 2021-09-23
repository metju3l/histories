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
  if (isLogged.data!.isLogged || router.query.token === undefined)
    router.replace('/');

  return (
    <>
      {isLoading ? (
        <Button loading loaderType="spinner" />
      ) : (
        <Button
          type="submit"
          onClick={async () => {
            if (router.query.token !== undefined)
              try {
                await verifyToken({
                  variables: { token: router.query.token[0] },
                });
              } catch (error) {
                // @ts-ignore
                toast.error(error.message);
              }
          }}
        >
          Authorize email
        </Button>
      )}
    </>
  );
}
