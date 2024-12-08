'use server';

import { CountryCode } from 'plaid';
import { plaidClient } from '../plaid';
import { parseStringify } from '../utils';
import { getTransactionsByBankId } from './transaction.actions';
import { getBanks, getBank } from './user.actions';

// Function to retrieve multiple bank accounts for a user
export const getAccounts = async ({ userId }: { userId: string }) => {
  try {
    // Retrieve banks associated with the user from the database
    const banks = await getBanks({ userId });

    // Fetch account details from Plaid for each bank
    const accounts =
      banks &&
      (await Promise.all(
        banks.map(async (bank) => {
          const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
          });

          const accountData = accountsResponse.data.accounts[0];

          // Retrieve institution details for each account
          const institution = (await getInstitution({
            institution_id: accountsResponse.data.item.institution_id!,
          })) as getInstitutionProps;

          // Construct account details
          return {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institution_id: institution.institution_id as string,
            name: accountData.name,
            officialName: accountData.official_name as string,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            dbItemId: bank._id.toString(),
            shareableId: bank.shareableId as string,
          };
        })
      ));

    // Calculate total number of banks and total current balance
    const totalBanks = accounts?.length ?? 0;
    const totalCurrentBalance =
      accounts?.reduce((total, account) => total + account.currentBalance, 0) ??
      0;

    return { accounts, totalBanks, totalCurrentBalance };
  } catch (error) {
    console.error('Error occurred while fetching accounts:', error);
    return { accounts: [], totalBanks: 0, totalCurrentBalance: 0 }; // return empty if there's an error
  }
};

// Function to retrieve a single bank account with transaction history
export const getAccount = async ({ dbItemId }: { dbItemId: string }) => {
  try {
    // Retrieve bank details from the database
    const bank = await getBank({ documentId: dbItemId });

    if (!bank) {
      throw new Error('Bank not found');
    }

    // Fetch account details from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank?.accessToken as string,
    });
    const accountData = accountsResponse.data.accounts[0];

    // Fetch transfer transactions from the database
    const transferedTransactions = await getTransactionsByBankId({
      bankId: bank?._id.toString() as string,
    });

    // Retrieve institution details from Plaid
    const institution = (await getInstitution({
      institution_id: accountsResponse.data.item.institution_id!,
    })) as getInstitutionProps;

    // Fetch transaction history from Plaid
    const transactions = await getTransactions({
      accessToken: bank?.accessToken as string,
    });

    // Construct account details
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institution_id: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      dbItemId: bank?._id.toString(),
    };

    // Combine and sort transactions by the most recent date
    const allTransactions = [
      ...((transactions || []) as Transaction[]),
      ...(transferedTransactions || []),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      data: account,
      transactions: allTransactions,
    };
  } catch (error) {
    console.error('Error occurred while fetching account details:', error);
    return { data: null, transactions: [] }; // return empty if there's an error
  }
};

// Function to retrieve institution details based on institution_id
export const getInstitution = async ({
  institution_id,
}: {
  institution_id: string;
}) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institution_id,
      country_codes: ['US'] as CountryCode[],
    });

    const institution = institutionResponse.data.institution;
    return parseStringify(institution);
  } catch (error) {
    console.error('Error occurred while fetching institution info:', error);
    return null; // return null if there's an error
  }
};

// Function to retrieve transactions for a given bank account from Plaid
export const getTransactions = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  let hasMore = true;
  let transactions: unknown[] = [];

  try {
    // Iterate through each page of new transactions for the account
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = [
        ...transactions,
        ...data.added.map((transaction) => ({
          id: transaction.transaction_id,
          name: transaction.name,
          channel: transaction.payment_channel,
          type: transaction.payment_channel,
          accountId: transaction.account_id,
          amount: transaction.amount,
          pending: transaction.pending,
          category: transaction.category ? transaction.category[0] : '',
          date: transaction.date,
          image: transaction.logo_url,
        })),
      ];

      hasMore = data.has_more;
    }

    return transactions;
  } catch (error) {
    console.error('Error occurred while fetching transactions:', error);
    return []; // return empty array if there's an error
  }
};
