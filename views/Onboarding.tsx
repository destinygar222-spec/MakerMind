

import React, { useState } from 'react';
import { UserProfile, SkillLevel, ToolCategory } from '../types';
import { STYLE_OPTIONS, COMMON_TOOLS, SKILL_CATEGORIES } from '../constants';
import { Button } from '../components/Button';
import { generateMakerPersona } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Initialize with existing profile if available (editing mode)
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile || {
    styles: [],
    tools: [],
    skills: {},
    perProjectBudget: 25, // Default per project budget
    name: "Maker"
  });

  const handleStyleToggle = (id: string) => {
    setProfile(prev => {
      const current = prev.styles || [];
      return {
        ...prev,
        styles: current.includes(id) 
          ? current.filter(s => s !== id)
          : [...current, id]
      };
    });
  };

  const handleToolToggle = (name: string) => {
    setProfile(prev => {
      const current = prev.tools || [];
      return {
        ...prev,
        tools: current.includes(name)
          ? current.filter(t => t !== name)
          : [...current, name]
      };
    });
  };

  const handleSkillChange = (category: string, level: string) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: level as SkillLevel
      }
    }));
  };

  const handleBudgetChange = (amount: number) => {
    setProfile(prev => ({ ...prev, perProjectBudget: amount }));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Only regenerate persona description if styles changed or if it's a new user
      let description = profile.styleDescription;
      
      // Simple check: if we are editing and styles differ, or if no description exists
      const originalStyles = initialProfile?.styles || [];
      const currentStyles = profile.styles || [];
      const hasStylesChanged = JSON.stringify(originalStyles.sort()) !== JSON.stringify(currentStyles.sort());

      if (!description || hasStylesChanged) {
         description = await generateMakerPersona(profile.styles || []);
      }

      const finalProfile: UserProfile = {
        name: profile.name || "Maker",
        styles: profile.styles || [],
        tools: profile.tools || [],
        skills: profile.skills as Record<string, SkillLevel>,
        perProjectBudget: profile.perProjectBudget || 25,
        styleDescription: description || "A creative maker."
      };
      onComplete(finalProfile);
    } catch (e: any) {
      console.error(e);
      // Let the user know something went wrong
      alert(`Could not generate your Maker Persona. The AI service might be unavailable. Please try again. Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Common Container
  // FIX: Made the 'children' prop optional to resolve a TypeScript error. The type checker incorrectly reported it as missing, even though it's always provided in usage.
  const Container = ({ children }: { children?: React.ReactNode }) => (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-paper border-4 border-black shadow-scrappy-lg relative animate-fadeIn pattern-grid-lg">
        <div className="absolute -top-6 -left-4 bg-naranja-500 text-white border-4 border-black px-6 py-3 shadow-scrappy font-display uppercase tracking-widest -rotate-2 text-2xl z-20">
            Step {step} / 4
        </div>
        {children}
    </div>
  );

  // Step 1: Style
  if (step === 1) {
    return (
      <Container>
        <div className="mb-12 text-center mt-8">
          <h1 className="font-display text-6xl md:text-7xl text-black mb-4 drop-shadow-md">The Vibe Check</h1>
          <p className="text-cobalt-500 font-sans italic text-4xl font-bold rotate-1">What makes your heart sing? Pick a mix!</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {STYLE_OPTIONS.map(style => {
            const isSelected = profile.styles?.includes(style.id);
            return (
                <div 
                key={style.id}
                onClick={() => handleStyleToggle(style.id)}
                className={`cursor-pointer relative aspect-square group transition-all border-4 ${isSelected ? 'border-rosa-500 shadow-scrappy scale-105 z-10 ring-4 ring-rosa-300' : 'border-black hover:scale-105'}`}
                >
                <div className={`w-full h-full ${style.color} flex items-center justify-center overflow-hidden relative`}>
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 bg-talavera opacity-20"></div>
                </div>
                
                <div className={`absolute inset-0 flex items-end justify-center p-4 transition-colors`}>
                    <span className={`border-4 border-black px-2 py-1 text-center text-lg leading-none font-display tracking-wide shadow-sm w-full ${isSelected ? 'bg-sol-500 text-black' : 'bg-white text-black'}`}>{style.name}</span>
                </div>
                {isSelected && (
                    <div className="absolute -top-3 -right-3 bg-verde-500 text-white border-4 border-black p-1 shadow-sm z-20 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </div>
                )}
                </div>
            );
          })}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setStep(2)} disabled={(profile.styles?.length || 0) === 0} size="lg" className="font-display text-xl">Next: Your Tools &rarr;</Button>
        </div>
      </Container>
    );
  }

  // Step 2: Tools
  if (step === 2) {
    return (
      <Container>
        <div className="mb-12 text-center mt-8">
          <h1 className="font-display text-6xl md:text-7xl text-black mb-4">Toolbox Audit</h1>
          <p className="text-cobalt-500 font-sans italic text-4xl font-bold -rotate-1">What's gathering dust in your garage?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {COMMON_TOOLS.map(tool => {
             const isSelected = profile.tools?.includes(tool.name);
             return (
                <div 
                key={tool.id} 
                onClick={() => handleToolToggle(tool.name)}
                className={`p-4 border-4 cursor-pointer flex items-center justify-between transition-all ${isSelected ? 'bg-azul-100 border-cobalt-500 shadow-scrappy translate-x-1 translate-y-1' : 'bg-white border-gray-300 hover:border-black hover:bg-sol-100'}`}
                >
                <div>
                    <span className="font-bold text-xl text-black block">{tool.name}</span>
                    <p className="text-xs font-black uppercase text-gray-500 tracking-wider">{tool.category}</p>
                </div>
                <div className={`w-8 h-8 border-4 flex items-center justify-center transition-colors ${isSelected ? 'bg-cobalt-500 border-black' : 'border-gray-300 bg-white'}`}>
                    {isSelected && <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                </div>
                </div>
             );
          })}
        </div>

        <div className="flex justify-between">
           <Button variant="ghost" onClick={() => setStep(1)} className="text-xl font-display">Back</Button>
           <Button onClick={() => setStep(3)} size="lg" className="font-display text-xl">Next: Skills &rarr;</Button>
        </div>
      </Container>
    );
  }

  // Step 3: Skills
  if (step === 3) {
    return (
      <Container>
        <div className="mb-12 text-center mt-8">
          <h1 className="font-display text-6xl md:text-7xl text-black mb-4">Skill Check</h1>
          <p className="text-cobalt-500 font-sans italic text-4xl font-bold">Be honest. We won't judge.</p>
        </div>

        <div className="space-y-8 mb-12">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={cat} className={`bg-white p-6 border-4 border-black shadow-scrappy-sm relative ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
              <div className="flex justify-between mb-4 items-center">
                <label className="font-display text-3xl text-black tracking-wide">{cat}</label>
                <span className="bg-rosa-500 text-white border-2 border-black px-4 py-1 text-lg font-bold transform rotate-2 shadow-sm">{profile.skills?.[cat] || SkillLevel.Novice}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="1"
                className="w-full h-8 bg-gray-200 rounded-none appearance-none cursor-pointer accent-sol-500 border-4 border-black"
                value={
                  profile.skills?.[cat] === SkillLevel.Expert ? 2 :
                  profile.skills?.[cat] === SkillLevel.Intermediate ? 1 : 0
                }
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const level = val === 2 ? SkillLevel.Expert : val === 1 ? SkillLevel.Intermediate : SkillLevel.Novice;
                  handleSkillChange(cat, level);
                }}
              />
              <div className="flex justify-between text-sm font-black text-gray-400 mt-2 uppercase tracking-widest">
                <span>Newbie</span>
                <span>Dabbler</span>
                <span>Pro</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)} className="text-xl font-display">Back</Button>
            <Button onClick={() => setStep(4)} size="lg" className="font-display text-xl">Next: Budget &rarr;</Button>
        </div>
      </Container>
    );
  }

  // Step 4: Budget (Updated to Per Project)
  return (
    <Container>
      <div className="mb-12 text-center mt-8">
        <h1 className="font-display text-6xl md:text-7xl text-black mb-4">The Treasure Chest</h1>
        <p className="text-cobalt-500 font-sans italic text-4xl font-bold -rotate-1">What's your budget per project?</p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
         <div className="bg-white p-10 border-4 border-black shadow-scrappy text-center relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-7xl">💰</div>
            
            <label className="block font-display text-3xl mb-6 mt-4">Average Cost Per Project</label>
            
            <div className="flex items-center justify-center gap-4 mb-8">
               <span className="font-display text-6xl text-naranja-500">$</span>
               <input 
                 type="number" 
                 min="0" 
                 max="500"
                 value={profile.perProjectBudget}
                 onChange={(e) => handleBudgetChange(parseInt(e.target.value) || 0)}
                 className="w-48 font-display text-6xl border-b-4 border-black text-center focus:outline-none focus:border-rosa-500 bg-transparent"
               />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
               {[10, 25, 50, 100].map(amt => (
                 <button 
                   key={amt}
                   onClick={() => handleBudgetChange(amt)}
                   className={`px-4 py-2 border-2 border-black font-bold uppercase tracking-wide shadow-sm transition-transform hover:-translate-y-1 ${profile.perProjectBudget === amt ? 'bg-azul-500 text-white' : 'bg-gray-100 hover:bg-azul-100'}`}
                 >
                   ${amt}
                 </button>
               ))}
            </div>

            <input 
              type="range" 
              min="5" 
              max="200" 
              step="5"
              value={profile.perProjectBudget}
              onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
              className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer accent-naranja-500 border-2 border-black"
            />
            <p className="mt-4 font-sans text-gray-500 italic">We'll suggest ideas around this price point.</p>
         </div>
      </div>

      <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setStep(3)} className="text-xl font-display">Back</Button>
          <Button onClick={handleFinish} isLoading={loading} size="lg" variant="primary" className="bg-naranja-500 hover:bg-naranja-700 text-white border-black shadow-scrappy-lg font-display text-2xl py-4">
            {initialProfile ? "Update Magic ✨" : "✨ Generate"}
          </Button>
      </div>
    </Container>
  );
};
