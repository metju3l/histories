import { GetServerSidePropsContext } from 'next';
import { validate } from 'uuid';

import { SSRRedirect } from '..';

// get token from url query and validate it
// if invalid redirect to home
// else return token in props
async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.query.token; // get token from url query

  if (typeof token !== 'string') return SSRRedirect('/'); // validate token type
  if (!validate(token)) return SSRRedirect('/'); // validate UUID

  return { props: { token } }; // return token in props
}

export default getServerSideProps;
