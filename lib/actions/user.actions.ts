'use server';

import { signInProps, SignUpParams } from '@/types';
import { addUser, getUser } from '../db';
import { comparePasswords, saltAndHashPassword } from '../utils';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const signInAction = async ({ email, password }: signInProps) => {
  try {
    // Check user exist
    const user = await getUser(email);

    // Compare passwords
    if (user) {
      const res = await comparePasswords(password, user.password);
      if (res) {
        return user;
      }
    }
  } catch (error) {
    console.error('Error', error);
  }
};

export const signUpAction = async (userData: SignUpParams) => {
  const { email, password } = userData;

  try {
    // User exist?
    const user = await getUser(email);
    if (!user) {
      // Hash password
      const hashedPass = await saltAndHashPassword(password);

      if (hashedPass) {
        //  Store new user
        const res = await addUser({
          ...userData,
          password: hashedPass,
        });

        if (res?.acknowledged) {
          return {
            status: 201,
            message: res?.insertedId,
          };
        } else {
          throw new Error('Something went wrong from our end. Try again soon.');
        }
      }
    } else {
      return {
        status: 401,
        message: 'User with same credentials exists.',
      };
    }
  } catch (error) {
    console.error('Error', error);

    return {
      status: 500,
      message: error,
    };
  }
};

export async function getLoggedInUser() {
  try {
    const session = await auth();
    const loggedIn = session?.user;

    if (!loggedIn) {
      redirect('/sign-in');
    } else {
      return {
        $id: loggedIn?.id as string,
        name: loggedIn?.name as string,
        email: loggedIn?.email as string,
      };
    }
  } catch (error) {
    console.log(error);
    redirect('/sign-in');
  }
}

export const logoutAccount = async () => {
  try {
    // const { account } = await createSessionClient();
    // cookies().delete('appwrite-session');
    // await account.deleteSession('current');
  } catch (error) {
    console.log(error);
    return null;
  }
};
