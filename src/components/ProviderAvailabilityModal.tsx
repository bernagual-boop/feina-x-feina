import React, { useState } from 'react';
import { UserProfile, ProviderService, TaskCategory } from '../types';
import { MALLORCA_MUNICIPALITIES, TASK_CATEGORIES } from '../data/mallorcaData';
import { X, Check, Clock, MapPin, Plus, Trash2 } from 'lucide-react';

interface ProviderAvailabilityModalProps {
  provider: UserProfile;
  onClose: () => void;
  onUpdateProvider: (updated: Partial<UserProfile>) => void;
}

export const ProviderAvailabilityModal: React.FC<ProviderAvailabilityModalProps> = ({
  provider,
  onClose,
  onUpdateProvider
}) => {
  const [isAvailableToday, setIsAvailableToday] = useState(
    provider.availability?.isAvailableToday ?? true
  );
  const [statusText, setStatusText] = useState(
    provider.availability?.statusText || 'Disponible aquesta setmana per a feines a Mallorca'
  );
  const [workHours, setWorkHours] = useState(
    provider.availability?.workHours || '08:00 - 19:00'
  );
  const [coveredMunicipalities, setCoveredMunicipalities] = useState<string[]>(
    provider.availability?.coveredMunicipalities || ['palma', 'calvia', 'marratxi', 'inca']
  );
  const [services, setServices] = useState<ProviderService[]>(
    provider.servicesOffered || []
  );

  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<TaskCategory>('Electricidad');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceRate, setNewServiceRate] = useState(35);
  const [newServiceRateType, setNewServiceRateType] = useState<'hora' | 'servicio' | 'presupuesto'>('hora');

  const toggleMunicipality = (muniId: string) => {
    if (coveredMunicipalities.includes(muniId)) {
      setCoveredMunicipalities(coveredMunicipalities.filter((id) => id !== muniId));
    } else {
      setCoveredMunicipalities([...coveredMunicipalities, muniId]);
    }
  };

  const handleSelectAllMunicipalities = () => {
    if (coveredMunicipalities.length === MALLORCA_MUNICIPALITIES.length) {
      setCoveredMunicipalities([]);
    } else {
      setCoveredMunicipalities(MALLORCA_MUNICIPALITIES.map((m) => m.id));
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService: ProviderService = {
      id: `srv_${Date.now()}`,
      name: newServiceName.trim(),
      category: newServiceCategory,
      description: newServiceDesc.trim(),
      estimatedRate: newServiceRate,
      rateType: newServiceRateType
    };

    setServices([...services, newService]);
    setNewServiceName('');
    setNewServiceDesc('');
    setShowAddService(false);
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter((s) => s.id !== serviceId));
  };

  const handleSaveAll = () => {
    onUpdateProvider({
      availability: {
        isAvailableToday,
        statusText,
        scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
        workHours,
        coveredMunicipalities
      },
      servicesOffered: services
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl my-6 overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-800 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300"
            />
            <div>
              <h3 className="font-bold text-base font-display">Gestió de Disponibilitat i Serveis</h3>
              <p className="text-xs text-teal-100">Configura horaris, municipis coberts i tarifes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Availability switch */}
          <div className="p-4 bg-teal-50/70 dark:bg-teal-950/60 rounded-2xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-teal-950 dark:text-teal-200 flex items-center gap-2">
                <span>Disponible avui per a feines immediates</span>
                <span className="text-[10px] bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 px-2 py-0.5 rounded-full font-bold">
                  En directe
                </span>
              </div>
              <p className="text-xs text-teal-800/80 dark:text-teal-300/80 mt-0.5">
                Els clients de Mallorca veuran el teu perfil com a disponible avui mateix.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailableToday(!isAvailableToday)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                isAvailableToday ? 'bg-teal-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Status text & Work hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Missatge d'estat per als clients
              </label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                placeholder="Ex. Disponible avui a Palma i Calvià"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Horari laboral habitual</span>
              </label>
              <input
                type="text"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="08:00 - 19:30"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mallorca Municipalities Coverage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Municipis de Mallorca que cobreixes ({coveredMunicipalities.length})</span>
              </label>
              <button
                type="button"
                onClick={handleSelectAllMunicipalities}
                className="text-xs text-teal-700 dark:text-teal-400 font-semibold hover:underline"
              >
                {coveredMunicipalities.length === MALLORCA_MUNICIPALITIES.length
                  ? 'Desmarcar tots'
                  : 'Cobrir tota Mallorca'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              {MALLORCA_MUNICIPALITIES.map((m) => {
                const isSelected = coveredMunicipalities.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMunicipality(m.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    {isSelected && <Check className="w-3 h-3 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services Offered list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Serveis i Tarifes ({services.length})
              </label>
              <button
                type="button"
                onClick={() => setShowAddService(!showAddService)}
                className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Afegir servei</span>
              </button>
            </div>

            {/* Add service form */}
            {showAddService && (
              <form onSubmit={handleAddService} className="p-3.5 bg-slate-50 dark:bg-slate-800/90 rounded-2xl border border-teal-200 dark:border-teal-700 mb-3 space-y-2.5 animate-slide-down">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Nou Servei Professional</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Nom del servei..."
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    required
                  />
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value as TaskCategory)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                  >
                    {TASK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Detalls del servei..."
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                />
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Tarifa:</span>
                    <input
                      type="number"
                      min="10"
                      value={newServiceRate}
                      onChange={(e) => setNewServiceRate(Number(e.target.value))}
                      className="w-20 px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded font-mono font-bold"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">€</span>
                  </div>
                  <select
                    value={newServiceRateType}
                    onChange={(e) => setNewServiceRateType(e.target.value as any)}
                    className="text-xs border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded px-2 py-1"
                  >
                    <option value="hora">per hora</option>
                    <option value="servicio">per feina tancada</option>
                    <option value="presupuesto">a pressupost</option>
                  </select>
                  <button
                    type="submit"
                    className="ml-auto px-3 py-1 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800"
                  >
                    Desar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/90 dark:border-slate-700 flex items-start justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{srv.name}</span>
                      <span className="text-[10px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                        {srv.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{srv.description}</p>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 font-semibold">
                      Tarifa: {srv.estimatedRate} € / {srv.rateType}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteService(srv.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleSaveAll}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Desar Disponibilitat i Cobertura</span>
          </button>
        </div>

      </div>
    </div>
  );
};
