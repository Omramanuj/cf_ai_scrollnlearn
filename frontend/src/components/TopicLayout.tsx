import Link from 'next/link';
import { Topic } from '../types';
import LearningCard from './LearningCard';

interface TopicLayoutProps {
  topic: Topic;
}

export default function TopicLayout({ topic }: TopicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F85857] via-[#01CFC9] to-[#FDCA6F] pb-20 pt-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-white hover:text-white/90 transition-colors bg-black/20 px-4 py-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Topics
          </Link>
        </div>

        {/* Topic title */}
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{topic.topic}</h1>
        <p className="text-white/90 mb-8 text-lg">{topic.description}</p>

        {/* Scrollable cards container - using snap-y for vertical scrolling with snap points */}
        <div className="snap-y snap-mandatory overflow-y-auto h-[85vh] pb-10 scroll-smooth">
          {topic.content.map((card, index) => (
            <LearningCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Navigation dots - improved with active state */}
        <div className="flex justify-center mt-6 space-x-3">
          {topic.content.map((card, index) => (
            <a 
              key={card.id} 
              href={`#card-${card.id}`} 
              className="h-4 w-4 rounded-full bg-white/50 hover:bg-white/90 transition-colors border border-white/30 shadow-sm"
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}