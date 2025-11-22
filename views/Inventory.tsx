import React, { useState } from 'react';
import { Material } from '../types';
import { Button } from '../components/Button';

interface InventoryProps {
  items: Material[];
  onAdd: (item: Material) => void;
  onRemove: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, onAdd, onRemove }) => {
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    onAdd({
      id: Date.now().toString(),
      name: newName,
      quantity: newQty || '1 unit',
      category: 'General'
    });
    setNewName('');
    setNewQty('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-10 gap-6">
        <div className="bg-naranja-500 w-16 h-16 border-4 border-black flex items-center justify-center shadow-scrappy rounded-full animate-float">
          <span className="text-3xl">📦</span>
        </div>
        <h1 className="font-serif text-6xl font-black text-black drop-shadow-sm">My Stash</h1>
      </div>
      
      <div className="bg-sol-300 p-8 border-4 border-black shadow-scrappy mb-10 relative">
        <div className="absolute -top-4 -right-4 bg-white border-4 border-black px-4 py-2 rotate-3 text-base font-black shadow-sm uppercase tracking-widest text-rosa-500">
            Add New Stuff
        </div>
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-6">
          <input 
            type="text" 
            placeholder="Item name (e.g., Flour, Acrylic Paint)" 
            className="flex-1 border-4 border-black px-4 py-4 font-hand text-2xl focus:ring-0 focus:bg-white bg-white/90 placeholder-gray-500 shadow-sm"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Qty" 
            className="w-full md:w-40 border-4 border-black px-4 py-4 font-hand text-2xl focus:ring-0 focus:bg-white bg-white/90 placeholder-gray-500 shadow-sm"
            value={newQty}
            onChange={e => setNewQty(e.target.value)}
          />
          <Button type="submit" variant="primary" className="whitespace-nowrap">Add It +</Button>
        </form>
      </div>

      <div className="bg-white border-4 border-black shadow-scrappy overflow-hidden relative min-h-[400px]">
        {/* Notebook holes decoration - Vertical Strip */}
        <div className="absolute left-0 top-0 bottom-0 w-16 border-r-4 border-rosa-200 bg-sol-50 flex flex-col items-center pt-6 gap-8 z-10">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-300 shadow-inner"></div>
            ))}
        </div>

        {items.length === 0 ? (
          <div className="p-12 pl-24 text-center">
            <p className="font-hand text-4xl text-gray-300 rotate-[-2deg] mt-10">Your stash is empty!</p>
            <p className="text-gray-400 mt-4 text-xl">Add things to get project ideas.</p>
          </div>
        ) : (
          <div className="pl-16">
             {items.map((item, index) => (
                 <div key={item.id} className="flex items-center justify-between p-6 border-b-2 border-azul-100 hover:bg-azul-50 transition-colors group">
                    <div className="flex items-center gap-6">
                        <span className="font-hand text-3xl text-gray-300 font-bold group-hover:text-rosa-500 transition-colors">#{index + 1}</span>
                        <div>
                            <p className="font-serif font-bold text-2xl text-black">{item.name}</p>
                            <p className="text-sm font-black text-cobalt-500 uppercase tracking-wide bg-azul-100 inline-block px-2 py-0.5 rounded-sm mt-1 border border-black/10">{item.quantity}</p>
                        </div>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-black hover:text-rosa-600 hover:scale-110 transition-transform p-2 bg-white border-2 border-transparent hover:border-black hover:shadow-scrappy-sm rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};