import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Circle, User } from 'lucide-react';
import Button from './ui/Button';

const CallupVisual = ({ players, initialSelected = [], onSelectionChange, onConfirm }) => {
  const [selectedIds, setSelectedIds] = useState(initialSelected);

  useEffect(() => {
    setSelectedIds(initialSelected);
  }, [initialSelected]);

  const togglePlayer = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(p => p !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    if (onSelectionChange) onSelectionChange(newSelected);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {players.map((player) => {
          const isSelected = selectedIds.includes(player.id);
          return (
            <div
              key={player.id}
              onClick={() => togglePlayer(player.id)}
              className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 text-center border group ${isSelected
                  ? 'bg-primary/10 border-primary shadow-gold-glow'
                  : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                }`}
            >
              <div className="absolute top-3 right-3">
                {isSelected ? (
                  <CheckCircle2 size={18} className="text-primary animate-in zoom-in duration-300" />
                ) : (
                  <Circle size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                )}
              </div>

              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border transition-all duration-300 ${isSelected
                  ? 'bg-primary text-dark border-primary scale-110 shadow-gold/20 shadow-lg'
                  : 'bg-white/5 text-slate-400 border-white/10 group-hover:border-primary/30 group-hover:text-primary-light'
                }`}>
                {player.jerseyNumber ? (
                  <span className="text-xl font-bold">{player.jerseyNumber}</span>
                ) : (
                  <User size={24} />
                )}
              </div>

              <h4 className={`font-bold text-sm mb-1 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                {player.name}
              </h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {player.position}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Users size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado de Selección</p>
            <p className="font-bold text-white leading-none">
              {selectedIds.length} <span className="text-slate-400 font-medium">Jugadores convocados</span>
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          disabled={selectedIds.length === 0}
          className="w-full sm:w-auto px-8"
          onClick={() => onConfirm && onConfirm(selectedIds)}
        >
          Confirmar Convocatoria
        </Button>
      </div>
    </div>
  );
};

export default CallupVisual;
