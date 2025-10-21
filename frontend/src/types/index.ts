// Define types for our educational content

export interface Topic {
  _id: string;
  topic: string;
  level: string;
  description: string;
  icon?: string;
  color: string;
  content: LearningCard[];
}

export interface LearningCard {
  id: string;
  title: string;
  htmlContent: string;
  imageUrl?: string;
}

// Mock data types
export type TopicsData = Topic[];