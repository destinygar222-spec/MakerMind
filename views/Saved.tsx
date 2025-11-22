
import React, { useState } from 'react';
import { Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { Button } from '../components/Button';

interface SavedProps {
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onRemoveProject: (id: string) => void;
}

export const Saved: React.FC<SavedProps> = ({ projects, onSelectProject, onRemoveProject }) => {
  const [maxBudget, setMaxBudget] = useState<number>(1000);

  const filteredProjects = projects.filter(p => (p.costEstimate || 0) <= maxBudget);
  const maxCostInList = Math.max(...projects.map(p => p.costEstimate || 0), 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end mb-10 gap-6 border-b-4 border-black pb-8">
        <div className="flex items-center gap-6">
            <div className="bg-rosa-500 w-16 h-16 border-4 border-black flex items-center justify-center shadow-scrappy rounded-full animate-pulse">
            <span className="text-3xl">❤</span>
            </div>
            <div>
                <h1 className="font-display text-6xl font-black text-black drop-shadow-sm">Mi Colección</h1>
                <p className="font-sans italic text-2xl text-gray-600">Your saved recipes & blueprints.</p>
            </div>
        </div>

        {/* Sliding Budget Feature */}
        <div className="flex-grow md:ml-12 bg-white p-6 border-4 border-black shadow-scrappy relative">
            <div className="absolute -top-4 left-4 bg-naranja-500 text-white font-display px-2 py-1 border-2 border-black text-sm uppercase tracking-widest rotate-2">
                Sliding Budget Filter
            </div>
            <label className="flex justify-between font-bold font-display text-xl mb-2">
                <span>Max Cost: <span className="text-rosa-600">${maxBudget}</span></span>
                <span className="text-gray-400 text-sm font-sans self-center">Showing {filteredProjects.length} of {projects.length}</span>
            </label>
            <input 
                type="range" 
                min="0" 
                max={maxCostInList + 50} 
                step="5" 
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-cobalt-500 border-2 border-black"
            />
            <div className="flex justify-between text-xs font-black uppercase mt-2 text-gray-400">
                <span>$0</span>
                <span>${maxCostInList}+</span>
            </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white/50 border-4 border-dashed border-black/20">
            <p className="font-hand text-5xl text-gray-400 rotate-1 mb-4">Nothing saved yet!</p>
            <p className="font-sans text-xl text-gray-500">Go back to the Dashboard to find projects you love.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(p => (
                <div key={p.id} className="relative">
                    <ProjectCard 
                        project={p} 
                        onClick={() => onSelectProject(p)}
                        isSaved={true}
                        onToggleSave={() => onRemoveProject(p.id)}
                    />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
