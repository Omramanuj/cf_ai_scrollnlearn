import Link from 'next/link';
import { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  index: number;
}

export default function TopicCard({ topic, index  }: TopicCardProps) {
  const colors = ['#F85857', '#01CFC9', '#FDCA6F'];
  const color = colors[((index) % colors.length)];

  return (
    <Link href={`/topics/${topic._id}`} className="block w-full">
      <div 
        style={{ backgroundColor: color }}
        className="relative rounded-3xl p-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
      >
        <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-sm">{topic.topic}</h3>
        <p className="text-white/90 text-sm">{topic.description}</p>
        <div className="mt-6 bg-white/20 rounded-full px-4 py-1.5 text-white font-medium text-xs inline-block">
          {topic.content.length} cards
        </div>
      </div>
    </Link>
  );
}