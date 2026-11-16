import React from 'react';
import { UserProfile } from '../types';
import { Star, MapPin, MessageSquare, CheckCircle2, Briefcase, UserCheck } from 'lucide-react';

interface ProviderCardProps {
  provider: UserProfile;
  distanceKm?: number;
  onSelect: (provider: UserProfile) => void;
  onContact: (provider: UserProfile) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  distanceKm,
  onSelect,
  onContact
}) => {
  const isAvailable = provider.availability?.isAvailableToday ?? true;
  const isParticular = provider.providerType === 'particular';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500 transition-all p-4 flex flex-col justify-between group duration-200">
      <div>
        {/* Top bar: Provider avatar, name, rating */}
        <div className="flex items-start gap-3 mb-3">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <h3
                  onClick={() => onSelect(provider)}
                  className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors cursor-pointer truncate font-display"
                >
                  {provider.name}
                </h3>
                {provider.isVerified && (
                  <span title="Verificat / Verificado">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>

              {/* Professional vs Particular Badge */}
              {isParticular ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                  <UserCheck className="w-2.5 h-2.5" />
                  Particular
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1 shrink-0">
                  <Briefcase className="w-2.5 h-2.5" />
                  Pro
                </span>
              )}
            </div>

            {/* Unboxed metadata */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <div className="flex items-center gap-1.5 truncate">
                <span className="flex items-center text-amber-600 dark:text-amber-400 font-bold">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  <span>{provider.rating.toFixed(1)}</span>
                  <span className="font-normal text-slate-400 ml-0.5">({provider.reviewCount})</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 dark:text-slate-400 truncate">{provider.municipality}</span>
              </div>

              {distanceKm !== undefined && (
                <span className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 shrink-0">
                  📍 {distanceKm} km
                </span>
              )}
            </div>

            {/* Availability status line */}
            <div className="text-[11px] text-teal-800 dark:text-teal-300 font-semibold mt-1 truncate">
              {isAvailable ? '✓ Disponible avui a Mallorca' : 'Disponibilitat segons agenda'}
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {provider.bio}
        </p>

        {/* Services snippet */}
        {provider.servicesOffered && provider.servicesOffered.length > 0 && (
          <div className="space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {provider.servicesOffered.slice(0, 2).map((srv) => (
              <div key={srv.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-700 dark:text-slate-300 truncate">{srv.name}</span>
                <span className="font-mono font-semibold text-teal-800 dark:text-teal-300 ml-2 whitespace-nowrap">
                  {srv.estimatedRate} €/{srv.rateType}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* Coverage line */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
          <span className="truncate">
            Cobertura: {provider.availability?.coveredMunicipalities.join(', ') || 'Tota Mallorca'}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {provider.completedJobsCount} feines fetes
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelect(provider)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Veure Perfil
            </button>
            <button
              onClick={() => onContact(provider)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-teal-700 dark:bg-teal-600 hover:bg-teal-800 active:scale-95 rounded-xl shadow-2xs transition-all flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contactar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
