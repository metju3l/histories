import axios from 'axios';
import { sign } from 'jsonwebtoken';

import RunCypherQuery from '../../../database/RunCypherQuery';
import { UploadPhoto } from '../../../IPFS';

function SignJWT(id: string) {
  // create and return jwt
  return sign(
    // JWT payload
    {
      id,
    },
    process.env.JWT_SECRET!, // JWT secret
    {
      expiresIn: '360min', // JWT token expiration
    }
  );
}

async function RegisterWithGooge(googleJWT: string) {
  const query = `
    CREATE (user:User {
      googleID: $googleID,
      username : $username,
      firstName: $firstName,
      lastName: $lastName,
      email: $email, 
      createdAt: $createdAt,
      verified: true, 
      locale: $locale,
      newFollowerNotification: true,
      followingPlacePostNotification: true,
      followingUserPostNotification: true,
      newsletterNotification: true,
      profile: $profile,
      profileBlurhash: $profileBlurhash
    })
    SET user.id = ID(user)
    RETURN user.id AS id
    `;

  try {
    // validate token
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${googleJWT}`
    );

    const [existingUser] = await RunCypherQuery({
      query: `MATCH (user:User)
              WHERE user.googleID = $googleID
                OR user.email =~ $email   
              RETURN user{.*} AS user`,
      params: {
        googleID: res.data.sub,
        email: res.data.email,
      },
    });

    // if there is some user with same email or googleID
    if (existingUser.records.length > 0) {
      // if user has same googleID return JWT
      if (existingUser.records[0].get('user').googleID == res.data.sub)
        return SignJWT(existingUser.records[0].get('user').id);
      else throw new Error('User with same email already exists');
    }

    // if there is no user with same email or googleID create user and return JWT
    else {
      const response = await axios.get(res.data.picture, {
        responseType: 'arraybuffer',
      });
      const profileImage = await Buffer.from(response.data, 'utf-8');
      const profile = await UploadPhoto(profileImage);

      const date = new Date().getTime().toString();
      // get user data from neo4j
      const [userInfo] = await RunCypherQuery({
        query,
        params: {
          googleID: res.data.sub,
          username: `${res.data.given_name}${date.substring(date.length - 6)}`, // generate unique username
          firstName: res.data.given_name,
          lastName: res.data.family_name,
          email: res.data.email,
          createdAt: new Date().getTime(),
          verified: true,
          locale: res.data.locale,
          profile: profile.url,
          profileBlurhash: profile.blurhash,
        },
      });
      return SignJWT(userInfo.records[0].get('id'));
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export default RegisterWithGooge;
