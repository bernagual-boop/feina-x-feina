import React from 'react';
import { Wifi, WifiOff, HardDrive, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Language, translations } from '../i18n';

interface OfflineStatusBannerProps {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
  tasksCount: number;
  providersCount: number;
  conversationsCount: number;
  language: Language;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
  isOnline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
  tasksCount,
  providersCount,
  conversationsCount,
  language
}) => {
  const t = translations[language];
  const effectivelyOffline = !isOnline || isSimulatedOffline;

  if (!effectivelyOffline) {
    return (
      <div className="mb-4 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {language === 'ca' ? 'Connexió en directe activa' : 'Conexión en directo activa'}
          </span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
          <span className="hidden sm:inline">
            {language === 'ca' ? 'Dades sincronitzades a la memòria local (localStorage)' : 'Datos sincronizados en la memoria local (localStorage)'}
          </span>
        </div>

        <button
          onClick={onToggleSimulatedOffline}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-all hover:scale-[1.02] shadow-2xs"
          title={language === 'ca' ? 'Simula que no tens connexió per comprovar la visualització de feines desades' : 'Simula que no tienes conexión para comprobar la visualización de tareas guardadas'}
        >
          <WifiOff className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.offlineToggleTest}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-amber-50/95 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 p-4 sm:p-5 shadow-sm text-slate-900 dark:text-amber-100 transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left icon and message */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-xs">
            <WifiOff className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                {t.statusOffline}
              </span>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100 font-display">
                {t.offlineBannerTitle}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed max-w-2xl">
              {language === 'ca'
                ? 'No hi ha connexió a Internet. L\'aplicació està funcionant amb el magatzem local (localStorage). Pots navegar per totes les feines, perfils de prestadors i xats guardats prèviament al teu dispositiu sense interrupcions.'
                : 'No hay conexión a Internet. La aplicación está funcionando con el almacén local (localStorage). Puedes navegar por todas las tareas, perfiles de prestadores y chats guardados previamente en tu dispositivo sin interrupciones.'}
            </p>

            {/* Offline metadata pill badges */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-mono font-medium text-amber-900 dark:text-amber-200">
              <span className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <HardDrive className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>{tasksCount} {language === 'ca' ? 'feines desades' : 'tareas guardadas'}</span>
              </span>
              <span className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{providersCount} {language === 'ca' ? 'perfils locals' : 'perfiles locales'}</span>
              </span>
              <span className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <span>{conversationsCount} {language === 'ca' ? 'converses desades' : 'conversaciones guardadas'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right action button */}
        <div className="shrink-0 w-full sm:w-auto flex items-center justify-end">
          <button
            onClick={onToggleSimulatedOffline}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>
              {isSimulatedOffline
                ? t.offlineBackOnline
                : (language === 'ca' ? 'Comprovar connexió' : 'Comprobar conexión')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
