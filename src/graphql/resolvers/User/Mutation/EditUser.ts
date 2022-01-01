import { UpdateProfileInput } from '../../../../../.cache/__types__';
import RunCypherQuery from '../../../../database/RunCypherQuery';

const EditUser = async (
  {
    username,
    bio,
    firstName,
    lastName,
    email,
    password,
    notificationSettings,
  }: UpdateProfileInput,
  id: number
): Promise<string> => {
  // generate query based on variables which are not null or undefined
  const query = `MATCH (user:User)
WHERE ID(user) = $userId
  ${typeof username === 'string' ? `SET user.username = $username\n` : ''}
  ${typeof bio === 'string' ? `SET user.bio = $bio\n` : ''}
  ${typeof firstName === 'string' ? `SET user.firstName = $firstName\n` : ''}
  ${typeof lastName === 'string' ? `SET user.lastName = $lastName\n` : ''}
  ${typeof email === 'string' ? `SET user.email = $email\n` : ''}
  ${typeof password === 'string' ? `SET user.password = $password\n` : ''}
  ${typeof email === 'string' ? `SET user.email = $email\n` : ''} 
  ${
    typeof notificationSettings?.newFollower === 'boolean'
      ? 'SET user.newFollowerNotification = $newFollower'
      : ''
  }
  ${
    typeof notificationSettings?.followingPlacePost === 'boolean'
      ? 'SET user.followingPlacePostNotification = $followingPlacePost'
      : ''
  }\n
  ${
    typeof notificationSettings?.followingUserPost === 'boolean'
      ? `SET user.followingUserPostNotification = $followingUserPost`
      : ''
  }\n
 ${
   typeof notificationSettings?.newsletter === 'boolean'
     ? 'SET user.newsletterNotification = $newsletter'
     : ''
 }\n
  `;

  await RunCypherQuery({
    query,
    params: {
      ...notificationSettings,
      username,
      firstName,
      lastName,
      email,
      password,
      bio,
      userId: id,
    },
  });
  return 'Info edited succesfully';
};

export default EditUser;
