import React from 'react';
import { Role } from '../types';
import { Compass, ListChecks, MessageSquare, User, PlusCircle } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'my_tasks' | 'messages' | 'profile';
  setActiveTab: (tab: 'explore' | 'my_tasks' | 'messages' | 'profile') => void;
  unreadCount: number;
  currentRole: Role;
  onOpenCreateTask: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  currentRole,
  onOpenCreateTask
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 pb-safe shadow-lg transition-colors duration-200">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        
        {/* Tab 1: Explorar */}
        <button
          type="button"
          onClick={() => setActiveTab('explore')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'explore' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Explorar</span>
        </button>

        {/* Tab 2: Mis Tareas */}
        <button
          type="button"
          onClick={() => setActiveTab('my_tasks')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'my_tasks' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ListChecks className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">
            {currentRole === 'client' ? 'Feines' : 'Treballs'}
          </span>
        </button>

        {/* Center Action (Publish or Pro availability) */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="Publicar feina"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Tab 3: Mensajes */}
        <button
          type="button"
          onClick={() => setActiveTab('messages')}
          className={`min-h-[48px] relative flex flex-col items-center justify-center transition-colors ${
            activeTab === 'messages' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold min-w-[14px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Xat</span>
        </button>

        {/* Tab 4: Perfil */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`min-h-[48px] flex flex-col items-center justify-center transition-colors ${
            activeTab === 'profile' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1 font-semibold">Perfil</span>
        </button>

      </div>
    </div>
  );
};
