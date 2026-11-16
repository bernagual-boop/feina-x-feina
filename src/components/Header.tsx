import React from 'react';
import { Role, UserProfile } from '../types';
import { PlusCircle, Briefcase, Bell, MapPin, ShieldCheck, Sun, Moon, Wifi, WifiOff } from 'lucide-react';
import { Language, translations } from '../i18n';

import logoImg from '../assets/images/feina_logo_1794466822914.jpg';

interface HeaderProps {
  currentRole: Role;
  currentUser: UserProfile;
  onRoleToggle: (role: Role) => void;
  onOpenCreateTask: () => void;
  onOpenEarnings: () => void;
  onOpenAvailability: () => void;
  onOpenNotifications: () => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  activeTab: 'explore' | 'my_tasks' | 'messages' | 'profile';
  setActiveTab: (tab: 'explore' | 'my_tasks' | 'messages' | 'profile') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isOnline?: boolean;
  isSimulatedOffline?: boolean;
  onToggleSimulatedOffline?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUser,
  onRoleToggle,
  onOpenCreateTask,
  onOpenEarnings,
  onOpenAvailability,
  onOpenNotifications,
  unreadMessagesCount,
  unreadNotificationsCount,
  activeTab,
  setActiveTab,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  isOnline = true,
  isSimulatedOffline = false,
  onToggleSimulatedOffline
}) => {
  const t = translations[language];
  const isEffectivelyOffline = !isOnline || isSimulatedOffline;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Top Bar Contract (3 zones separated by gap-8) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs shrink-0 flex items-center justify-center p-0.5">
              <img
                src={logoImg}
                alt="FEINA X FEINA Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors whitespace-nowrap font-display">
                FEINA X FEINA
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                {t.badgeMallorca}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300 shrink-0">
          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap transition-colors ${activeTab === 'explore' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t.navExplore}
          </button>
          <button
            onClick={() => setActiveTab('my_tasks')}
            className={`whitespace-nowrap transition-colors ${activeTab === 'my_tasks' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
          >
            {currentRole === 'client' ? t.navMyTasksClient : t.navMyTasksProvider}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative whitespace-nowrap transition-colors ${activeTab === 'messages' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
          >
            <span>{t.navMessages}</span>
            {unreadMessagesCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`whitespace-nowrap transition-colors ${activeTab === 'profile' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t.navProfile}
          </button>
        </nav>

        {/* Zone 3: Primary Actions, Theme, Language, Notifications & Role Mode Switch */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Connection Status Indicator & Quick Offline Toggle */}
          {onToggleSimulatedOffline && (
            <button
              onClick={onToggleSimulatedOffline}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                isEffectivelyOffline
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={
                isEffectivelyOffline
                  ? (language === 'ca' ? 'Mode fora de línia actiu (Clica per tornar a estar en línia)' : 'Modo sin conexión activo (Haz clic para volver a estar en línea)')
                  : (language === 'ca' ? 'En línia (Clica per provar el mode fora de línia)' : 'En línea (Haz clic para probar el modo sin conexión)')
              }
            >
              {isEffectivelyOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="hidden lg:inline">{t.statusOffline}</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden lg:inline">{t.statusOnline}</span>
                </>
              )}
            </button>
          )}

          {/* Theme Switcher Sun/Moon */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Canviar tema Clar/Fosc"
            title={theme === 'dark' ? 'Activar mode clar' : 'Activar mode fosc'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Language Switcher CA | ES */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => onLanguageChange('ca')}
              className={`px-2 py-1 rounded-lg transition-all ${
                language === 'ca'
                  ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Català (Mallorca)"
            >
              CA
            </button>
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-1 rounded-lg transition-all ${
                language === 'es'
                  ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Castellano"
            >
              ES
            </button>
          </div>

          {/* Push Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            aria-label="Notificacions"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-sky-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onRoleToggle('client')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                currentRole === 'client'
                  ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.roleClient}
            </button>
            <button
              onClick={() => onRoleToggle('provider')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                currentRole === 'provider'
                  ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.roleProvider}
            </button>
          </div>

          {/* Contextual Action Button */}
          {currentRole === 'client' ? (
            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.btnPublishTask}</span>
              <span className="sm:hidden">Publicar</span>
            </button>
          ) : (
            <button
              onClick={onOpenAvailability}
              className="px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/60 active:scale-95 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Briefcase className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span className="hidden sm:inline">{t.btnAvailability}</span>
              <span className="sm:hidden">Agenda</span>
            </button>
          )}
        </div>
      </div>

      {/* Subheader info ribbon */}
      <div className="bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200/60 dark:border-slate-800 px-4 sm:px-6 py-2 text-xs text-slate-600 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Mallorca: <strong className="text-slate-900 dark:text-white font-semibold">53 municipis</strong></span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.commissionNotice}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'provider' && (
              <button
                onClick={onOpenEarnings}
                className="text-xs font-medium text-teal-800 dark:text-teal-300 hover:text-teal-900 flex items-center gap-1 bg-teal-50 dark:bg-teal-950/70 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800"
              >
                <span>{t.btnEarnings}:</span>
                <span className="font-bold font-mono">{currentUser.earningsBalance?.toFixed(2) || '0.00'} €</span>
              </button>
            )}
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
