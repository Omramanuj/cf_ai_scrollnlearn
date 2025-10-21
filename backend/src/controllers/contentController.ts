import { generateEducationalContent } from "../services/llmService";
import { getDB } from "../config/db";
import { getTopicCollection, Topic } from "../models/topicModel";
import { getCardCollection, Card } from "../models/cardModel";

interface Env {
  MONGODB_URI: string;
  GEMINI_API_KEY: string;
}

interface RequestBody {
  topic: string;
  level: string;
  description?: string;
}

export const generateContent = async (request: Request, env: Env): Promise<Response> => {
  try {
    const body = await request.json() as RequestBody;
    const { topic, level, description } = body;

    if (!topic || !level) {
      return new Response(JSON.stringify({ error: "Topic and level are required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = await getDB(env);
    const topicCollection = await getTopicCollection(db);
    const cardCollection = await getCardCollection(db);

    // Check if topic already exists
    // const existingTopic = await topicCollection.findOne({ topic, level });
    // if (existingTopic) {
    //   console.log("Topic found in DB. Returning existing content.");
    //   return new Response(JSON.stringify(existingTopic), {
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    let content = await generateEducationalContent(topic, level, description || '', env.GEMINI_API_KEY);
    if (!content) {
      return new Response(JSON.stringify({ error: "Failed to generate content" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log("content : ", content);
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      console.log("Parsed content successfully");
    } catch (error) {
      console.error("Error parsing JSON:", error, content);
      return new Response(JSON.stringify({ error: "Invalid JSON from AI response" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!parsedContent.content || !Array.isArray(parsedContent.content)) {
      return new Response(JSON.stringify({ error: "Invalid content format" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let cardDocuments;
    try {
      console.log("Attempting to insert cards into DB...");
      const cardsToInsert = parsedContent.content.map((card: { title: string; htmlContent: string }) => ({
        title: card.title,
        htmlContent: card.htmlContent,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      const result = await cardCollection.insertMany(cardsToInsert);
      cardDocuments = result.insertedIds;
      console.log("Cards inserted successfully:", Object.keys(cardDocuments).length);
    } catch (err) {
      console.error("Error while inserting cards:", err);
      return new Response(JSON.stringify({ error: "Failed to insert cards into DB" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const cardIds = Object.values(cardDocuments);
    console.log("Card IDs saved:", cardIds);
    
    const newTopic: Topic = {
      topic: parsedContent.topic,
      level: parsedContent.level,
      content: cardIds,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const topicResult = await topicCollection.insertOne(newTopic);
    newTopic._id = topicResult.insertedId;
    
    console.log("New topic saved to DB:", newTopic);
    return new Response(JSON.stringify(newTopic), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error in generateContent:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};