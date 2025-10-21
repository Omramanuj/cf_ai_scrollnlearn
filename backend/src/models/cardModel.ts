import { Collection, ObjectId } from 'mongodb';

export interface Card {
  _id?: ObjectId;
  title: string;
  htmlContent: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getCardCollection = async (db: any): Promise<Collection<Card>> => {
  return db.collection('cards');
};
