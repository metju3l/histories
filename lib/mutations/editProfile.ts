import RunCypherQuery from '@lib/database/RunCypherQuery';
import DbConnector from '../database/driver';

const EditProfile = async ({
  id,
  username,
  bio,
  firstName,
  lastName,
  email,
  password,
}: {
  id: number;
  username: string | undefined;
  bio: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
}): Promise<string> => {
  const query = `MATCH (user:User)
WHERE ID(user) = ${id}
${username !== undefined ? `SET user.username = "${username}"\n` : ''}${
    bio !== undefined ? `SET user.bio = "${bio}"\n` : ''
  }${firstName !== undefined ? `SET user.firstName = "${firstName}"\n` : ''}${
    lastName !== undefined ? `SET user.lastName = "${lastName}"\n` : ''
  }${email !== undefined ? `SET user.email = "${email}"\n` : ''}${
    password !== undefined ? `SET user.password = "${password}"\n` : ''
  }`;

  await RunCypherQuery(query);
  return 'Info edited succesfully';
};

export default EditProfile;
