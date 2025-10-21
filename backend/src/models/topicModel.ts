import { Collection, ObjectId } from 'mongodb';

export interface Topic {
  _id?: ObjectId;
  topic: string;
  level: string;
  content: ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const getTopicCollection = async (db: any): Promise<Collection<Topic>> => {
  return db.collection('topics');
};
