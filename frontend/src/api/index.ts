import { Topic } from '../types';

//const API_BASE_URL = 'https://scroll-learn-server.vercel.app/api';
const API_BASE_URL =`${process.env.NEXT_PUBLIC_API_URL}/api`
export async function fetchTopics(): Promise<Topic[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/topics`);
    if (!response.ok) {
      throw new Error('Failed to fetch topics');
    }
    console.log(response)
    return response.json();
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

interface GenerateCardsRequest {
  topic: string;
  level: string;
  description: string;
}

export async function fetchTopicById(id: string): Promise<Topic> {
  try {
    console.log(id)
    console.log(typeof id)
    const response = await fetch(`${API_BASE_URL}/topics-content/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch topic');
    }
    console.log(response) 
    return response.json();
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw error;
  }
}

export async function generateLearningCards(request: GenerateCardsRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to generate learning cards');
    }
    
    // Fix: Don't call response.json() twice
    // Store the result in a variable instead
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error generating learning cards:', error);
    throw error;
  }
}