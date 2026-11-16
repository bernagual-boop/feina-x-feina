import React, { useState } from 'react';
import { UserProfile, Review } from '../types';
import { X, Star, MapPin, Clock, ShieldCheck, CheckCircle2, MessageSquare, Award, Briefcase, Image as ImageIcon, Wrench, FileText, UserCheck } from 'lucide-react';
import { Language, translations } from '../i18n';

interface ProviderDetailModalProps {
  provider: UserProfile;
  reviews: Review[];
  onClose: () => void;
  onContactProvider: (provider: UserProfile) => void;
  language: Language;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  provider,
  reviews,
  onClose,
  onContactProvider,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'experience' | 'portfolio' | 'reviews'>('overview');
  const t = translations[language];
  const providerReviews = reviews.filter((r) => r.providerId === provider.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-6 overflow-hidden border border-slate-200">
        
        {/* Cover & Profile Header */}
        <div className="relative bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white truncate">{provider.name}</h2>
                {provider.isVerified && (
                  <span className="p-0.5 bg-emerald-500 text-white rounded-full shrink-0" title={t.verified}>
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                {provider.providerType === 'particular' ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Particular
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/25 text-sky-300 border border-sky-400/30 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Professional
                  </span>
                )}
              </div>
              <div className="text-xs text-teal-200 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Base a <strong>{provider.municipality}</strong> · Membre des de {provider.memberSince}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-amber-400 font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{provider.rating.toFixed(1)}</span>
                  <span className="text-white/80 font-normal ml-1">({provider.reviewCount} ressenyes)</span>
                </div>
                <span className="text-teal-100 font-medium">
                  {provider.completedJobsCount} feines completades a Mallorca
                </span>
                {provider.experienceYears && (
                  <span className="text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded border border-sky-700/50">
                    {provider.experienceYears} anys d'experiència
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Visió General
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'services' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Serveis ({provider.servicesOffered?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'experience' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Experiència & Llicències
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'portfolio' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Portafolis ({provider.portfolioImages?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Ressenyes ({providerReviews.length})
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Availability Banner */}
              {provider.availability && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  provider.availability.isAvailableToday
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                    provider.availability.isAvailableToday ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`} />
                  <div>
                    <span className="font-bold text-xs block">
                      {provider.availability.isAvailableToday ? 'Disponible avui a Mallorca' : 'Disponibilitat programada'}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">{provider.availability.statusText}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Horari de servei: {provider.availability.workHours}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Biografia i Especialitat
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {provider.bio}
                </p>
              </div>

              {/* Technical Skills tags */}
              {provider.skills && provider.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-teal-600" />
                    <span>Habilitats i Competències Destacades</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl text-xs font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Zone summary */}
              {provider.availability && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">
                    Municipis coberts a Mallorca ({provider.availability.coveredMunicipalities.length}):
                  </span>
                  <div className="text-slate-600 leading-relaxed text-[11px]">
                    {provider.availability.coveredMunicipalities.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                {t.servicesTitle}
              </h4>
              {provider.servicesOffered?.map((srv) => (
                <div key={srv.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-slate-900">{srv.name}</span>
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 whitespace-nowrap">
                      {srv.estimatedRate} € / {srv.rateType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{srv.description}</p>
                  <div className="text-[11px] text-slate-400 mt-2">
                    Especialitat: <strong>{srv.category}</strong> · Tarifa negociable segons especificacions
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-4">
              {provider.providerType === 'particular' ? (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                      Prestador Particular de Mallorca
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    Ofereix feines de suport, tasques domèstiques o classes particulars en l'àmbit veïnal. No requereix llicència industrial ni número de col·legiat oficial.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-sky-50/70 dark:bg-sky-950/50 rounded-2xl border border-sky-200 dark:border-sky-800">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-sky-700 dark:text-sky-400" />
                    <span className="text-xs font-bold text-sky-950 dark:text-sky-200">Acreditació i Registre Oficial a les Illes Balears</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {provider.licenseNumber || 'Registre d\'Empreses Instal·ladores de les Illes Balears'}
                  </div>
                  <p className="text-[11px] text-sky-800 dark:text-sky-300 mt-1">
                    Identitat i capacitació professional contrastades per la plataforma FEINA X FEINA.
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>Certificacions Oficials i Titulacions</span>
                </h4>
                <div className="space-y-2">
                  {provider.certifications?.map((cert, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <span>{t.portfolioTitle}</span>
              </h4>
              {provider.portfolioImages && provider.portfolioImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provider.portfolioImages.map((imgUrl, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group">
                      <img
                        src={imgUrl}
                        alt={`Feina de ${provider.name}`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-3 bg-white text-xs font-medium text-slate-800">
                        Instal·lació i acabat professional a finca/xalet de Mallorca
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                  Aquest professional encara no ha pujat fotos al seu portafolis.
                </p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Valoracions verificades de clients a Mallorca ({providerReviews.length})
                </h4>
                <div className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{provider.rating.toFixed(1)} / 5</span>
                </div>
              </div>

              {providerReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                  Encara no té valoracions registrades.
                </p>
              ) : (
                providerReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.clientAvatar}
                          alt={rev.clientName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-bold text-slate-900">{rev.clientName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[11px] text-slate-400 ml-1">{rev.date}</span>
                      </div>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-2">"{rev.comment}"</p>
                    {rev.tags && (
                      <div className="flex flex-wrap gap-1">
                        {rev.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Bottom Action CTA */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onContactProvider(provider)}
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-[0.99] text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contactar i Negociar Feina amb {provider.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
