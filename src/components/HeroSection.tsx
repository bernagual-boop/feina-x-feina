import React from 'react';
import { Role } from '../types';
import { PlusCircle, Briefcase, ShieldCheck, MapPin, Sparkles, UserCheck } from 'lucide-react';
import { Language, translations } from '../i18n';

interface HeroSectionProps {
  currentRole: Role;
  onOpenCreateTask: () => void;
  onOpenAvailability: () => void;
  tasksCount: number;
  providersCount: number;
  language: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentRole,
  onOpenCreateTask,
  onOpenAvailability,
  tasksCount,
  providersCount,
  language
}) => {
  const t = translations[language];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-sm mb-6 border border-slate-200">
      {/* Background with Mallorca Hero Photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/mallorca_hero_landscape_1794464990308.jpg"
          alt="Mallorca costa i arquitectura tradicional"
          className="w-full h-full object-cover"
        />
        {/* Measured dark scrim for high contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 text-white max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-3 uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>FEINA X FEINA · {t.badgeMallorca}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3 text-balance font-display">
          {currentRole === 'client'
            ? (language === 'ca'
                ? 'Troba professionals i particulars de confiança al teu municipi'
                : 'Encuentra profesionales y particulares de confianza en tu municipio')
            : (language === 'ca'
                ? 'Ets professional o particular? Guanya doblers oferint els teus serveis'
                : '¿Eres profesional o particular? Gana dinero ofreciendo tus servicios')}
        </h1>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-5 max-w-2xl">
          {language === 'ca'
            ? 'Geolocalització precisa per municipi de Mallorca, negociació directa del preu al xat privat i pagaments segurs en custòdia (escrow).'
            : 'Geolocalización precisa por municipio de Mallorca, negociación directa del precio en chat privado y pagos seguros en custodia (escrow).'}
        </p>

        {/* Highlight Card: Professionals & Particulars Income Opportunity */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/20 dark:border-teal-500/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white font-display">
                  {language === 'ca'
                    ? 'Obert a Professionals i Particulars'
                    : 'Abierto a Profesionales y Particulares'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {language === 'ca' ? 'Ingressos extres' : 'Ingresos extra'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {language === 'ca'
                  ? 'No necessites ser un professional col·legiat per prestar serveis a FEINA X FEINA. Si ets un particular i tens bones habilitats, eines pròpies o mà per ajudar (bricolatge, trasllats, neteja, cura d\'animals o persones, repàs escolar), pots generar-te uns ingressos extres oferint les teves qualitats de forma fàcil i amb pagaments 100% protegits en custòdia.'
                  : 'No necesitas ser un profesional colegiado para prestar servicios en FEINA X FEINA. Si eres un particular y tienes buenas cualidades, tus propias herramientas o destreza para ayudar (bricolaje, portes, limpieza, cuidado de mascotas o personas, clases particulares), puedes generarte unos ingresos extra ofreciendo tus cualidades de forma fácil y con pagos 100% protegidos en custodia.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {currentRole === 'client' ? (
            <button
              onClick={onOpenCreateTask}
              className="px-5 py-3 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.btnPublishTask}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAvailability}
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t.btnAvailability}</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t.commissionNotice}</span>
          </div>
        </div>

        {/* Island Trust Metrics (Unboxed clean metadata) */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-4 border-t border-white/15">
          <div>
            <strong className="text-white font-mono text-sm">{tasksCount}</strong> {language === 'ca' ? 'feines actives' : 'tareas activas'}
          </div>
          <span aria-hidden="true" className="text-white/30">·</span>
          <div>
            <strong className="text-white font-mono text-sm">{providersCount}</strong> {language === 'ca' ? 'professionals verificats' : 'profesionales verificados'}
          </div>
          <span aria-hidden="true" className="text-white/30">·</span>
          <div>
            <strong className="text-white font-mono text-sm">53</strong> {language === 'ca' ? 'municipis de Mallorca' : 'municipios de Mallorca'}
          </div>
          <span aria-hidden="true" className="text-white/30">·</span>
          <div className="text-emerald-300 font-medium">
            Pagaments en custòdia (Bizum & Targeta)
          </div>
        </div>
      </div>
    </div>
  );
};
