'use client';

import { useState } from 'react';
import { generateLearningCards } from '../api';
import { useRouter } from 'next/navigation';

export default function ContentGenerationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    topic: '',
    level: "I'm new to this topic", // Set default value
    description: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);
    setError('');

    try {
      const result = await generateLearningCards({
        topic: formData.topic.trim(),
        level: formData.level,
        description: formData.description.trim()
      });
      
      console.log('Generated cards:', result);
      // Redirect to the newly created topic
      if (result._id) {
        router.push(`/topics/${result._id}`);
      }
    } catch (error) {
      console.error('Failed to generate cards:', error);
      setError('Failed to generate cards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Generate Learning Content</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What would you like to learn?</label>
          <input
            type="text"
            placeholder="Enter a topic (e.g. JavaScript Basics)"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01CFC9] focus:border-transparent"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select your level</label>
          <select 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01CFC9] focus:border-transparent"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            required
          >
            <option value="I'm new to this topic">I&apos;m new to this topic</option>
            <option value="I know some basics">I know some basics</option>
            <option value="I can understand intermediate concepts">I can understand intermediate concepts</option>
            <option value="I'm at an advanced level">I&apos;m at an advanced level</option>
            <option value="I'm an expert looking to refresh">I&apos;m an expert looking to refresh</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional requirements (optional)</label>
          <textarea
            placeholder="Any specific areas you'd like to focus on?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#01CFC9] focus:border-transparent"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#01CFC9] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#00B8B3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Learning Cards'}
        </button>
      </form>
    </div>
  );
}