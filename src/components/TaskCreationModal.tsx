import React, { useState } from 'react';
import { TaskCategory, ServiceTask, UserProfile } from '../types';
import { MALLORCA_MUNICIPALITIES, TASK_CATEGORIES } from '../data/mallorcaData';
import { X, MapPin, Camera, Check } from 'lucide-react';

interface TaskCreationModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onCreateTask: (newTask: Omit<ServiceTask, 'id' | 'createdAt' | 'proposalsCount' | 'paymentStatus'>) => void;
  onPickOnMapRequest?: () => void;
  pickedCoords?: [number, number] | null;
}

export const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  currentUser,
  onClose,
  onCreateTask,
  onPickOnMapRequest,
  pickedCoords
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Electricidad');
  const [municipalityId, setMunicipalityId] = useState('palma');
  const [addressDetails, setAddressDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('Aquesta setmana');
  const [urgency, setUrgency] = useState<'urgente' | 'esta_semana' | 'flexible'>('esta_semana');
  const [estimatedBudget, setEstimatedBudget] = useState(150);
  const [selectedPhoto, setSelectedPhoto] = useState<string>('');

  const selectedMuni = MALLORCA_MUNICIPALITIES.find((m) => m.id === municipalityId) || MALLORCA_MUNICIPALITIES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const coords: [number, number] = pickedCoords || selectedMuni.coordinates;

    onCreateTask({
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      title: title.trim(),
      description: description.trim(),
      category,
      municipality: selectedMuni.name,
      addressDetails: addressDetails.trim() || `${selectedMuni.name}, Mallorca`,
      coordinates: coords,
      preferredDate,
      urgency,
      estimatedBudget,
      status: 'open',
      photos: selectedPhoto ? [selectedPhoto] : [],
      platformFeePercentage: 10
    });

    onClose();
  };

  const samplePhotos = [
    { label: 'Reforma/Bany', url: '/src/assets/images/pro_service_reforms_1794464991497.jpg' },
    { label: 'Electricitat', url: '/src/assets/images/pro_service_electrician_1794464991019.jpg' },
    { label: 'Jardí/Finca', url: '/src/assets/images/pro_service_gardener_1794464991176.jpg' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl my-6 overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-700 to-teal-700 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base font-display">Publicar Nova Sol·licitud a Mallorca</h3>
            <p className="text-xs text-sky-100">Descriu la feina i rep ofertes directes de professionals locals</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Categoria del servei
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            >
              {TASK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Títol de la feina
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Reparar persiana mallorquina o instal·lar carregador elèctric"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          {/* Precise Location in Mallorca */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Geolocalització precisa a Mallorca</span>
              </span>
              {onPickOnMapRequest && (
                <button
                  type="button"
                  onClick={onPickOnMapRequest}
                  className="text-xs text-sky-700 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
                >
                  {pickedCoords ? '✓ Ubicació fixada al mapa' : '📍 Marcar al mapa interactiu'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Municipi de Mallorca
                </label>
                <select
                  value={municipalityId}
                  onChange={(e) => setMunicipalityId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {MALLORCA_MUNICIPALITIES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.comarca})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Carrer, barri o zona de referència
                </label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="Ex. Santa Catalina, Camí de Son Rapinya..."
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {pickedCoords && (
              <div className="text-[11px] text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-3 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 font-mono">
                Coordenades GPS: [{pickedCoords[0].toFixed(4)}, {pickedCoords[1].toFixed(4)}]
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Descripció completa del treball
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica detalladament què necessites, materials, si cal accessibilitat especial..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              required
            />
          </div>

          {/* Urgency & Preferred Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Urgència
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setUrgency('urgente')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                    urgency === 'urgente'
                      ? 'bg-rose-50 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Urgent 24h
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('esta_semana')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                    urgency === 'esta_semana'
                      ? 'bg-sky-50 dark:bg-sky-950/70 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Setmana
                </button>
                <button
                  type="button"
                  onClick={() => setUrgency('flexible')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all ${
                    urgency === 'flexible'
                      ? 'bg-teal-50 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Flexible
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Data o franja preferent
              </label>
              <input
                type="text"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                placeholder="Ex. Dissabte matí o tardes"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Budget & Negotiation reminder */}
          <div className="p-4 bg-sky-50/70 dark:bg-sky-950/60 rounded-2xl border border-sky-100 dark:border-sky-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Pressupost estimat (€)
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  El preu final es negociarà directament al xat privat.
                </span>
              </div>
              <div className="relative w-28">
                <input
                  type="number"
                  min="20"
                  max="5000"
                  step="10"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 pl-7 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:outline-none text-right"
                  required
                />
                <span className="absolute left-2.5 top-2 text-slate-400 font-bold">€</span>
              </div>
            </div>
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Adjuntar foto de referència (opcional)</span>
            </label>
            <div className="flex items-center gap-2">
              {samplePhotos.map((photo, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedPhoto(selectedPhoto === photo.url ? '' : photo.url)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all w-24 h-16 ${
                    selectedPhoto === photo.url ? 'border-sky-600 ring-2 ring-sky-300' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] text-white text-center py-0.5 truncate font-semibold">
                    {photo.label}
                  </span>
                  {selectedPhoto === photo.url && (
                    <div className="absolute top-1 right-1 bg-sky-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Publicar Sol·licitud a Mallorca</span>
          </button>
        </form>

      </div>
    </div>
  );
};
