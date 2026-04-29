import React from 'react';
import { Trophy, Check, X as CloseIcon, MapPin, Clock, Plus, Calendar } from 'lucide-react';
import Card from './Card';

const AttendanceExcelTable = ({ 
  players = [], 
  trainings = [], 
  attendanceData = [], 
  onToggleStatus, 
  onToggleGoldenCone,
  onAddSession,
  readOnly = false 
}) => {
  // Map attendance into a lookup object: { "training_id-player_id": { status, is_golden_cone } }
  const attendanceMap = (attendanceData || []).reduce((acc, curr) => {
    acc[`${curr.training_id}-${curr.player_id}`] = curr;
    return acc;
  }, {});

  return (
    <div className="w-full bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-glass animate-in fade-in zoom-in-95 duration-500">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="sticky left-0 z-20 bg-dark-card/90 backdrop-blur-md px-8 py-6 text-left border-r border-white/5 min-w-[240px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Jugadores / Fecha</span>
                </div>
                {!readOnly && onAddSession && (
                  <button 
                    onClick={onAddSession}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest transition-all"
                  >
                    <Plus size={14} /> Nueva Sesión
                  </button>
                )}
              </th>
              {trainings.map((t) => (
                <th key={t.id} className="px-6 py-6 text-center border-r border-white/5 min-w-[120px]">
                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">
                      {t.training_date ? t.training_date.split('-').slice(1).reverse().join('/') : 'S/F'}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                      <Clock size={10} /> {t.training_time.substring(0, 5)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="sticky left-0 z-20 bg-dark-card/90 backdrop-blur-md px-8 py-5 border-r border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                      #{player.jersey_number || player.id}
                    </div>
                    <div>
                      <p className="font-bold text-slate-200 group-hover:text-primary transition-colors">
                        {player.first_name || player.username} {player.last_name || ''}
                      </p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">@{player.username}</p>
                    </div>
                  </div>
                </td>
                {trainings.map((training) => {
                  const record = attendanceMap[`${training.id}-${player.id}`];
                  const isPresent = !record || record.status === 'present';
                  const isGolden = record?.is_golden_cone === 1;

                  return (
                    <td 
                      key={`${training.id}-${player.id}`} 
                      className={`px-4 py-4 text-center border-r border-white/5 relative ${!readOnly ? 'cursor-pointer hover:bg-white/5' : ''}`}
                      onClick={() => !readOnly && onToggleStatus(training.id, player.id, isPresent ? 'absent' : 'present')}
                    >
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                          isPresent 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                          {isPresent ? <Check size={20} /> : <CloseIcon size={20} />}
                        </div>
                        
                        {!readOnly ? (
                          <button 
                            className={`p-2 rounded-xl border transition-all ${
                              isGolden 
                                ? 'bg-gold-gradient text-dark border-primary shadow-gold-glow scale-110' 
                                : 'bg-white/5 text-slate-500 border-white/10 hover:border-primary/50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleGoldenCone(training.id, player.id, !isGolden);
                            }}
                          >
                            <Trophy size={14} />
                          </button>
                        ) : (
                          isGolden && (
                            <div className="absolute -top-1 -right-1 animate-bounce">
                              <div className="bg-gold-gradient p-1.5 rounded-full shadow-gold-glow">
                                <Trophy size={10} className="text-dark" />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {trainings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-dark-card/50">
          <Calendar size={48} className="text-slate-700 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">No hay sesiones registradas</p>
          {!readOnly && onAddSession && (
            <button 
              onClick={onAddSession}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-gold-glow"
            >
              <Plus size={18} /> Crear Primera Sesión
            </button>
          )}
        </div>
      )}
      
      <div className="p-6 bg-white/5 border-t border-white/5 flex flex-wrap gap-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asistido</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/40"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Falta</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-gold-gradient shadow-gold-glow"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cono de Oro</span>
        </div>
        {!readOnly && (
          <div className="ml-auto text-[10px] font-medium italic text-slate-500">
            * Haz clic en las celdas para alternar estado. Pulsa el trofeo para el Cono de Oro.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceExcelTable;
