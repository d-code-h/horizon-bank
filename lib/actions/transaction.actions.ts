'use server';

import { createDbTransaction, getDbTransactionByBankId } from '../db';

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
    const res = await getDbTransactionByBankId(bankId);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};
