import { signInAction, signUpAction } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const data = await req.json();
  console.log('Data', data);
  if (data.firstName) {
    try {
      const res = await signUpAction(data);

      if (res?.status === 201) {
        return NextResponse.json({
          ...res,
        });
      }
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
