'use server';

import { createDbTransaction, getDbTransactionByBankId, getUser } from '../db';
import { getTransfers } from './dwolla.actions';
import { getLoggedInUser } from './user.actions';

export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    const res = await createDbTransaction({
      channel: 'online',
      category: 'Transfer',
      ...transaction,
    });

    if (!res) throw new Error('Transaction creating might have failed.');

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    const localUser = (await getLoggedInUser()) as User;
    const user = await getUser({ email: localUser.email });
    const dwollaTransfer = await getTransfers(user?.dwollaCustomerUrl);
    const dbTransfer = await getDbTransactionByBankId(bankId);

    const updatedTransfer = dbTransfer?.documents.map((each) => {
      const res = dwollaTransfer.find(
        ({ id }: { id: string }) => id === each.dwollaTransactionId
      );
      return {
        ...each,
        _id: each._id.toString(),
        date: res.created,
        status: res.status,
        type: each.senderBankId === bankId ? 'debit' : 'credit',
      };
    });

    return updatedTransfer;
  } catch (error) {
    console.log(error);
  }
};
