import React, { useState, useEffect } from 'react';
import { adService } from '../../services/api';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  TrendingUp, 
  Eye, 
  MousePointer2, 
  Calendar,
  X,
  Upload,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Gem,
  Award,
  Zap
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AdsAdminView = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    start_date: '',
    end_date: '',
    active: true,
    priority: 1
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const PRIORITY_PLANS = [
    { label: 'Básico', value: 1, icon: <Zap size={14} />, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
    { label: 'Pro', value: 3, icon: <Award size={14} />, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    { label: 'Premium', value: 5, icon: <Gem size={14} />, color: 'text-primary bg-primary/10 border-primary/20' }
  ];

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await adService.getAllAds();
      setAds(res.data);
    } catch (err) {
      console.error('Error fetching ads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        url: ad.url,
        start_date: ad.start_date || '',
        end_date: ad.end_date || '',
        active: ad.active === 1,
        priority: ad.priority || 1
      });
      setPreviewUrl(ad.image ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${ad.image}` : null);
    } else {
      setEditingAd(null);
      setFormData({ title: '', url: '', start_date: '', end_date: '', active: true, priority: 1 });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('url', formData.url);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('active', formData.active);
    data.append('priority', formData.priority);
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editingAd) {
        await adService.updateAd(editingAd.id, data);
      } else {
        await adService.createAd(data);
      }
      setShowModal(false);
      fetchAds();
    } catch (err) {
      alert('Error saving ad');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este anuncio?')) return;
    try {
      await adService.deleteAd(id);
      fetchAds();
    } catch (err) {
      alert('Error deleting ad');
    }
  };

  const calculateCTR = (clicks, imps) => {
    if (!imps) return '0%';
    return `${((clicks / imps) * 100).toFixed(1)}%`;
  };

  const getPlanBadge = (prio) => {
    const plan = PRIORITY_PLANS.find(p => p.value === prio) || PRIORITY_PLANS[0];
    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${plan.color}`}>
         {plan.icon} {plan.label}
      </span>
    );
  };

  if (loading && ads.length === 0) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Ad Manager <span className="text-primary text-sm bg-primary/10 px-3 py-1 rounded-full ml-4 uppercase tracking-[0.2em] font-black">Pro</span></h2>
          <p className="text-slate-400 font-medium font-inter transition-all hover:text-slate-200">Gestión avanzada de banners con prioridad probabilística.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
          Nuevo Anuncio
        </Button>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-primary/10"></div>
           <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary relative z-10 transition-transform group-hover:scale-110">
              <Eye size={24} />
           </div>
           <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Impresiones Totales</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{ads.reduce((acc, current) => acc + (current.impressions || 0), 0).toLocaleString()}</h3>
           </div>
        </Card>
        <Card className="flex items-center gap-4 border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-orange-500/10"></div>
           <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 relative z-10 transition-transform group-hover:scale-110">
              <MousePointer2 size={24} />
           </div>
           <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Clics Totales</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{ads.reduce((acc, current) => acc + (current.clicks || 0), 0).toLocaleString()}</h3>
           </div>
        </Card>
        <Card className="flex items-center gap-4 border-white/5 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10"></div>
           <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 relative z-10 transition-transform group-hover:scale-110">
              <BarChart3 size={24} />
           </div>
           <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">CTR Promedio</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                 {ads.length > 0 ? calculateCTR(
                    ads.reduce((acc, c) => acc + (c.clicks || 0), 0),
                    ads.reduce((acc, c) => acc + (c.impressions || 0), 0)
                 ) : '0%'}
              </h3>
           </div>
        </Card>
      </div>

      {/* Ads Table */}
      <Card className="p-0 overflow-hidden border-white/5" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-white/5">
                <tr className="text-left border-b border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Anuncio</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Nivel Prioridad</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Rendimiento</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ads.map(ad => (
                  <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-white/10 overflow-hidden border border-white/5 group-hover:border-primary/30 transition-all">
                           {ad.image ? (
                             <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${ad.image}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-600"><AlertCircle size={16}/></div>
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-primary transition-colors">{ad.title}</p>
                          <p className="text-xs text-slate-500 underline truncate max-w-[200px] hover:text-slate-300 transition-colors cursor-pointer">{ad.url}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-2">
                          {getPlanBadge(ad.priority)}
                          <div className={`flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest ${ad.active === 1 ? 'text-green-400' : 'text-slate-600'}`}>
                             <div className={`w-1 h-1 rounded-full ${ad.active === 1 ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div> {ad.active === 1 ? 'En línea' : 'Desconectado'}
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                             <span>Efectividad</span>
                             <span className="text-primary">{calculateCTR(ad.clicks, ad.impressions)}</span>
                          </div>
                          <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-primary" 
                                style={{ width: calculateCTR(ad.clicks, ad.impressions) }}
                             ></div>
                          </div>
                          <div className="flex gap-3 text-[10px] text-slate-500 font-bold">
                             <span className="flex items-center gap-1"><Eye size={10}/> {ad.impressions}</span>
                             <span className="flex items-center gap-1"><MousePointer2 size={10}/> {ad.clicks}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(ad)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(ad.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 transition-all hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ads.length === 0 && (
             <div className="p-20 text-center text-slate-500 font-medium italic">
                No hay campañas publicitarias. Configura el primer plan para comenzar.
             </div>
          )}
      </Card>

      {/* AD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <Card className="relative w-full max-w-2xl p-8 border-primary/30 z-10" hover={false}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Megaphone size={20} />
                 </div>
                 <h3 className="text-2xl font-bold font-inter tracking-tight">{editingAd ? 'Configurar Campaña' : 'Nueva Campaña'}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-transform hover:rotate-90">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <Input label="Título de Campaña" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                     <Input label="Enlace de Redirección" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required icon={LinkIcon} />
                     
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nivel de Prioridad (Probabilidad)</label>
                        <div className="grid grid-cols-3 gap-2">
                           {PRIORITY_PLANS.map(plan => (
                             <button
                               key={plan.value}
                               type="button"
                               onClick={() => setFormData({...formData, priority: plan.value})}
                               className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                 formData.priority === plan.value 
                                 ? 'bg-primary/10 border-primary text-primary shadow-gold-glow-sm' 
                                 : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                               }`}
                             >
                                {plan.icon}
                                <span className="text-[10px] font-bold uppercase tracking-widest">{plan.label}</span>
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Inicia el" type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                        <Input label="Finaliza el" type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                     </div>
                     
                     <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-all" onClick={() => setFormData({...formData, active: !formData.active})}>
                        <div className={`w-10 h-6 rounded-full transition-colors relative ${formData.active ? 'bg-primary' : 'bg-slate-700'}`}>
                           <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.active ? 'left-5' : 'left-1'}`}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Campaña Activa</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Visual del Banner</label>
                     <div 
                        className="relative group w-full aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center bg-white/5 overflow-hidden cursor-pointer"
                        onClick={() => document.getElementById('file-upload').click()}
                     >
                        {previewUrl ? (
                          <>
                             <img src={previewUrl} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload size={24} className="text-white" />
                             </div>
                          </>
                        ) : (
                          <>
                             <Upload className="text-slate-500 mb-2 scale-110" size={32} />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click para subir diseño</span>
                          </>
                        )}
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                     </div>
                     <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                        <h5 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                           <TrendingUp size={10} /> Consejos de Diseño
                        </h5>
                        <ul className="text-[10px] text-slate-400 space-y-1 font-medium list-disc ml-4">
                           <li>Formatos: PNG, JPG o WEBP.</li>
                           <li>Diseños limpios convierten mejor.</li>
                           <li>Máximo 5MB por imagen.</li>
                        </ul>
                     </div>
                  </div>
               </div>

               <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-4 shadow-gold-glow hover:scale-[1.01] active:scale-[0.99] transition-all">
                  {editingAd ? 'Actualizar Configuración' : 'Lanzar Campaña'}
               </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

// Internal icon for URL
const LinkIcon = ({ size }) => <MousePointer2 size={size} />;
const Megaphone = ({ size }) => <Zap size={size} />;

export default AdsAdminView;
