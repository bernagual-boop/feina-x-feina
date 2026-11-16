import React, { useState } from 'react';
import { UserProfile, ServiceTask } from '../types';
import { X, Star, MapPin, Calendar, CheckCircle2, Clock, ShieldCheck, ArrowRight, Briefcase, BarChart3, MessageSquare } from 'lucide-react';
import { Language, translations } from '../i18n';
import { ClientActivityCharts } from './ClientActivityCharts';

interface ClientDetailModalProps {
  client: UserProfile;
  onClose: () => void;
  onOpenTask?: (taskId: string) => void;
  language: Language;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onOpenTask,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'charts' | 'reviews'>('charts');
  const t = translations[language];
  const isCa = language === 'ca';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-6 overflow-hidden border border-slate-200">
        
        {/* Cover Header */}
        <div className="relative bg-gradient-to-r from-sky-900 to-slate-900 text-white p-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={client.avatar}
              alt={client.name}
              className="w-18 h-18 rounded-2xl object-cover ring-4 ring-white/20 shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{client.name}</h2>
                {client.isVerified && (
                  <span className="p-0.5 bg-sky-500 text-white rounded-full shrink-0" title="Client Verificat">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                <span className="text-[10px] bg-white/20 text-sky-100 px-2 py-0.5 rounded-full font-semibold">
                  Perfil de Client
                </span>
              </div>
              <div className="text-xs text-sky-200 flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{client.municipality} · Membre des de {client.memberSince}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center text-amber-400 font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{client.rating.toFixed(1)}</span>
                  <span className="text-white/80 font-normal ml-1">({client.reviewCount} valoracions de prestadors)</span>
                </div>
                <span className="text-sky-100 font-medium">
                  {client.completedJobsCount} feines contractades
                </span>
              </div>
            </div>
          </div>

          {/* Sub-navigation tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'charts' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isCa ? 'Activitat & Gràfics' : 'Actividad & Gráficos'}</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{isCa ? 'Historial de Feines' : 'Historial de Tareas'} ({client.clientPastHistory?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>{isCa ? 'Valoracions de Prestadors' : 'Valoraciones de Prestadores'} ({client.clientReviewsReceived?.length || 0})</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* CHARTS TAB */}
          {activeTab === 'charts' && (
            <ClientActivityCharts client={client} language={language} />
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1.5">
                  Sobre el client
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                  {client.bio}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>{t.clientHistoryTitle} ({client.clientPastHistory?.length || 0})</span>
                  </h4>
                </div>

                <div className="space-y-2">
                  {client.clientPastHistory && client.clientPastHistory.length > 0 ? (
                    client.clientPastHistory.map((job) => (
                      <div
                        key={job.id}
                        className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-sky-300 transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{job.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>{job.municipality}</span>
                            <span>·</span>
                            <span>{job.category}</span>
                            <span>·</span>
                            <span>Prestador: <strong>{job.providerName}</strong></span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono font-bold text-slate-900 dark:text-white">{job.amount} €</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            job.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {job.status === 'completed' ? 'Finalitzada' : 'En curs'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                      Encara no hi ha feines registrades a l'historial.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{t.clientReviewsReceivedTitle} ({client.clientReviewsReceived?.length || 0})</span>
              </h4>

            <div className="space-y-2.5">
              {client.clientReviewsReceived && client.clientReviewsReceived.length > 0 ? (
                client.clientReviewsReceived.map((rev) => (
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
                          <span key={idx} className="text-[10px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  Sense valoracions de prestadors encara.
                </p>
              )}
            </div>
          </div>
        )}

          {/* Client Guarantee */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs flex items-start gap-2.5 text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Client Verificat FEINA X FEINA:</strong> Tots els pagaments es gestionen amb dipòsit segur en garantia (escrow). El prestador no cobra fins que el client confirma que la feina s'ha realitzat a la seva satisfacció.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
