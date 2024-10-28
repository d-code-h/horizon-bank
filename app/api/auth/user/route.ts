// pages/api/auth/user.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
import { signInAction, signUpAction } from '@/lib/actions/user.actions';
// import { getUser } from '@/lib/db';
import { NextResponse } from 'next/server';

interface ResType {
  status: string;
  message: string | unknown;
}

export const POST = async (req: Request) => {
  const data = await req.json();

  if (data.firstName) {
    try {
      const res: ResType = await signUpAction(data);

      return NextResponse.json({
        ...res,
      });
      // switch (res.status) {
      //   case 201:
      //     // Return user data
      //     return NextResponse.json({
      //       status: 200,
      //       res,
      //     });
      //   case 500:
      //     return NextResponse.json({
      //       status: 401,
      //       message: 'User not found or invalid credentails',
      //     });
      // }
      // if (!res) {
      //   return NextResponse.json({
      //     status: 401,
      //     message: 'User not found or invalid credentails',
      //   });
      // }
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  } else {
    // Sign in logics
    const { email, password } = data;

    try {
      // Fetch user from your database
      // const user = await getUser({ email, password });
      const user = await signInAction({ email, password });

      if (!user) {
        return NextResponse.json({
          status: 401,
          message: 'User not found or invalid credentails',
        });
      }

      // Return user data
      return NextResponse.json({
        status: 200,
        user,
      });
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        status: 500,
        message: 'Internal Server Error',
      });
    }
  }
};
