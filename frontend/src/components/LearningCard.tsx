import { LearningCard as LearningCardType } from '../types';

interface LearningCardProps {
  card: LearningCardType;
  index: number;
}

export default function LearningCard({ card, index }: LearningCardProps) {
  const colors = ['#F85857', '#01CFC9', '#FDCA6F'];
  const colorIndex = index % colors.length;
  const color = colors[colorIndex];
  
  return (
    <div 
      id={`card-${card.id}`}
      style={{ 
        backgroundColor: color,
        borderColor: color 
      }}
      className="h-[85vh] w-full snap-center flex flex-col p-8 relative rounded-3xl shadow-xl my-4 before:absolute before:content-[''] before:w-16 before:h-16 before:top-0 before:left-0 before:border-l-2 before:border-t-2 before:rounded-tl-3xl opacity-700"
    >
      <div className="text-sm font-medium text-white mb-2 uppercase tracking-wider">Card {index + 1}</div>
      <h2 className="text-3xl font-bold mb-4 text-white">{card.title}</h2>
      
      {/* Content area with overflow scrolling */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="text-white">
          <div 
            className="prose prose-lg mb-6 prose-headings:text-white prose-p:text-white/90"
            dangerouslySetInnerHTML={{ __html: card.htmlContent }}
          />
        </div>
      </div>
      
      {card.imageUrl && (
        <div className="relative h-56 w-full mt-4 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <span className="text-gray-600 font-medium">{card.title} Image</span>
          </div>
        </div>
      )}
    </div>
  );
}