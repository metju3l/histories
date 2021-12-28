import { hash } from 'bcryptjs';

import RunCypherQuery from '../../../database/RunCypherQuery';
import SendEmail from '../../../email/SendEmail';
import SignJWT from '../../../functions/SignJWT';

type CreateUserProps = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  emailSubscription: boolean;
};

const CreateUser = async ({
  username,
  firstName,
  lastName,
  email,
  password,
  emailSubscription,
}: CreateUserProps) => {
  // generate password hash
  const hashedPassword = await hash(
    password,
    parseInt(process.env.HASH_SALT || '10')
  );

  // authorization token for email verifiaction
  const authorizationToken = `${new Date().getTime()}`;

  const query = `
  CREATE (user:User {
    username : $username,
    firstName: $firstName,
    lastName: $lastName,
    
    email: $email,
    password: $hashedPassword,
    createdAt: $createdAt,

    verified: false,
    authorizationToken: $authorizationToken,  // token used to verify email address
    
    profile: $profile,
    profileBlurhash: "",
    
    locale: $locale,
    
    newFollowerNotification: $notifications,
    followingPlacePostNotification: $notifications,
    followingUserPostNotification: $notifications,
    newsletterNotification: $notifications
  })
  SET user.id = ID(user)
  RETURN user.id AS id
  `;

  const profile = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
    firstName
  )}%20${encodeURIComponent(lastName)}.svg`;

  const [user] = await RunCypherQuery({
    query,
    params: {
      username,
      firstName,
      lastName,
      email,
      hashedPassword,
      authorizationToken,
      createdAt: new Date().getTime(),
      profile: profile,
      locale: 'en',
      notifications: emailSubscription,
    },
  });

  // send email for verification
  await SendEmail(
    'Verify email',
    EmailContent({ token: authorizationToken, firstName, lastName }),
    email
  );

  return SignJWT(user.records[0].get('id'));
};

type EmailProps = {
  token: string;
  firstName: string;
  lastName: string;
};

const EmailContent = ({ token, firstName, lastName }: EmailProps): string => {
  // email content
  return `
  <div>
    Hey ${firstName},
    <br>
    Please verify your email address by clicking  
    <a href="https://www.histories.cc/verify?token=${token}">here</a>.
    If it wasn't you, please ifnore this email lmao.
    Enjoy using histories xdd 😎 
  </div>`;
};

export default CreateUser;
