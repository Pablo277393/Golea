import React, { useState, useEffect } from 'react';
import { Target, Award, Trophy, ChevronRight, Star, Clock, Gift, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { gamificationService } from '../../services/api';

const PredictionsView = () => {
  const [matches, setMatches] = useState([]);
  const [prize, setPrize] = useState(null);
  const [predictions, setPredictions] = useState({}); // { matchId: 'LOCAL' | 'EMPATE' | 'VISITANTE' }
  const [savedMatchIds, setSavedMatchIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comboRes, prizeRes, userPredsRes] = await Promise.all([
          gamificationService.getCombo(),
          gamificationService.getWeeklyPrize(),
          gamificationService.getPredictions()
        ]);
        
        setMatches(comboRes.data);
        setPrize(prizeRes.data);
        
        // Map existing predictions
        const predMap = {};
        const savedIds = new Set();
        userPredsRes.data.forEach(p => {
          predMap[p.match_id] = p.prediction;
          savedIds.add(p.match_id);
        });
        setPredictions(predMap);
        setSavedMatchIds(savedIds);
        if (savedIds.size >= 3) setSubmitted(true);
      } catch (err) {
        console.error('Error fetching quiniela data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (matchId, value) => {
    // Check if match is locked (1 hour before) or already saved
    const match = matches.find(m => m.id === matchId);
    if (isMatchLocked(match) || savedMatchIds.has(matchId)) return;

    setPredictions(prev => ({
      ...prev,
      [matchId]: value
    }));
    setSubmitted(false);
  };

  const isMatchLocked = (match) => {
    if (!match) return true;
    const matchDateTime = new Date(`${match.match_date}T${match.match_time}`);
    const now = new Date();
    const diffMs = matchDateTime - now;
    const diffMins = diffMs / (1000 * 60);
    return diffMins < 60;
  };

  const handleSubmit = async () => {
    const predArray = Object.entries(predictions)
      .filter(([matchId]) => !savedMatchIds.has(parseInt(matchId)))
      .map(([matchId, val]) => ({
        match_id: parseInt(matchId),
        prediction: val
      }));

    if (predArray.length === 0 && savedMatchIds.size >= matches.length) {
      alert('Tus predicciones ya han sido guardadas y no pueden modificarse.');
      return;
    }

    if (Object.keys(predictions).length < matches.length) {
      alert('Por favor, complete todas las predicciones del combo.');
      return;
    }

    setSubmitting(true);
    try {
      await gamificationService.submitPredictions({ predictions: predArray });
      setSubmitted(true);
      setSavedMatchIds(new Set([...savedMatchIds, ...predArray.map(p => p.match_id)]));
      alert('¡Triple predicción guardada con éxito! Ya no podrás modificarla.');
    } catch (err) {
      console.error('Error submitting predictions:', err);
      alert(err.response?.data?.message || 'Error al guardar las predicciones.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-2">Triple Desafío Elite</h2>
          <p className="text-slate-400 font-medium tracking-wide">Acierta los 3 resultados para llevarte el premio de la semana.</p>
        </div>
        {prize && (
           <div className="flex items-center gap-4 px-6 py-3 bg-gold-gradient/[0.05] border border-primary/20 rounded-2xl animate-pulse">
              <Gift size={20} className="text-primary" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premio Semanal</span>
                <span className="text-sm font-bold text-white uppercase">{prize.description}</span>
              </div>
           </div>
        )}
      </header>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Triple Challenge Section */}
        {matches.map((match, idx) => {
          const locked = isMatchLocked(match);
          const alreadySaved = savedMatchIds.has(match.id);
          const selection = predictions[match.id];
          
          return (
            <Card key={match.id} className="p-0 overflow-hidden border-white/5 bg-white/[0.02]" hover={false}>
              <div className="bg-white/5 px-6 py-3 flex justify-between items-center border-b border-white/5">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Desafío {idx + 1} • {match.team_name}</span>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                  <Clock size={14} />
                  <span>{new Date(match.match_date).toLocaleDateString()} • {match.match_time.substring(0, 5)}</span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                  <div className="flex-1 text-center md:text-right">
                    <h4 className="text-lg font-bold text-white mb-1">{match.is_home ? match.team_name : match.opponent}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Local</p>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-dark rounded-full border border-white/5 text-slate-700 font-black italic">
                    VS
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-bold text-white mb-1">{match.is_home ? match.opponent : match.team_name}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Visitante</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['LOCAL', 'EMPATE', 'VISITANTE'].map((type) => (
                    <button
                      key={type}
                      disabled={locked || alreadySaved}
                      onClick={() => handleSelect(match.id, type)}
                      className={`py-4 rounded-xl border font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${
                        selection === type 
                          ? 'bg-primary border-primary text-dark shadow-gold-glow scale-105 z-10'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                      } ${locked || (alreadySaved && selection !== type) ? 'opacity-50 cursor-not-allowed' : ''} ${alreadySaved && selection === type ? 'ring-2 ring-primary ring-offset-2 ring-offset-dark' : ''}`}
                    >
                      <span className="text-sm">{type === 'EMPATE' ? 'X' : type === 'LOCAL' ? '1' : '2'}</span>
                      <div className="text-[9px] mt-1 opacity-60">{type.substring(0, 3)}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {locked ? (
                <div className="bg-red-500/10 px-6 py-2 border-t border-red-500/20 text-center">
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Predicción Cerrada</span>
                </div>
              ) : alreadySaved ? (
                <div className="bg-green-500/10 px-6 py-2 border-t border-green-500/20 text-center">
                  <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Predicción Confirmada</span>
                </div>
              ) : null}
            </Card>
          );
        })}

        <div className="pt-6">
          <Button 
            variant={submitted ? "secondary" : "primary"}
            className={`w-full py-6 text-xl rounded-2xl ${!submitted ? 'shadow-gold-glow' : ''}`}
            onClick={handleSubmit}
            disabled={submitting || Object.keys(predictions).length < matches.length || submitted}
            icon={submitted ? CheckCircle2 : Target}
          >
            {submitting ? 'Guardando...' : submitted ? 'Predicción Guardada' : 'Confirmar Triple Predicción'}
          </Button>
          
          <div className="mt-8 p-8 bg-primary/5 border border-primary/10 rounded-2xl">
             <div className="flex gap-4 items-start">
               <Star size={20} className="text-primary shrink-0 mt-1" />
               <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Premios del Triple Desafío</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Gana el <span className="text-white font-bold">Premio Semanal</span> acertando tu partido y el resultado aleatorio. ¡Si además aciertas el del <span className="text-primary font-bold">Primer Equipo</span>, te llevas el <span className="text-white font-bold italic">Premio Bonus</span>! Las predicciones se cierran 1 hora antes de cada inicio.
                  </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsView;
