import React from 'react';
import { ServiceTask, UserProfile, Role } from '../types';
import { X, MapPin, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';

interface TaskDetailModalProps {
  task: ServiceTask;
  currentUser: UserProfile;
  currentRole: Role;
  onClose: () => void;
  onOpenChat: (task: ServiceTask) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  currentUser,
  currentRole,
  onClose,
  onOpenChat
}) => {
  const isOwner = currentUser.id === task.clientId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl my-6 overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-sky-500/30 text-sky-200 px-2.5 py-0.5 rounded-full font-semibold border border-sky-400/30">
              {task.category}
            </span>
            <span className="text-xs text-slate-300">· {task.createdAt}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title & Budget */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug font-display">{task.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Publicat per <strong>{task.clientName}</strong></span>
              </div>
            </div>
            <div className="text-right shrink-0 bg-sky-50 dark:bg-sky-950/70 px-3.5 py-2 rounded-2xl border border-sky-100 dark:border-sky-800">
              <span className="text-[10px] text-sky-800 dark:text-sky-300 uppercase font-bold tracking-wider block">Pressupost inicial</span>
              <span className="text-xl font-mono font-extrabold text-sky-950 dark:text-sky-200">{task.estimatedBudget} €</span>
            </div>
          </div>

          {/* Location & timing pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{task.municipality}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{task.addressDetails}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{task.preferredDate}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px] capitalize">Urgència: {task.urgency.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Descripció de la feina
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
              {task.description}
            </p>
          </div>

          {/* Photos if any */}
          {task.photos && task.photos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Fotografia de referència
              </h4>
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-56">
                <img
                  src={task.photos[0]}
                  alt="Feina a Mallorca"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Negotiation & Commission info */}
          <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-1.5">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Negociació directa i protecció de pagament</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed">
              El preu final es pacta entre ambdues parts al xat privat. FEINA X FEINA garanteix la retenció en custòdia fins que el treball estigui acabat amb èxit (comissió per trams des de 2 € o 5%-10% només per transacció realitzada).
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={() => onOpenChat(task)}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>
                {isOwner ? 'Obrir xat i gestionar ofertes' : 'Contactar per Xat i Negociar Preu'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
