
import React from 'react';
import { Project } from '../types';
import { Button } from './Button';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onToggleSave?: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, onToggleSave, isSaved }) => {
  // Vibrant backgrounds for cards - maximalist rotation
  const colors = ['bg-rosa-100', 'bg-azul-100', 'bg-sol-100', 'bg-morado-100', 'bg-verde-100'];
  const titleLength = project.title ? project.title.length : 0;
  const bgClass = colors[titleLength % colors.length];

  return (
    <div className={`group relative flex flex-col h-full border-4 border-black shadow-scrappy bg-white transition-transform hover:-translate-y-2 duration-300`}>
      {/* Image/Color Section */}
      <div className="relative h-64 border-b-4 border-black overflow-hidden cursor-pointer" onClick={onClick}>
        <div className={`w-full h-full ${project.color || 'bg-rosa-500'} transition-transform duration-500 scale-100 group-hover:scale-105 flex items-center justify-center`}>
            {/* Optional Pattern Overlay */}
            <div className="w-full h-full opacity-20 bg-talavera"></div>
        </div>
        
        {/* Match Score Badge - Marigold */}
        <div className="absolute top-3 right-3 bg-sol-500 border-2 border-black px-3 py-1 text-xl font-display text-black shadow-scrappy-sm rotate-2 z-20">
          {project.matchScore}% Match
        </div>
        
        {/* Category Badge - Cobalt (Moved Higher per user request) */}
        <div className="absolute bottom-4 left-2 bg-cobalt-500 border-2 border-black text-white px-4 py-1 text-lg font-display -rotate-2 shadow-scrappy-sm z-20">
          {project.category}
        </div>
      </div>

      <div className={`p-6 pt-10 flex flex-col flex-grow ${bgClass}`}>
        <h3 className="font-display text-4xl text-black mb-2 leading-none mt-2 tracking-wide drop-shadow-sm cursor-pointer hover:text-cobalt-700 transition-colors" onClick={onClick}>{project.title}</h3>
        
        {/* Scrappy Divider - Hot Pink */}
        <div className="h-4 w-24 bg-rosa-500 border-2 border-black mb-4 transform -skew-x-12"></div>

        <p className="font-sans text-lg text-gray-900 mb-6 flex-grow leading-snug font-bold opacity-80">{project.description}</p>
        
        <div className="flex items-center justify-between text-xs font-black text-black uppercase tracking-widest mb-6 border-t-4 border-black/10 pt-4 border-dashed">
          <span className="flex items-center bg-white px-2 py-1 border-2 border-black rounded-none shadow-sm">
            <span className="mr-1 text-xl">⏱</span> {project.timeEstimate}
          </span>
          <span className={`px-2 py-1 border-2 border-black shadow-sm ${(project.missingMaterials?.length || 0) === 0 ? 'bg-verde-500 text-white' : 'bg-naranja-500 text-white'}`}>
            ${project.costEstimate} Est.
          </span>
        </div>

        <div className="flex gap-3 mt-auto">
            <Button variant="outline" size="sm" onClick={onClick} className="flex-1 bg-white hover:bg-black hover:text-white font-display text-xl tracking-wider py-3">
            View
            </Button>
            {onToggleSave && (
                <button 
                    onClick={onToggleSave} 
                    className={`border-4 border-black p-3 shadow-scrappy transition-all hover:-translate-y-1 active:translate-y-0 ${isSaved ? 'bg-rosa-500 text-white' : 'bg-white text-gray-300 hover:text-rosa-500'}`}
                >
                    <svg className="w-8 h-8" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
