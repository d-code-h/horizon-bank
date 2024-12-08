import React, { useCallback, useEffect, useState } from 'react'; // Importing React hooks
import { Button } from './ui/button'; // Importing the custom Button component
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link'; // Importing PlaidLink utilities
import { useRouter } from 'next/navigation'; // Importing the router for navigation
import {
  createLinkToken,
  exchangePublicToken,
  getUserInfo,
} from '@/lib/actions/user.actions'; // Importing actions for Plaid integration
import { getSession, signIn } from 'next-auth/react'; // Importing session management and sign-in methods
import Image from 'next/image'; // Importing Image for image rendering

// PlaidLink component for managing Plaid bank account connection
const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter(); // Getting router for navigation after successful login

  const [token, setToken] = useState(''); // State for storing the link token

  // useEffect hook to get a link token whenever the user changes
  useEffect(() => {
    const getLinkToken = async () => {
      const data = (await createLinkToken(user)) as {
        linkToken: string;
      }; // Calling createLinkToken to fetch a token from the backend
      setToken(data.linkToken); // Setting the token in state
    };

    getLinkToken();
  }, [user]); // Dependency on user data to fetch the link token when the user changes

  // onSuccess callback function after a successful Plaid connection
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      let userInfo = user; // Default user info from props
      try {
        // If Dwolla customer ID is not set, get the user info from the backend
        if (!userInfo.dwollaCustomerId) {
          const res = await getUserInfo({ userId: user.$id });

          if (res) {
            userInfo = res; // Update userInfo with the fetched data
          }
        }

        // Exchange the public token for an access token and link to the user's account
        await exchangePublicToken({
          publicToken: public_token,
          user: userInfo,
        });

        // If user has a password, attempt to sign in with credentials
        if (user.password) {
          const res = await signIn('credentials', {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
          });

          if (res?.error) {
            // Handle error in case sign-in fails
          } else {
            // If sign-in is successful, fetch session and redirect to home
            const session = await getSession();
            if (session) router.push('/'); // Redirect to home page
          }
        }
      } catch (error: unknown) {
        console.error(error); // Log any errors during the process
        console.log('Error occurred here');
      }
    },
    [user] // Dependency on the user data to trigger onSuccess when user changes
  );

  // Configuration for the PlaidLink component
  const config: PlaidLinkOptions = {
    token,
    onSuccess, // Passing the success callback function
  };

  // Using PlaidLink hook to handle opening the Plaid link modal and checking readiness
  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {/* Conditional rendering of different button styles based on the variant prop */}
      {variant === 'primary' ? (
        <Button
          onClick={() => open()} // Open Plaid link on button click
          disabled={!ready} // Disable the button if PlaidLink is not ready
          className="plaidlink-primary" // Primary button style
        >
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button
          onClick={() => open()} // Open Plaid link on button click
          variant="ghost" // Ghost button style
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg" // Image for connect bank icon
            alt="connect bank"
            width={24} // Icon width
            height={24} // Icon height
          />
          {/* Hidden text on small screens, visible on larger screens */}
          <p className="hidden text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image
            src="/icons/connect-bank.svg" // Image for connect bank icon
            alt="connect bank"
            width={24} // Icon width
            height={24} // Icon height
          />
          <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
