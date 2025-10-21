'use client';

import HeroSection from '../components/HeroSection';
import ContentGenerationForm from '../components/ContentGenerationForm';
import PopularTopics from '../components/PopularTopics';

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#FDCA6F] to-[#01CFC9] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <HeroSection />
            <ContentGenerationForm />
          </div>
        </div>
        <PopularTopics />
      </div>
    </>
  );
}

