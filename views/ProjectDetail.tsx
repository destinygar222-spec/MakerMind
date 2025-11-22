
import React, { useState, useEffect } from 'react';
import { Project, SearchResult, Review } from '../types';
import { Button } from '../components/Button';
import { findProjectResources } from '../services/geminiService';
import { StarRating } from '../components/StarRating';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  reviews?: Review[];
  onAddReview?: (review: Review) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, reviews = [], onAddReview }) => {
  const [resources, setResources] = useState<SearchResult[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  
  // Review Form State
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      setLoadingResources(true);
      const results = await findProjectResources(project.title, project.category);
      setResources(results);
      setLoadingResources(false);
    };

    fetchResources();
  }, [project]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0 || !newReviewText.trim()) return;

    if (onAddReview) {
      onAddReview({
        id: Date.now().toString(),
        projectId: project.id,
        rating: newRating,
        text: newReviewText,
        date: new Date().toLocaleDateString()
      });
      setNewRating(0);
      setNewReviewText('');
    }
  };

  const missingMaterials = project.missingMaterials || [];
  const materials = project.materials || [];
  const steps = project.steps || [];
  const diyAlternatives = project.diyAlternatives || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-rosa-500 font-hand text-4xl">
        &larr; Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative border-4 border-black shadow-scrappy bg-white p-3 rotate-1">
             {/* Color Block Header */}
             <div className={`w-full h-96 border-2 border-black ${project.color || 'bg-rosa-500'} relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-talavera opacity-30"></div>
             </div>
             
             <div className="absolute top-8 left-8 flex flex-col items-start gap-3">
                <span className="bg-rosa-500 border-2 border-black text-white text-lg font-display px-4 py-1 shadow-scrappy-sm -rotate-2 uppercase tracking-wider">{project.category}</span>
                <span className="bg-sol-500 border-2 border-black text-black text-lg font-display px-4 py-1 shadow-scrappy-sm rotate-2">{project.timeEstimate}</span>
             </div>
          </div>
          
          <div>
             <h1 className="text-6xl md:text-7xl font-display text-black mb-6 uppercase leading-none drop-shadow-sm">{project.title}</h1>
             <div className="bg-paper p-8 border-l-8 border-sol-500 shadow-sm">
                <p className="text-2xl font-sans text-gray-900 leading-relaxed">{project.description}</p>
             </div>
          </div>

          {/* DIY Alternatives / Hacks Section */}
          {diyAlternatives.length > 0 && (
            <div className="bg-naranja-500 border-4 border-black p-6 shadow-scrappy rotate-[-1deg]">
              <div className="flex items-center gap-4 mb-4 text-white">
                <span className="text-4xl">💡</span>
                <h3 className="text-3xl font-display uppercase">Maker Hacks</h3>
              </div>
              <div className="space-y-4">
                {diyAlternatives?.map((alt, idx) => (
                  <div key={idx} className="bg-white border-2 border-black p-4 relative">
                    <p className="font-bold font-display text-xl text-black mb-1">
                      Don't buy {alt.material}!
                    </p>
                    <p className="font-sans text-lg leading-tight">{alt.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-10 border-4 border-black shadow-scrappy relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-6 bg-cobalt-500 border-b-4 border-black"></div>
            <h3 className="text-5xl font-display mb-10 mt-4 text-black">Make It Happen</h3>
            <ol className="space-y-8">
              {steps?.map((step, idx) => (
                <li key={idx} className="flex gap-6 group">
                  <span className="flex-shrink-0 w-14 h-14 rounded-none bg-black text-white border-2 border-black flex items-center justify-center font-display text-3xl shadow-scrappy-sm group-hover:-translate-y-1 transition-transform group-hover:bg-rosa-500 group-hover:border-black">
                    {idx + 1}
                  </span>
                  <p className="text-xl text-gray-800 mt-1 font-medium font-sans border-b-2 border-gray-200 pb-6 w-full group-hover:border-rosa-200 transition-colors leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

           {/* Resources / Google Search Results */}
           <div className="bg-azul-100 p-8 border-4 border-black shadow-scrappy">
             <h3 className="text-3xl font-display mb-4 text-black">Found on Web</h3>
             <p className="font-sans mb-6 text-lg">Recipes & Tutorials related to this project:</p>
             
             {loadingResources ? (
               <div className="animate-pulse flex gap-4">
                  <div className="h-12 w-12 bg-white rounded-full"></div>
                  <div className="h-4 bg-white flex-grow mt-4"></div>
               </div>
             ) : (
               <ul className="space-y-4">
                 {resources.length > 0 ? resources.map((res, idx) => (
                   <li key={idx} className="bg-white border-2 border-black p-4 hover:bg-sol-100 transition-colors shadow-sm flex items-center justify-between">
                     <a href={res.uri} target="_blank" rel="noopener noreferrer" className="font-bold font-sans text-xl text-cobalt-700 hover:underline block truncate pr-4">
                       {res.title}
                     </a>
                     <span className="text-2xl">🔗</span>
                   </li>
                 )) : (
                   <p className="font-sans italic text-gray-500">No direct links found, try searching for "{project.title}".</p>
                 )}
               </ul>
             )}
           </div>

           {/* REVIEW / JOURNAL SECTION */}
           <div className="bg-paper p-8 border-4 border-black shadow-scrappy relative overflow-hidden mt-12">
             <div className="absolute inset-0 border-l-8 border-rosa-200 ml-8 bg-paper" style={{backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)'}}></div>
             <div className="relative z-10 pl-12">
                <h3 className="text-5xl font-display mb-6 text-black transform -rotate-1">Mi Diario & Ratings</h3>
                
                {/* Add Review Form */}
                <div className="bg-white border-2 border-black p-6 mb-8 shadow-sm rotate-1">
                  <h4 className="font-bold font-display text-xl mb-4">Add your notes:</h4>
                  <form onSubmit={handleSubmitReview}>
                    <div className="mb-4">
                      <label className="block font-sans font-bold mb-2">Your Rating:</label>
                      <StarRating rating={newRating} onRate={setNewRating} interactive size="lg" />
                    </div>
                    <textarea
                      className="w-full border-2 border-black p-4 font-hand text-2xl focus:outline-none focus:shadow-scrappy-sm"
                      rows={3}
                      placeholder="How did it go? Any tips for next time?"
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                    />
                    <Button type="submit" disabled={newRating === 0 || !newReviewText} className="mt-4 w-full font-display text-xl">Save Entry</Button>
                  </form>
                </div>

                {/* List Reviews */}
                <div className="space-y-6">
                  {reviews.length > 0 ? reviews.map(review => (
                    <div key={review.id} className="bg-sol-100 border-2 border-black p-4 shadow-sm -rotate-1 relative">
                      <div className="flex justify-between items-start mb-2">
                         <StarRating rating={review.rating} size="sm" />
                         <span className="font-sans text-sm font-bold text-gray-500">{review.date}</span>
                      </div>
                      <p className="font-hand text-2xl leading-tight">{review.text}</p>
                      <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-rosa-500 border border-black"></div>
                    </div>
                  )) : (
                    <p className="font-hand text-3xl text-gray-400 text-center py-4">No notes yet. Be the first to rate this!</p>
                  )}
                </div>
             </div>
           </div>

        </div>

        {/* Sidebar: Logistics */}
        <div className="lg:col-span-1 space-y-8">
          {/* Cost & Match */}
          <div className="bg-sol-100 p-8 border-4 border-black shadow-scrappy transform hover:scale-[1.02] transition-transform">
             <div className="flex justify-between items-end mb-6 border-b-4 border-black pb-4">
               <span className="text-black font-black uppercase tracking-wider text-sm">Est. Project Cost</span>
               <span className="text-5xl font-display text-rosa-600">${project.costEstimate}</span>
             </div>
             
             <div className="mb-2">
               <span className="text-sm font-black uppercase tracking-widest">Style Match</span>
             </div>
             <div className="w-full bg-white border-4 border-black h-8 mb-3 p-1">
               <div className="bg-verde-500 h-full border-r-2 border-black" style={{ width: `${project.matchScore}%` }}></div>
             </div>
             <div className="text-right text-xl font-bold font-hand transform -rotate-1 text-cobalt-900">{project.matchScore}% Perfect for you</div>
          </div>

          {/* Shopping List */}
          <div className="bg-white p-8 border-4 border-black shadow-scrappy relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-naranja-500 border-4 border-black px-6 py-2 text-white font-display text-xl uppercase shadow-sm tracking-widest whitespace-nowrap">
                Shopping List
            </div>
            
            <div className="mt-8">
                {missingMaterials.length > 0 ? (
                <ul className="space-y-4 mb-8">
                    {missingMaterials.map((m, i) => (
                    <li key={i} className="flex items-start gap-4 text-black">
                        <div className="w-6 h-6 border-4 border-black bg-white flex-shrink-0 mt-1"></div>
                        <span className="font-bold font-sans text-xl">{m}</span>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="bg-verde-100 border-4 border-verde-700 text-verde-900 p-6 text-center font-display text-2xl mb-8 rotate-1">
                    🎉 You have everything!
                </div>
                )}
            </div>
            
            <div className="border-t-4 border-dotted border-gray-300 pt-6">
                <h3 className="font-hand text-3xl font-bold mb-4 text-gray-400">From your stash:</h3>
                <ul className="space-y-2 text-base text-gray-500">
                {materials
                    .filter(m => !missingMaterials.includes(m))
                    .map((m, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <span className="text-verde-500 text-2xl font-black">✓</span>
                        <span className="line-through decoration-4 decoration-rosa-500/50 font-bold font-sans">{m}</span>
                    </li>
                    ))}
                </ul>
            </div>
          </div>
          
          <Button className="w-full text-2xl py-6 bg-rosa-500 hover:bg-rosa-600 text-white shadow-scrappy-lg font-display tracking-wider">Start Project 🚀</Button>
        </div>
      </div>
    </div>
  );
};
