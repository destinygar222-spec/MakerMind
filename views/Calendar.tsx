
import React, { useState } from 'react';
import { Project, WeeklySchedule } from '../types';
import { Button } from '../components/Button';

interface CalendarProps {
  savedProjects: Project[];
  schedule: WeeklySchedule;
  onUpdateSchedule: (day: string, projectId: string) => void;
  onRemoveFromSchedule: (day: string, projectId: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const Calendar: React.FC<CalendarProps> = ({ savedProjects, schedule, onUpdateSchedule, onRemoveFromSchedule }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleAddToDay = (projectId: string) => {
    if (selectedDay) {
      onUpdateSchedule(selectedDay, projectId);
      setSelectedDay(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex items-center mb-10 gap-6 flex-wrap">
        <div className="bg-verde-500 w-16 h-16 border-4 border-black flex items-center justify-center shadow-scrappy rounded-none rotate-3">
          <span className="text-3xl">📅</span>
        </div>
        <h1 className="font-display text-6xl font-black text-black drop-shadow-sm">El Calendario</h1>
        <p className="font-sans italic text-2xl text-cobalt-900 bg-white border-2 border-black px-4 py-1 shadow-sm">Plan your creative week!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DAYS.map((day, idx) => {
           const projectIds = schedule[day] || [];
           const dayProjects = savedProjects.filter(p => projectIds.includes(p.id));

           return (
             <div key={day} className={`flex flex-col border-4 border-black bg-paper min-h-[300px] shadow-scrappy relative ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
               {/* Header */}
               <div className="bg-black text-white p-3 border-b-4 border-black text-center">
                 <h3 className="font-display text-2xl uppercase tracking-widest">{day}</h3>
               </div>

               {/* Content */}
               <div className="p-4 flex-grow space-y-4">
                 {dayProjects.length > 0 ? (
                   dayProjects.map(p => (
                     <div key={p.id} className="bg-white border-2 border-black p-3 shadow-sm relative group">
                       <h4 className="font-bold font-display text-lg leading-tight mb-1">{p.title}</h4>
                       <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-black uppercase bg-sol-200 px-1">{p.timeEstimate}</span>
                          <button 
                            onClick={() => onRemoveFromSchedule(day, p.id)}
                            className="text-red-500 hover:bg-red-100 p-1 rounded"
                          >
                            🗑
                          </button>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-30">
                      <span className="font-hand text-2xl rotate-[-5deg]">Free time!</span>
                   </div>
                 )}
               </div>

               {/* Add Button */}
               <div className="p-4 border-t-4 border-black bg-gray-50">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="w-full border-2 border-black shadow-sm font-display text-lg"
                   onClick={() => setSelectedDay(day)}
                 >
                   + Add Project
                 </Button>
               </div>
             </div>
           );
        })}
      </div>

      {/* Modal for selecting a project */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-paper border-4 border-black shadow-scrappy-lg w-full max-w-lg max-h-[80vh] flex flex-col animate-blob">
              <div className="p-6 border-b-4 border-black flex justify-between items-center bg-rosa-500 text-white">
                 <h3 className="font-display text-3xl">Add to {selectedDay}</h3>
                 <button onClick={() => setSelectedDay(null)} className="text-4xl font-display hover:text-black">&times;</button>
              </div>
              <div className="p-6 overflow-y-auto flex-grow">
                 {savedProjects.length === 0 ? (
                    <p className="font-hand text-2xl text-center">No saved projects yet! Go save some hearts first.</p>
                 ) : (
                    <div className="space-y-3">
                       {savedProjects.map(p => (
                          <button 
                            key={p.id}
                            onClick={() => handleAddToDay(p.id)}
                            className="w-full text-left p-4 border-2 border-black bg-white hover:bg-azul-100 shadow-sm transition-transform hover:translate-x-2 flex items-center gap-4"
                          >
                             {/* Color Thumbnail */}
                             <div className={`w-12 h-12 border border-black ${p.color || 'bg-gray-300'} flex-shrink-0`}></div>
                             <div>
                                <h4 className="font-bold font-display text-xl">{p.title}</h4>
                                <p className="text-sm text-gray-500">{p.category} • {p.timeEstimate}</p>
                             </div>
                          </button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
