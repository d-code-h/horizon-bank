// lib/db.ts
import { MongoClient, ObjectId } from 'mongodb';

// Create a MongoDB client with the connection URI from environment variables
const client = new MongoClient(process.env.MONGODB_URI as string);

// Define the database name to interact with
const dbName = 'horizon';

// Function to establish a connection to a specific collection in the database
export const main = async (col: string) => {
  try {
    // Connect to the database client
    await client.connect();
    // Return the collection of the specified name
    return client.db(dbName).collection(col);
  } catch (error) {
    // Log error if connection fails
    console.log(error);
  }
};

// Function to get a user from the 'users' collection by email or ID
export const getUser = async ({
  email,
  id,
}: {
  email?: string;
  id?: string;
}) => {
  try {
    const db = await main('users'); // Connect to the 'users' collection
    let user;

    // If email is provided, find the user by email
    if (email) {
      user = db && (await db.findOne({ email }));
    }

    // If ID is provided, find the user by ID
    if (id) {
      user = db && (await db.findOne({ _id: new ObjectId(id) }));
    }

    // If a user is found, return the user object
    if (user) {
      return user;
    }

    return null; // Return null if no user is found
  } catch (error) {
    console.log(error); // Log error if query fails
    return null;
  }
};

// Function to add a new user to the 'users' collection
export const addUser = async (userData: SignedUser) => {
  try {
    const db = await main('users'); // Connect to the 'users' collection
    const res = db && (await db.insertOne({ ...userData })); // Insert the user data

    // Return the result if the insertion was acknowledged
    if (res?.acknowledged) {
      return res;
    }

    return null; // Return null if insertion failed
  } catch (error) {
    console.log(error); // Log error if insertion fails
    return null;
  }
};

// Function to create a new bank account in the 'banks' collection
export const createBankAccount = async (data: createBankAccountProps) => {
  try {
    const db = await main('banks'); // Connect to the 'banks' collection
    if (db) {
      const res = await db.insertOne(data); // Insert the bank account data

      // Return the inserted ID if the operation was successful
      if (res.acknowledged) {
        return res.insertedId;
      }
    }
  } catch (error) {
    console.log(error); // Log error if account creation fails
  }
};

// Function to get all banks linked to a specific user
export const getDbBanks = async (id: string) => {
  try {
    const db = await main('banks'); // Connect to the 'banks' collection
    // Find all banks linked to the given user ID
    const banks = await db?.find({ userId: id }).toArray();

    // Return the list of banks if found
    if (banks) {
      return banks;
    }

    return null; // Return null if no banks are found
  } catch (error) {
    console.log(error); // Log error if query fails
    return null;
  }
};

// Function to get a specific bank by its ID
export const getDbBank = async (id: string) => {
  try {
    const db = await main('banks'); // Connect to the 'banks' collection
    // Find the bank by its ID
    const bank = await db?.findOne({ _id: new ObjectId(id) });

    // Return the bank if found, with the _id converted to string
    if (bank) {
      return { ...bank, _id: bank._id.toString() } as Bank;
    }

    return null; // Return null if no bank is found
  } catch (error) {
    console.log(error); // Log error if query fails
    return null;
  }
};

// Function to get a bank by its account ID
export const getDbBankByAccountId = async (accountId: string) => {
  try {
    const db = await main('banks'); // Connect to the 'banks' collection
    if (db) {
      // Find the bank by account ID
      const bank = await db.findOne({ accountId: accountId });
      if (!bank)
        throw new Error('It seems no bank is connected to this account');

      // Return the bank details if found, with _id converted to string
      return {
        ...bank,
        _id: bank._id.toString(),
      };
    }
  } catch (error) {
    console.log('E', error); // Log error if no bank is found
  }
};

// Transactions

// Function to create a new transaction in the 'transactions' collection
export const createDbTransaction = async (
  data: CreateTransactionProps & {
    channel: string;
    category: string;
  }
) => {
  try {
    const db = await main('transactions'); // Connect to the 'transactions' collection
    if (db) {
      const res = await db.insertOne({ ...data }); // Insert the transaction data

      // If the insertion was successful, return the transaction details
      if (!res.acknowledged) throw new Error('Error creating transaction');
      return {
        _id: res.insertedId.toString(),
        ...data,
      };
    }
  } catch (error) {
    console.log(error); // Log error if transaction creation fails
  }
};

// Function to get transactions by a bank ID (both sender and receiver)
export const getDbTransactionByBankId = async (bankId: string) => {
  try {
    const db = await main('transactions'); // Connect to the 'transactions' collection
    if (db) {
      // Find transactions where the bank is the sender
      const senderTransactions = await db
        .find({ senderBankId: bankId })
        .toArray();

      // If sender transactions are found, process them
      if (senderTransactions) {
        senderTransactions.map((transaction) => {
          return { ...transaction, _id: transaction._id.toString() };
        });

        // Find transactions where the bank is the receiver
        const receiverTransactions = await db
          .find({
            receiverBankId: bankId,
          })
          .toArray();

        // If receiver transactions are found, process them
        if (receiverTransactions) {
          receiverTransactions.map((transaction) => {
            return { ...transaction, _id: transaction._id.toString() };
          });

          // Combine and return both sender and receiver transactions
          return {
            total: senderTransactions.length + receiverTransactions.length,
            documents: [...senderTransactions, ...receiverTransactions],
          };
        }
      }
    }
  } catch (error) {
    console.log(error); // Log error if query fails
  }
};
