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
}): Promise<void> => {
  const query = `MATCH (n:User)
WHERE ID(n) = ${id}
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
};

export default EditProfile;
