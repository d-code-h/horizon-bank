'use server';

import { createDbTransaction, getDbTransactionByBankId, getUser } from '../db';
import { getTransfers } from './dwolla.actions';
import { getLoggedInUser } from './user.actions';

// Create a new transaction and insert it into the database
export const createTransaction = async (
  transaction: CreateTransactionProps
) => {
  try {
    // Insert transaction data into the database
    const res = await createDbTransaction({
      channel: 'online',
      category: 'Transfer',
      ...transaction,
    });

    if (!res) {
      throw new Error('Transaction creation might have failed.'); // Handle failure in creating transaction
    }

    return res; // Return successful transaction response
  } catch (error) {
    console.error('Error creating transaction:', error); // Log error for debugging
  }
};

// Get transactions associated with a specific bank by bank ID
export const getTransactionsByBankId = async ({
  bankId,
}: getTransactionsByBankIdProps) => {
  try {
    // Retrieve the logged-in user
    const localUser = (await getLoggedInUser()) as User;
    const user = await getUser({ email: localUser.email });

    // Retrieve Dwolla transfer data and database transaction data
    const dwollaTransfer = await getTransfers(user?.dwollaCustomerUrl);
    const dbTransfer = await getDbTransactionByBankId(bankId);

    // Update and map transactions with transfer data
    const updatedTransfer = dbTransfer?.documents.map((each) => {
      // Match transaction with Dwolla transfer
      const res = dwollaTransfer.find(
        ({ id }: { id: string }) => id === each.dwollaTransactionId
      );
      return {
        ...each,
        _id: each._id.toString(), // Ensure _id is returned as a string
        date: res?.created, // Add creation date from Dwolla transfer
        status: res?.status, // Add status from Dwolla transfer
        type: each.senderBankId === bankId ? 'debit' : 'credit', // Set transaction type based on bank ID
      };
    });

    return updatedTransfer; // Return the updated transactions
  } catch (error) {
    console.error('Error fetching transactions by bank ID:', error); // Log error for debugging
  }
};
