import React from 'react';
import { ServiceTask } from '../types';
import { MapPin, MessageSquare, Lock } from 'lucide-react';

interface TaskCardProps {
  task: ServiceTask;
  distanceKm?: number;
  onSelect: (task: ServiceTask) => void;
  onOpenChat: (task: ServiceTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  distanceKm,
  onSelect,
  onOpenChat
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-500 transition-all p-4 flex flex-col justify-between group duration-200">
      <div>
        {/* Unboxed clean metadata (Zero-pill discipline) */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-sky-700 dark:text-sky-400">{task.category}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{task.municipality}</span>
          </div>
          {distanceKm !== undefined && (
            <span className="text-[10px] font-mono font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 shrink-0">
              📍 {distanceKm} km
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(task)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2 font-display"
        >
          {task.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>

        {/* Photo thumbnail if present */}
        {task.photos && task.photos.length > 0 && (
          <div className="mb-3 rounded-xl overflow-hidden h-28 border border-slate-100 dark:border-slate-800">
            <img
              src={task.photos[0]}
              alt={task.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div>
        {/* Location line */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="truncate">{task.addressDetails}</span>
        </div>

        {/* Budget and Negotiation Status */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
              {task.agreedPrice ? 'Preu acordat' : 'Pressupost estim.'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {task.agreedPrice || task.estimatedBudget} €
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">negociable</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(task)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Detalls
            </button>
            <button
              onClick={() => onOpenChat(task)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-sky-600 dark:bg-sky-500 hover:bg-sky-700 active:scale-95 rounded-xl shadow-2xs transition-all flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Negociar</span>
            </button>
          </div>
        </div>

        {/* Escrow badge if payment held */}
        {task.paymentStatus === 'held_in_escrow' && (
          <div className="mt-2 text-[11px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
            <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Pagament dipositat en custòdia · Feina en curs</span>
          </div>
        )}
      </div>
    </div>
  );
};
