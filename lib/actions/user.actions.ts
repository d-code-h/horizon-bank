'use server';

import {
  addUser,
  createBankAccount,
  getDbBank,
  getDbBankByAccountId,
  getDbBanks,
  getUser,
} from '../db';
import { comparePasswords, saltAndHashPassword } from '../utils';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';

import {
  CountryCode,
  ProcessorTokenCreateRequest,
  ProcessorTokenCreateRequestProcessorEnum,
  Products,
} from 'plaid';
import { plaidClient } from '../plaid';
import { revalidatePath } from 'next/cache';
import { addFundingSource, createDwollaCustomer } from './dwolla.actions';

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const user = await getUser({ id: userId });
    if (user)
      return {
        ...user,
        _id: user._id.toString(),
      } as User;
  } catch (error) {
    console.log(error);
  }
};

export const signInAction = async ({ email, password }: signInProps) => {
  try {
    // Check user exist
    const user = await getUser({ email });

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
    const user = await getUser({ email });
    if (!user) {
      // Hash password
      const hashedPass = await saltAndHashPassword(password);

      if (hashedPass) {
        //  Create new Dwolla customer
        const dwollaCustomerUrl = await createDwollaCustomer({
          ...userData,
          type: 'personal',
        });

        if (!dwollaCustomerUrl)
          throw new Error('Error creating Dwolla customer');

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const res = await addUser({
          ...userData,
          dwollaCustomerId,
          dwollaCustomerUrl,
          password: hashedPass,
        });

        if (res?.acknowledged) {
          const user = {
            $id: res?.insertedId.toString(),
            name: `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            dwollaCustomerUrl: dwollaCustomerUrl,
            dwollaCustomerId: dwollaCustomerId,
            address1: userData.address1,
            city: userData.city,
            state: userData.state,
            postalCode: userData.postalCode,
            dateOfBirth: userData.dateOfBirth,
            ssn: userData.ssn,
          };
          return {
            status: 201,
            user,
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

export const getLoggedInUser = async () => {
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
};

export const logoutAccount = async () => {
  try {
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ['auth', 'transactions'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };
    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token });
  } catch (error) {
    console.log(error);
  }
};
export const createBank = async (bankData: createBankAccountProps) => {
  try {
    const insertedId = await createBankAccount(bankData);

    return {
      _id: insertedId,
      ...bankData,
    };
  } catch (error) {
    console.log(error);
  }
};

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Get account information from Plaid using the access token
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];
    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;
    // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    // If the funding source URL is not created, throw an error
    if (!fundingSourceUrl) throw Error;
    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareable ID
    await createBank({
      userId: user.$id || (user._id?.toString() as string),
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id.toString()),
    });
    // Revalidate the path to reflect the changes
    revalidatePath('/');
    // Return a success message
    return {
      publicTokenExchange: 'complete',
    };
  } catch (error) {
    console.error('An error occurred while creating exchanging token:', error);
  }
};

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    // * Get all banks with userId to be userId
    const banks = await getDbBanks(userId);
    return banks;
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    // * Get specific bank with _id to be documentId
    const bank = await getDbBank(documentId);

    return bank;
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const bank = await getDbBankByAccountId(accountId);
    if (bank) {
      return bank;
    }
  } catch (error) {
    console.log(error);
  }
};

export async function revalidate(link: string) {
  revalidatePath(link);
}
