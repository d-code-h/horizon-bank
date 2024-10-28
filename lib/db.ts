// lib/db.ts
import { SignUpParams } from '@/types';
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

export const addUser = async (userData: SignUpParams) => {
  try {
    const db = await main('users');
    //  Find the user in DB
    const user = db && (await db.insertOne({ ...userData }));

    console.log(user);
    if (user) {
      return user;
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
