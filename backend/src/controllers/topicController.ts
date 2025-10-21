import { getDB } from "../config/db";
import { getTopicCollection, Topic } from "../models/topicModel";
import { getCardCollection, Card } from "../models/cardModel";
import { ObjectId } from "mongodb";

export const getAllTopics = async (env: any): Promise<Response> => {
  try {
    const db = await getDB(env);
    const topicCollection = await getTopicCollection(db);
    
    // Fetch all topics
    const topics = await topicCollection.find({}).toArray();

    if (!topics || topics.length === 0) {
      return new Response(JSON.stringify({ error: "No topics found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(topics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const getTopicWithCards = async (request: Request, env: any): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const topicId = url.pathname.split('/').pop();
    
    if (!topicId) {
      return new Response(JSON.stringify({ error: "Topic ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const objectId = new ObjectId(topicId);
    const db = await getDB(env);
    const topicCollection = await getTopicCollection(db);
    const cardCollection = await getCardCollection(db);

    // Find the topic by ID
    const topic = await topicCollection.findOne({ _id: objectId });

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch all cards for this topic
    const cards = await cardCollection.find({ _id: { $in: topic.content } }).toArray();

    if (!cards || cards.length === 0) {
      return new Response(JSON.stringify({ error: "No cards found for this topic" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return the topic along with its cards
    const result = {
      topic: {
        _id: topic._id,
        topic: topic.topic,
        level: topic.level,
        createdAt: topic.createdAt,
        updatedAt: topic.updatedAt
      },
      cards
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error fetching topic with cards:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};