import { signInAction } from '@/lib/actions/user.actions';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    // Parse the incoming JSON request body
    const { email, password } = await req.json();

    // Ensure that email and password are provided
    if (!email || !password) {
      return NextResponse.json({
        status: 400,
        message: 'Email and password are required',
      });
    }

    // Attempt to sign in the user with the provided credentials
    const user = await signInAction({ email, password });

    // Check if the user was found
    if (!user) {
      return NextResponse.json({
        status: 401,
        message: 'User not found or invalid credentials',
      });
    }

    // Return the user information upon successful sign-in
    return NextResponse.json({
      status: 200,
      user,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Sign-in error:', error);

    // Return a generic internal server error response
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
