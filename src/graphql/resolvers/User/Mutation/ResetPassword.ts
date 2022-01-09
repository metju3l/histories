import RunCypherQuery from '../../../../database/RunCypherQuery';
import { hash } from 'bcryptjs';
import { validate } from 'uuid';

const ResetPassword = async (token: string, newPassword: string) => {
  if (!validate(token)) throw new Error('Invalid token');

  // generate password hash
  const hashedPassword = await hash(
    newPassword,
    parseInt(process.env.HASH_SALT || '10')
  );

  // cypher query
  const query = `
    MATCH (user:User {passwordResetToken: $token})  // match user with same token
    SET user.password = $newPassword,               // update password
        user.passwordResetToken = null              // delete user's token
    RETURN user{.*} as user                         // return user
  `;

  // run query
  const [result] = await RunCypherQuery({
    query,
    params: {
      token,
      newPassword: hashedPassword,
    },
  });

  // if there is no user with this passwordResetToken
  if (result.records[0] === undefined) throw new Error('Invalid token');
  else return 'Password changed successfully';
};

export default ResetPassword;
