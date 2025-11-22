
import React, { useState, useEffect } from 'react';
import { UserProfile, ViewState, Project, Material, WeeklySchedule, Review } from './types';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { Inventory } from './views/Inventory';
import { ProjectDetail } from './views/ProjectDetail';
import { Calendar } from './views/Calendar';
import { Saved } from './views/Saved';

const App: React.FC = () => {
  // Local Storage Persistence
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('maker_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [inventory, setInventory] = useState<Material[]>(() => {
    const saved = localStorage.getItem('maker_inventory');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [savedProjects, setSavedProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('maker_saved_projects');
    try {
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [schedule, setSchedule] = useState<WeeklySchedule>(() => {
     const saved = localStorage.getItem('maker_schedule');
     try {
       return saved ? JSON.parse(saved) : {};
     } catch {
       return {};
     }
  });

  const [reviews, setReviews] = useState<Record<string, Review[]>>(() => {
    const saved = localStorage.getItem('maker_reviews');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [view, setView] = useState<ViewState>(user ? 'dashboard' : 'onboarding');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Effects for persistence
  useEffect(() => {
    if (user) localStorage.setItem('maker_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('maker_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('maker_saved_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem('maker_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('maker_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Handlers
  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    setView('dashboard');
  };

  const handleInventoryAdd = (item: Material) => {
    setInventory(prev => [...prev, item]);
  };

  const handleInventoryRemove = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const handleSelectProject = (p: Project) => {
    setSelectedProject(p);
    setView('project_detail');
  };

  const handleToggleSave = (p: Project) => {
     setSavedProjects(prev => {
         const exists = prev.find(sp => sp.id === p.id);
         if (exists) {
             return prev.filter(sp => sp.id !== p.id);
         } else {
             return [...prev, p];
         }
     });
  };

  const handleUpdateSchedule = (day: string, projectId: string) => {
      setSchedule(prev => {
          const current = prev[day] || [];
          if (current.includes(projectId)) return prev;
          return { ...prev, [day]: [...current, projectId] };
      });
  };

  const handleRemoveFromSchedule = (day: string, projectId: string) => {
      setSchedule(prev => ({
          ...prev,
          [day]: (prev[day] || []).filter(id => id !== projectId)
      }));
  };

  const handleAddReview = (review: Review) => {
    setReviews(prev => {
      const projectReviews = prev[review.projectId] || [];
      return {
        ...prev,
        [review.projectId]: [review, ...projectReviews] // Newest first
      };
    });
  };

  const handleEditProfile = () => {
    setView('onboarding');
  };

  // Background Component
  const Background = () => (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-sol-100">
       {/* Base Pattern: Talavera Tiles - Very colorful */}
       <div className="absolute inset-0 bg-talavera bg-talavera opacity-80"></div>
       
       {/* Subtle Sarape Accent at bottom or top */}
       <div className="absolute inset-x-0 top-0 h-32 bg-sarape opacity-20 mix-blend-multiply"></div>

       {/* Animated Blobs for extra dynamic color */}
       <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-rosa-300/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-azul-300/40 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
       <div className="absolute top-[40%] left-[30%] w-[60vw] h-[60vw] bg-sol-300/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
       
       {/* Light overlay just to ensure text contrast isn't impossible, but keep it colorful */}
       <div className="absolute inset-0 bg-white/40 mix-blend-soft-light"></div>
    </div>
  );

  // Simple Layout Wrapper
  const renderLayout = (content: React.ReactNode) => (
    <div className="min-h-screen flex flex-col relative">
      <Background />
      
      {/* Navbar - Deep Cobalt Blue with thick border */}
      <nav className="bg-cobalt-900 border-b-4 border-black sticky top-0 z-50 shadow-scrappy-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-28 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="bg-naranja-500 border-4 border-black p-2 mr-4 -rotate-3 shadow-scrappy-sm group-hover:rotate-3 transition-transform">
                 <span className="text-4xl">🏵️</span>
              </div>
              <span className="font-display text-4xl md:text-6xl text-white tracking-wide drop-shadow-[4px_4px_0px_#C51162] -rotate-1 hidden md:block">MakerMind</span>
            </div>
            {user && (
              <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
                {[
                    { id: 'dashboard', label: 'Projects', color: 'bg-sol-500', hover: 'text-sol-300' },
                    { id: 'saved', label: 'Saved', color: 'bg-rosa-500', hover: 'text-rosa-300' },
                    { id: 'calendar', label: 'Planner', color: 'bg-verde-500', hover: 'text-verde-300' },
                    { id: 'inventory', label: 'Stash', color: 'bg-morado-500', hover: 'text-morado-300' }
                ].map(nav => (
                    <button 
                        key={nav.id}
                        onClick={() => setView(nav.id as ViewState)}
                        className={`text-sm md:text-xl font-bold uppercase font-display tracking-wider hover:-translate-y-0.5 transition-transform px-3 py-2 whitespace-nowrap ${view === nav.id ? `${nav.color} text-black border-4 border-black shadow-scrappy-sm -rotate-1` : `text-white hover:${nav.hover}`}`}
                    >
                        {nav.label}
                    </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-grow p-2 md:p-4">
        {content}
      </main>
      
      <footer className="bg-black text-white py-12 mt-16 border-t-8 border-naranja-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-talavera opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center font-display text-2xl relative z-10 tracking-wider">
          <p>Made with <span className="text-rosa-500 animate-pulse">❤</span> & <span className="text-sol-500 animate-spin inline-block">☀</span> by MakerMind</p>
        </div>
      </footer>
    </div>
  );

  if (!user || view === 'onboarding') {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
         <Background />
         <div className="relative z-10">
            <Onboarding 
              onComplete={handleOnboardingComplete} 
              initialProfile={user} // Pass existing user to enable editing
            />
         </div>
      </div>
    );
  }

  switch (view) {
    case 'inventory':
      return renderLayout(
        <Inventory 
          items={inventory} 
          onAdd={handleInventoryAdd} 
          onRemove={handleInventoryRemove} 
        />
      );
    case 'calendar':
      return renderLayout(
        <Calendar 
            savedProjects={savedProjects}
            schedule={schedule}
            onUpdateSchedule={handleUpdateSchedule}
            onRemoveFromSchedule={handleRemoveFromSchedule}
        />
      );
    case 'saved':
      return renderLayout(
          <Saved 
             projects={savedProjects}
             onSelectProject={handleSelectProject}
             onRemoveProject={(id) => handleToggleSave({ id } as Project)}
          />
      );
    case 'project_detail':
      if (!selectedProject) {
        setView('dashboard');
        return null;
      }
      return renderLayout(
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setView('dashboard')}
          reviews={reviews[selectedProject.id] || []}
          onAddReview={handleAddReview}
        />
      );
    case 'dashboard':
    default:
      return renderLayout(
        <Dashboard 
          user={user} 
          inventory={inventory} 
          onSelectProject={handleSelectProject}
          onEditProfile={handleEditProfile}
        />
      );
  }
};

export default App;
