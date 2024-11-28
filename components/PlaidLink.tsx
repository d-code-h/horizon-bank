import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import {
  createLinkToken,
  exchangePublicToken,
  getUserInfo,
} from '@/lib/actions/user.actions';
import { getSession, signIn } from 'next-auth/react';
import Image from 'next/image';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const router = useRouter();

  const [token, setToken] = useState('');

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(user);
      setToken(data?.linkToken);
    };

    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token: string) => {
      let userInfo = user;
      try {
        if (!userInfo.dwollaCustomerId) {
          const res = await getUserInfo({ userId: user.$id });

          if (res) {
            userInfo = res;
          }
        }

        await exchangePublicToken({
          publicToken: public_token,
          user: userInfo,
        });

        if (user.password) {
          const res = await signIn('credentials', {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
          });

          if (res?.error) {
          } else {
            const session = await getSession();
            if (session) router.push('/');
          }
        }
      } catch (error: unknown) {
        console.log(error);
        console.log('Error occur here');
      }
    },
    [user]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === 'primary' ? (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="plaidlink-primary"
        >
          Connect bank
        </Button>
      ) : variant === 'ghost' ? (
        <Button
          onClick={() => open()}
          variant="ghost"
          className="plaidlink-ghost"
        >
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />

          <p className="hidden text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </Button>
      ) : (
        <Button onClick={() => open()} className="plaidlink-default">
          <Image
            src="/icons/connect-bank.svg"
            alt="connect bank"
            width={24}
            height={24}
          />
          <p className="text-[16px] font-semibold text-black-2">Connect bank</p>
        </Button>
      )}
    </>
  );
};

export default PlaidLink;
