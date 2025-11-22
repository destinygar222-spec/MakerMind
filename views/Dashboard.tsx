
import React, { useEffect, useState } from 'react';
import { UserProfile, Project, Material } from '../types';
import { getRecommendedProjects, getStashBusterProject } from '../services/geminiService';
import { ProjectCard } from '../components/ProjectCard';
import { Button } from '../components/Button';

interface DashboardProps {
  user: UserProfile;
  inventory: Material[];
  onSelectProject: (p: Project) => void;
  onEditProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, inventory, onSelectProject, onEditProfile }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [stashBuster, setStashBuster] = useState<Project | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      setLoading(true);
      try {
        const [recs, stash] = await Promise.all([
          getRecommendedProjects(user, inventory),
          inventory.length > 0 ? getStashBusterProject(inventory) : Promise.resolve(null)
        ]);
        
        if (isMounted) {
          setProjects(recs);
          setStashBuster(stash);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProjects();

    return () => { isMounted = false; };
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-12 text-center md:text-left border-b-8 border-rosa-500 pb-8 bg-white/80 backdrop-blur-sm p-8 border-4 border-black shadow-scrappy relative">
        <div className="absolute top-0 right-0 bg-cobalt-500 w-full h-3 border-b-4 border-black"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="inline-block bg-sol-500 border-4 border-black px-6 py-2 shadow-scrappy-sm -rotate-2 transform origin-left">
                <span className="font-display uppercase text-xl tracking-widest text-black">Maker OS v1.0</span>
            </div>
            <Button variant="outline" onClick={onEditProfile} size="sm" className="mt-4 md:mt-0 font-display text-lg bg-white hover:bg-azul-100">
                ✎ Edit DNA
            </Button>
        </div>

        <h1 className="font-display text-7xl md:text-8xl text-black drop-shadow-sm mb-4 leading-none">Hola, {user.name}!</h1>
        
        {/* Updated Font to Roman Rustic (Crimson Text Italic) */}
        <p className="font-sans italic font-bold text-3xl md:text-4xl text-cobalt-900 mt-2 max-w-3xl leading-tight bg-azul-100 inline-block px-4 py-2 border-2 border-transparent transform rotate-1 shadow-sm">
            {user.styleDescription}
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center">
          {/* Loading Note */}
          <div className="bg-sol-100 border-4 border-black p-6 mb-12 shadow-scrappy rotate-1 text-center max-w-xl animate-float">
             <h3 className="font-display text-3xl mb-2">Brewing Creativity... ☕️</h3>
             <p className="font-sans text-2xl text-gray-800">Please wait a moment while we conjure up 5 personalized projects just for you.</p>
             <div className="mt-4 text-4xl animate-spin inline-block">⚙️</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse w-full">
             {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-200 border-4 border-black shadow-scrappy"></div>)}
          </div>
        </div>
      ) : (
        <>
           {/* Stash Buster Highlight */}
           {stashBuster && (
             <div className="mb-16 relative group">
                {/* Background Decoration */}
                <div className="absolute inset-0 bg-morado-500 translate-x-3 translate-y-3 border-4 border-black"></div>
                
                <div className="relative bg-white border-4 border-black p-0 md:flex items-stretch overflow-hidden">
                  <div className="md:w-1/3 relative border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[200px]">
                    {/* Color Block for Stash Buster */}
                    <div className={`w-full h-full ${stashBuster.color || 'bg-rosa-500'} relative flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-sarape opacity-20"></div>
                        <span className="text-6xl animate-bounce">✨</span>
                    </div>
                    <div className="absolute top-0 left-0 bg-rosa-500 text-white text-2xl font-display px-6 py-3 border-b-4 border-r-4 border-black shadow-sm z-10">
                        STASH BUSTER
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-sol-100 via-white to-rosa-100">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-naranja-500 text-white px-4 py-1 border-2 border-black text-sm font-black uppercase tracking-widest shadow-scrappy-sm">Uses your inventory</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-display mb-4 text-black leading-none">{stashBuster.title}</h2>
                    <p className="font-sans text-2xl text-gray-800 mb-8 leading-8 border-l-4 border-cobalt-500 pl-4">{stashBuster.description}</p>
                    <div className="flex gap-4">
                      <Button variant="primary" size="lg" onClick={() => onSelectProject(stashBuster)} className="font-display text-xl">Start This Now!</Button>
                    </div>
                  </div>
                </div>
             </div>
           )}

           <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
             <div className="relative inline-block">
                <div className="absolute inset-0 bg-verde-500 translate-x-2 translate-y-2 border-2 border-black"></div>
                <h2 className="relative bg-white border-4 border-black px-8 py-2 text-4xl font-display uppercase z-10 tracking-wide text-black">Curated For You</h2>
             </div>
             <Button variant="ghost" size="sm" onClick={() => window.location.reload()} className="font-hand text-3xl underline decoration-wavy decoration-rosa-500 hover:text-rosa-600">Shuffle Ideas ↺</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {projects.map(p => (
               <ProjectCard key={p.id} project={p} onClick={() => onSelectProject(p)} />
             ))}
           </div>

           {projects.length === 0 && !loading && (
             <div className="text-center py-24 border-8 border-dashed border-black/20 bg-white/50">
               <p className="font-hand text-5xl text-gray-500">AI is taking a siesta... try refreshing?</p>
             </div>
           )}
        </>
      )}
    </div>
  );
};
