import DbConnector from '../database/driver';
import { CheckCredentials, UserExists } from '../validation';

const EditProfile = async ({
  logged,
  username,
  bio,
  firstName,
  lastName,
  email,
  password,
}: {
  logged: string;
  username: string | undefined;
  bio: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  password: string | undefined;
}): Promise<string> => {
  const query = `MATCH (n:User)
WHERE n.username = "${logged}"
${username !== undefined ? `SET n.username = "${username}"\n` : ''}${
    bio !== undefined ? `SET n.bio = "${bio}"\n` : ''
  }${firstName !== undefined ? `SET n.firstName = "${firstName}"\n` : ''}${
    lastName !== undefined ? `SET n.lastName = "${lastName}"\n` : ''
  }${email !== undefined ? `SET n.email = "${email}"\n` : ''}${
    password !== undefined ? `SET n.password = "${password}"\n` : ''
  }`;

  const driver = DbConnector();
  const session = driver.session();

  await session.run(query);
  driver.close();

  return 'profile updated';
};

export default EditProfile;
