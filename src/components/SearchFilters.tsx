import React, { useState } from 'react';
import { FilterState, TaskCategory } from '../types';
import { MALLORCA_MUNICIPALITIES, TASK_CATEGORIES } from '../data/mallorcaData';
import { Search, MapPin, SlidersHorizontal, Map, List, Grid2X2, Star, Clock, Euro, X, Navigation, Loader2, LocateFixed } from 'lucide-react';
import { Language, translations } from '../i18n';

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  tasksCount: number;
  providersCount: number;
  activeEntity: 'tasks' | 'providers';
  setActiveEntity: (entity: 'tasks' | 'providers') => void;
  language: Language;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  tasksCount,
  providersCount,
  activeEntity,
  setActiveEntity,
  language
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const t = translations[language];

  const handleToggleProximity = () => {
    if (filters.sortBy === 'proximity') {
      onFilterChange({
        ...filters,
        sortBy: 'default'
      });
      return;
    }

    if (filters.userLocation) {
      onFilterChange({
        ...filters,
        sortBy: 'proximity'
      });
      return;
    }

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          onFilterChange({
            ...filters,
            sortBy: 'proximity',
            userLocation: [pos.coords.latitude, pos.coords.longitude]
          });
        },
        (err) => {
          setIsLocating(false);
          console.warn('Geolocation denied or timed out, applying Palma de Mallorca center reference coordinates:', err);
          // Graceful fallback to Palma de Mallorca coordinates so proximity sorting works seamlessly
          onFilterChange({
            ...filters,
            sortBy: 'proximity',
            userLocation: [39.5696, 2.6502]
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      // Browser does not support geolocation
      onFilterChange({
        ...filters,
        sortBy: 'proximity',
        userLocation: [39.5696, 2.6502]
      });
    }
  };

  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      municipality: e.target.value
    });
  };

  const handleCategoryClick = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? 'all' : category
    });
  };

  const popularMunicipalities = [
    { id: 'all', name: language === 'ca' ? 'Tota Mallorca' : 'Toda Mallorca' },
    { id: 'palma', name: 'Palma' },
    { id: 'calvia', name: 'Calvià' },
    { id: 'inca', name: 'Inca' },
    { id: 'manacor', name: 'Manacor' },
    { id: 'soller', name: 'Sóller' },
    { id: 'alcudia', name: 'Alcúdia' },
    { id: 'santanyi', name: 'Santanyí' }
  ];

  const ratingOptions = [
    { value: 0, label: language === 'ca' ? 'Totes' : 'Todas' },
    { value: 4.0, label: '4.0+ ★' },
    { value: 4.5, label: '4.5+ ★' },
    { value: 4.8, label: '4.8+ ★' },
    { value: 5.0, label: '5.0 ★' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
      {/* Entity Switcher + Search Bar + View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Entity Switcher: Tareas vs Prestadores & Provider Type Filter */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveEntity('tasks')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeEntity === 'tasks'
                  ? 'bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.tabTasks} ({tasksCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveEntity('providers')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeEntity === 'providers'
                  ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.tabProviders} ({providersCount})
            </button>
          </div>

          {/* Quick toggle: All / Professionals / Particulars when providers is active */}
          {activeEntity === 'providers' && (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs shrink-0 animate-fade-in">
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, providerTypeFilter: 'all' })}
                className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                  (filters.providerTypeFilter || 'all') === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'ca' ? 'Tots' : 'Todos'}
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, providerTypeFilter: 'professional' })}
                className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                  filters.providerTypeFilter === 'professional'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'ca' ? 'Professionals' : 'Profesionales'}
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, providerTypeFilter: 'particular' })}
                className={`px-2 py-1 rounded-lg font-semibold transition-all ${
                  filters.providerTypeFilter === 'particular'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {language === 'ca' ? 'Particulars' : 'Particulares'}
              </button>
            </div>
          )}
        </div>

        {/* Search input with instant filtering */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Advanced Filters Button */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-all shrink-0 ${
            showAdvanced || filters.minRating > 0 || filters.maxRate < 300
              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Filtres</span>
          {(filters.minRating > 0 || filters.maxRate < 300) && (
            <span className="w-2 h-2 rounded-full bg-sky-600 dark:bg-sky-400" />
          )}
        </button>

        {/* View mode switcher */}
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, viewMode: 'split' })}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filters.viewMode === 'split' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Vista dividida"
          >
            <Grid2X2 className="w-4 h-4" />
            <span className="text-[11px]">{t.viewSplit}</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, viewMode: 'map' })}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filters.viewMode === 'map' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Mapa"
          >
            <Map className="w-4 h-4" />
            <span className="text-[11px]">{t.viewMap}</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, viewMode: 'list' })}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              filters.viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Llista"
          >
            <List className="w-4 h-4" />
            <span className="text-[11px]">{t.viewList}</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Collapsible Section: Price Range & User Ratings */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs animate-slide-down">
          {/* Price Range Slider / Selector */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
              <Euro className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t.filterPriceRange}: fins a {filters.maxRate} €</span>
            </label>
            <input
              type="range"
              min="15"
              max="500"
              step="5"
              value={filters.maxRate}
              onChange={(e) => onFilterChange({ ...filters, maxRate: Number(e.target.value) })}
              className="w-full accent-teal-600 dark:accent-teal-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
              <span>15 €</span>
              <span>250 €</span>
              <span>500 €+</span>
            </div>
          </div>

          {/* User Ratings filter */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{t.filterMinRating}</span>
            </label>
            <div className="flex items-center gap-1 flex-wrap">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, minRating: opt.value })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filters.minRating === opt.value
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <div className="flex items-end sm:col-span-2 md:col-span-1">
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  municipality: 'all',
                  category: 'all',
                  minRating: 0,
                  maxRate: 500,
                  searchQuery: '',
                  onlyAvailableToday: false
                })
              }
              className="w-full py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-semibold text-xs transition-colors"
            >
              Netejar filtres
            </button>
          </div>
        </div>
      )}

      {/* Municipality Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.filterMunicipality}:</span>
          <select
            value={filters.municipality}
            onChange={handleMunicipalityChange}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="all">{t.allMunicipalities}</option>
            {MALLORCA_MUNICIPALITIES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.comarca})
              </option>
            ))}
          </select>
        </div>

        {/* Quick municipality pill buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {popularMunicipalities.map((m) => {
            const isSelected = filters.municipality === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, municipality: m.id })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Available today toggle & Proximity GPS button */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Proximity Filter Toggle */}
          <button
            type="button"
            onClick={handleToggleProximity}
            disabled={isLocating}
            title={language === 'ca' ? 'Ordenar per distància des de la teva ubicació' : 'Ordenar por distancia desde tu ubicación'}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filters.sortBy === 'proximity'
                ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
            ) : (
              <Navigation className={`w-3.5 h-3.5 ${filters.sortBy === 'proximity' ? 'text-white' : 'text-sky-600 dark:text-sky-400'}`} />
            )}
            <span>
              {isLocating
                ? t.gettingLocation
                : filters.sortBy === 'proximity'
                ? t.filterProximityActive
                : t.filterProximity}
            </span>
          </button>

          {/* Available today toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, onlyAvailableToday: !filters.onlyAvailableToday })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filters.onlyAvailableToday
                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.filterAvailableToday}</span>
          </button>
        </div>
      </div>

      {/* Proximity Distance Radius Ribbon (Visible when proximity filter is active) */}
      {filters.sortBy === 'proximity' && (
        <div className="p-2.5 bg-sky-50/70 dark:bg-sky-950/60 rounded-2xl border border-sky-200/80 dark:border-sky-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200">
            <LocateFixed className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="font-semibold text-[11px]">
              {language === 'ca'
                ? '📍 Ordenat per proximitat a la teva posició a Mallorca'
                : '📍 Ordenado por proximidad a tu posición en Mallorca'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mr-1">
              {language === 'ca' ? 'Radi:' : 'Radio:'}
            </span>
            {[
              { label: language === 'ca' ? 'Tota Mallorca' : 'Toda Mallorca', value: 0 },
              { label: '< 10 km', value: 10 },
              { label: '< 25 km', value: 25 },
              { label: '< 50 km', value: 50 }
            ].map((r) => {
              const isSelected = (filters.maxDistanceKm || 0) === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, maxDistanceKm: r.value })}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, sortBy: 'default', maxDistanceKm: 0 })}
              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 underline"
            >
              {language === 'ca' ? 'Desactivar' : 'Desactivar'}
            </button>
          </div>
        </div>
      )}

      {/* Category selector row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, category: 'all' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            filters.category === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {t.allCategories}
        </button>
        {TASK_CATEGORIES.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-2xs font-bold'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
