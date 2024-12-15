'use client';

import Image from 'next/image'; // Importing Image component from Next.js for optimized image handling.
import Link from 'next/link'; // Importing Link component for client-side navigation.
import { useState } from 'react'; // Importing useState to manage component state.
import { Form } from '@/components/ui/form'; // Importing Form component for form handling.
import CustomInput from './CustomInput'; // Importing custom input component.
import { zodResolver } from '@hookform/resolvers/zod'; // Importing resolver to integrate Zod schema with react-hook-form.
import { useForm } from 'react-hook-form'; // Importing react-hook-form for form state management.
import { z } from 'zod'; // Importing Zod for schema validation.
import { Button } from './ui/button'; // Importing Button component for form submission.
import { Loader2 } from 'lucide-react'; // Importing Loader2 for loading spinner.
import { useRouter } from 'next/navigation'; // Importing useRouter for navigation handling.
import { authFormSchema } from '@/lib/utils'; // Importing validation schema for authentication form.
import { getSession, signIn } from 'next-auth/react'; // Importing NextAuth methods for authentication.
import PlaidLink from './PlaidLink'; // Importing PlaidLink component for linking accounts.
import { signUpAction } from '@/lib/actions/user.actions'; // Importing sign-up action from user actions.
import { toast, Bounce } from 'react-toastify';

const AuthForm = ({ type }: { type: 'sign-in' | 'sign-up' }) => {
  const [user, setUser] = useState<
    (User & { password?: string | undefined }) | null
  >(null); // State to manage user data.
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state during form submission.
  const router = useRouter(); // Router for navigation after successful authentication.

  const formSchema = authFormSchema(type); // Getting the appropriate form schema based on the type (sign-up or sign-in).

  // Using react-hook-form with Zod schema resolver to manage form state and validation.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Function to handle form submission.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true); // Set loading to true to show loading state.
    try {
      if (type === 'sign-up') {
        try {
          // Handle sign-up action
          const res = await signUpAction(data as SignUpParams);

          if (res?.status === 201) {
            setUser(() => {
              // Set user data after successful sign-up.
              return {
                ...res.user,
                password: data.password,
              } as User & { password?: string };
            });
          } else {
            Error('Error', res?.message as ErrorOptions); // Handle error during sign-up.
          }
        } catch (error) {
          toast.error(error as string, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          });
          console.log(error); // Log error if sign-up fails.
        }
      }
      if (type === 'sign-in') {
        // Handle sign-in action
        const response = await signIn('credentials', {
          ...data,
          redirect: false,
        });

        if (response?.error) {
          // Show error message if sign-in fails.
          toast.error('User not found or invalid credentials', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            transition: Bounce,
          });
        } else {
          const session = await getSession(); // Fetch session after successful sign-in.
          if (session) router.push('/'); // Redirect to home page after successful sign-in.
        }
      }
    } catch {
      toast.error('Something went wrong from our end. Try again later', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce,
      });
    } finally {
      setIsLoading(false); // Set loading to false after operation completes.
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon logo" // Display logo image.
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}{' '}
            {/* Display different heading based on the type. */}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? 'Link your account to get started'
              : 'Please enter your details'}
          </p>
        </div>
      </header>

      {user ? (
        // If user exists, show PlaidLink component for account linking.
        <div className="flex flex-col gap-4">
          <PlaidLink user={user} variant="primary" />
        </div>
      ) : (
        <>
          {/* Form for sign-up or sign-in based on the type */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === 'sign-up' && (
                <>
                  {/* Form fields for sign-up */}
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your firstname"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your lastname"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Example: New York"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}

              {/* Common form fields for email and password */}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === 'sign-in' ? (
                    'Sign In' // Button text for sign-in.
                  ) : (
                    'Sign Up' // Button text for sign-up.
                  )}
                </Button>
              </div>
            </form>
          </Form>
          {/* Footer with link to toggle between sign-in and sign-up */}
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === 'sign-in'
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'}>
              {type === 'sign-in' ? 'Sign up' : 'Sign in'}{' '}
              {/* Toggle between Sign Up and Sign In links */}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
