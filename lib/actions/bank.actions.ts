'use server';

import { CountryCode } from 'plaid';

import { plaidClient } from '../plaid';
import { parseStringify } from '../utils';

import { getTransactionsByBankId } from './transaction.actions';
import { getBanks, getBank } from './user.actions';

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });
    const accounts =
      banks &&
      (await Promise.all(
        banks.map(async (bank) => {
          // get each account info from plaid
          const accountsResponse = await plaidClient.accountsGet({
            access_token: bank.accessToken,
          });

          const accountData = accountsResponse.data.accounts[0];
          // get institution info from plaid
          const institution = await getInstitution({
            institutionId: accountsResponse.data.item.institution_id!,
          });

          const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id as string,
            name: accountData.name,
            officialName: accountData.official_name as string,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            dbItemId: bank._id.toString(),
            shareableId: bank.shareableId as string,
          };
          return account;
        })
      ));

    const totalBanks = accounts?.length;
    const totalCurrentBalance = accounts?.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return { accounts, totalBanks, totalCurrentBalance };
  } catch (error) {
    console.log('An error occurred while getting the accounts:', error);
  }
};

// Get one bank account
export const getAccount = async ({ dbItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: dbItemId });

    // get account info from plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank?.accessToken as string,
    });

    const accountData = accountsResponse.data.accounts[0];

    // get transfer transactions from db
    const transferedTransactions = await getTransactionsByBankId({
      bankId: bank?._id.toString() as string,
    });

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank?.accessToken as string,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      dbItemId: bank?._id.toString(),
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [
      ...((transactions || []) as Transaction[]),
      ...(transferedTransactions || []),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      data: account,
      transactions: allTransactions,
    };
  } catch (error) {
    console.log('An error occurred while getting the account:', error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ['US'] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.log('An error occurred while getting the accounts:', error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: unknown[] = [];

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
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
      }));

      hasMore = data.has_more;
    }
    return transactions;
  } catch (error) {
    console.log('An error occurred while getting the accounts:', error);
  }
};
