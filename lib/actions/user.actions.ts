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

// Fetch user info based on userId
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const user = await getUser({ id: userId });

    if (user) {
      return {
        ...user,
        _id: user._id.toString(), // Ensure _id is a string
      } as User;
    }
  } catch (error) {
    console.log(error); // Log any error during the process
  }
};

// Handle user sign-in action
export const signInAction = async ({ email, password }: signInProps) => {
  try {
    // Check if user exists in the database
    const user = await getUser({ email });

    if (user) {
      const isPasswordCorrect = await comparePasswords(password, user.password);
      if (isPasswordCorrect) {
        return user; // Successful login
      } else {
        throw new Error('Check your login credentials'); // Invalid password
      }
    }
  } catch (error) {
    // Catch any error and return it as a response
    return {
      data: {
        status: 500,
        message: error,
      },
    };
  }
};

// Handle user sign-up action
export const signUpAction = async (userData: SignUpParams) => {
  const { email, password } = userData;

  try {
    // Check if the user already exists
    const user = await getUser({ email });
    if (!user) {
      // If user doesn't exist, hash the password
      const hashedPass = await saltAndHashPassword(password);

      if (hashedPass) {
        // Create a new Dwolla customer and get the URL
        const dwollaCustomerUrl = await createDwollaCustomer({
          ...userData,
          type: 'personal', // Define user type as personal
        });

        if (!dwollaCustomerUrl) {
          throw new Error('Error creating Dwolla customer'); // Error in Dwolla creation
        }

        // Extract Dwolla customer ID from the URL
        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        // Insert the new user into the database with hashed password and Dwolla data
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
            status: 201, // Successfully created user
            user,
          };
        } else {
          throw new Error('Something went wrong from our end. Try again soon.'); // If user creation failed
        }
      }
    } else {
      return {
        status: 401, // User already exists
        message: 'User with same credentials exists.',
      };
    }
  } catch (error) {
    console.error('Error', error); // Log error details

    return {
      status: 500, // Internal server error
      message: error,
    };
  }
};

// Get currently logged-in user information
export const getLoggedInUser = async () => {
  let redirectPath: null | string = null;

  try {
    const session = await auth(); // Retrieve the authentication session
    const loggedIn = session?.user;

    if (!loggedIn) {
      redirectPath = '/sign-in'; // Redirect to sign-in if no user is logged in
    } else {
      return {
        $id: loggedIn?.id as string,
        name: loggedIn?.name as string,
        email: loggedIn?.email as string,
      };
    }
  } catch (error) {
    console.log(error); // Log error if any issue in fetching session
    redirectPath = '/sign-in'; // Redirect if error occurs
  } finally {
    if (redirectPath) {
      redirect(redirectPath); // Redirect if path is set
    }
  }
};

// Logout user (not implemented here)
export const logoutAccount = async () => {
  try {
    // Implement logout functionality if needed
  } catch (error) {
    console.log(error); // Log any errors
    return null;
  }
};

// Create Plaid Link token for a user
export const createLinkToken = async (user: User) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id,
      },
      client_name: user.name,
      products: ['auth', 'transactions'] as Products[], // Define products for Plaid integration
      language: 'en',
      country_codes: ['US'] as CountryCode[],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams); // Create link token using Plaid client
    if (response) {
      return parseStringify({ linkToken: response.data.link_token }); // Parse and return the token
    }
  } catch (error) {
    console.log(error); // Log any errors during token creation
  }
};

// Create a bank account entry in the database
export const createBank = async (bankData: createBankAccountProps) => {
  try {
    const insertedId = await createBankAccount(bankData); // Insert bank data into the database

    return {
      _id: insertedId,
      ...bankData,
    };
  } catch (error) {
    console.log(error); // Log errors if any
  }
};

// Exchange public token for access token and link it with the user's bank account
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

    // Retrieve account information from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using Plaid's data
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum,
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    // Add the funding source with Dwolla
    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw Error; // Throw error if funding source URL could not be created

    // Create the bank entry in the database
    await createBank({
      userId: user.$id || (user._id?.toString() as string),
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id.toString()),
    });

    // Revalidate the page after the bank account creation
    revalidatePath('/');
    return {
      publicTokenExchange: 'complete', // Successful exchange
    };
  } catch (error) {
    console.error('An error occurred while exchanging the token:', error);
  }
};

// Get all bank accounts for a user
export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    // Retrieve all banks associated with the given user ID
    const banks = await getDbBanks(userId);
    return banks;
  } catch (error) {
    console.log(error); // Log any errors
  }
};

// Get a specific bank account using its document ID
export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const bank = await getDbBank(documentId); // Retrieve bank by document ID
    return bank;
  } catch (error) {
    console.log(error); // Log any errors
  }
};

// Get bank account by account ID
export const getBankByAccountId = async ({
  accountId,
}: getBankByAccountIdProps) => {
  try {
    const bank = await getDbBankByAccountId(accountId); // Retrieve bank using account ID
    if (bank) {
      return bank;
    }
  } catch (error) {
    console.log(error); // Log any errors
  }
};

// Revalidate the page path to reflect changes
export async function revalidate(link: string) {
  revalidatePath(link);
}
