import { notFound } from 'next/navigation';
import TopicLayout from '../../../components/TopicLayout';
import { fetchTopicById } from '../../../api';

// Remove explicit type definitions and let Next.js infer them
export default async function TopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  try {
    const  topicId  =  (await params).topicId;
    
    if (!topicId) {
      notFound();
    }
    
    const topic = await fetchTopicById(topicId);
    
    if (!topic) {
      notFound();
    }
    
    return <TopicLayout topic={topic} />;
  } catch (error) {
    console.error('Error loading topic:', error);
    notFound();
  }
}