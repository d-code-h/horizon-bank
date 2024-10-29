// lib/db.ts
import { createBankAccountProps, SignedUser } from '@/types';
import { MongoClient } from 'mongodb';
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

export const getUser = async (email: string) => {
  try {
    const db = await main('users');
    //  Find the user in DB
    const user = db && (await db.findOne({ email }));

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
    const db = await main('bank');
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
