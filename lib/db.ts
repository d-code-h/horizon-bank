// lib/db.ts
import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.MONGODB_URI as string);

const dbName = 'horizon';

const main = async (col: string) => {
  try {
    await client.connect();
    return client.db(dbName).collection(col);
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async ({
  email,
  id,
}: {
  email?: string;
  id?: string;
}) => {
  try {
    const db = await main('users');
    //  Find the user in DB
    let user;
    if (email) {
      user = db && (await db.findOne({ email }));
    }

    if (id) {
      user = db && (await db.findOne({ _id: new ObjectId(id) }));
    }

    if (user) {
      return user;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addUser = async (userData: SignedUser) => {
  try {
    const db = await main('users');
    //  Find the user in DB
    const res = db && (await db.insertOne({ ...userData }));

    if (res?.acknowledged) {
      return res;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createBankAccount = async (data: createBankAccountProps) => {
  try {
    const db = await main('banks');
    if (db) {
      const res = await db.insertOne(data);
      if (res.acknowledged) {
        return res.insertedId;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getDbBanks = async (id: string) => {
  try {
    const db = await main('banks');
    //  Find the banks with userId as id in DB
    const banks = await db?.find({ userId: id }).toArray();

    if (banks) {
      return banks;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getDbBank = async (id: string) => {
  try {
    const db = await main('banks');
    //  Find the bank with _id as id in DB
    const bank = await db?.findOne({ _id: new ObjectId(id) });

    if (bank) {
      return { ...bank, _id: bank._id.toString() } as Bank;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getDbBankByAccountId = async (accountId: string) => {
  try {
    const db = await main('banks');
    if (db) {
      const bank = await db.findOne({ accountId: accountId });
      if (!bank) throw new Error('It seems no bank is connect to this account');

      return {
        ...bank,
        _id: bank._id.toString(),
      };
    }
  } catch (error) {
    console.log('E', error);
  }
};

// Transactions

// New transactions
export const createDbTransaction = async (
  data: CreateTransactionProps & {
    channel: string;
    category: string;
  }
) => {
  try {
    const db = await main('transactions');
    if (db) {
      const res = await db.insertOne({ ...data });

      if (!res.acknowledged) throw new Error('Error creating transaction');
      return {
        _id: res.insertedId.toString(),
        ...data,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
// Get transactions by id
export const getDbTransactionByBankId = async (bankId: string) => {
  try {
    const db = await main('transactions');
    if (db) {
      const senderTransactions = await db
        .find({ senderBankId: bankId })
        .toArray();

      if (senderTransactions) {
        senderTransactions.map((transaction) => {
          return { ...transaction, _id: transaction._id.toString() };
        });

        const receiverTransactions = await db
          .find({
            receiverBankId: bankId,
          })
          .toArray();

        if (receiverTransactions) {
          receiverTransactions.map((transaction) => {
            return { ...transaction, _id: transaction._id.toString() };
          });

          return {
            total: senderTransactions.length + receiverTransactions.length,
            documents: [...senderTransactions, ...receiverTransactions],
          };
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
