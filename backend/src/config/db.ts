import { MongoClient } from 'mongodb';

interface Env {
  MONGODB_URI: string;
  GEMINI_API_KEY: string;
}

// Global variable to store the client connection
let client: MongoClient | null = null;

export const connectDB = async (env: Env) => {
  try {
    if (client) {
      return client;
    }

    const uri = env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB Atlas connected successfully');
    return client;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    throw error;
  }
};

export const getDB = async (env: Env) => {
  const client = await connectDB(env);
  return client.db('scrolllearn');
};

export const closeDB = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};