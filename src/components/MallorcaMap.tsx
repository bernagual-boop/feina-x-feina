import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ServiceTask, UserProfile, MallorcaMunicipality } from '../types';

interface MallorcaMapProps {
  tasks: ServiceTask[];
  providers: UserProfile[];
  selectedMunicipality?: MallorcaMunicipality | null;
  selectedTaskId?: string | null;
  selectedProviderId?: string | null;
  onSelectTask?: (task: ServiceTask) => void;
  onSelectProvider?: (provider: UserProfile) => void;
  isPickingLocation?: boolean;
  pickedLocation?: [number, number] | null;
  onLocationPicked?: (coords: [number, number]) => void;
  heightClass?: string;
  showProviders?: boolean;
  showTasks?: boolean;
}

export const MallorcaMap: React.FC<MallorcaMapProps> = ({
  tasks,
  providers,
  selectedMunicipality,
  selectedTaskId,
  selectedProviderId,
  onSelectTask,
  onSelectProvider,
  isPickingLocation = false,
  pickedLocation,
  onLocationPicked,
  heightClass = 'h-[460px] md:h-[580px]',
  showProviders = true,
  showTasks = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Coordenadas centrales de Mallorca (Inca / Sineu / Costitx)
    const mallorcaCenter: [number, number] = [39.6953, 3.0176];
    
    const map = L.map(mapContainerRef.current, {
      center: mallorcaCenter,
      zoom: 10,
      minZoom: 9,
      maxZoom: 17,
      zoomControl: true,
      maxBounds: [
        [39.10, 2.20], // Suroeste
        [40.05, 3.60]  // Noreste
      ]
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    mapRef.current = map;

    // Click handler for picking location
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onLocationPicked) {
        onLocationPicked([e.latlng.lat, e.latlng.lng]);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Pan to selected municipality when changed
  useEffect(() => {
    if (!mapRef.current) return;
    if (selectedMunicipality) {
      mapRef.current.flyTo(selectedMunicipality.coordinates, 12, {
        duration: 1.2
      });
    } else {
      mapRef.current.flyTo([39.6953, 3.0176], 10, {
        duration: 1.2
      });
    }
  }, [selectedMunicipality]);

  // Handle picked location marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (pickedLocation) {
      if (pickMarkerRef.current) {
        pickMarkerRef.current.setLatLng(pickedLocation);
      } else {
        const pinIcon = L.divIcon({
          className: 'custom-pin-icon',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-rose-200 animate-bounce">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        const marker = L.marker(pickedLocation, {
          icon: pinIcon,
          draggable: true
        }).addTo(mapRef.current);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onLocationPicked) {
            onLocationPicked([pos.lat, pos.lng]);
          }
        });

        pickMarkerRef.current = marker;
      }
    } else if (pickMarkerRef.current) {
      pickMarkerRef.current.remove();
      pickMarkerRef.current = null;
    }
  }, [pickedLocation, onLocationPicked]);

  // Render Markers for Tasks and Providers
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    // Render Tasks
    if (showTasks) {
      tasks.forEach((task) => {
        const isSelected = selectedTaskId === task.id;
        const urgencyColor = task.urgency === 'urgente' 
          ? 'bg-rose-500 ring-rose-200 text-white' 
          : 'bg-sky-600 ring-sky-200 text-white';

        const customTaskIcon = L.divIcon({
          className: 'task-map-marker',
          html: `
            <div class="group cursor-pointer transform transition-transform hover:scale-110 ${isSelected ? 'scale-125 z-50' : ''}">
              <div class="flex items-center gap-1.5 px-2.5 py-1 ${urgencyColor} rounded-full text-xs font-semibold shadow-md ring-2 whitespace-nowrap">
                <span>${task.category.split(' ')[0]}</span>
                <span class="opacity-90 font-mono">${task.estimatedBudget}€</span>
              </div>
              <div class="w-2 h-2 ${task.urgency === 'urgente' ? 'bg-rose-600' : 'bg-sky-600'} rotate-45 mx-auto -mt-1"></div>
            </div>
          `,
          iconSize: [80, 30],
          iconAnchor: [40, 30]
        });

        const marker = L.marker(task.coordinates, { icon: customTaskIcon });

        // Popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'w-64 p-1 text-slate-800';
        popupContent.innerHTML = `
          <div class="text-[11px] font-medium text-sky-700 uppercase tracking-wider mb-1">${task.municipality} · ${task.category}</div>
          <div class="text-sm font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">${task.title}</div>
          <p class="text-xs text-slate-600 mb-2 line-clamp-2">${task.description}</p>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
            <div>
              <span class="text-slate-500">Presupuesto:</span>
              <span class="font-bold text-slate-900 ml-1 font-mono">${task.estimatedBudget} €</span>
            </div>
            <button id="view-task-${task.id}" class="px-2.5 py-1 bg-sky-600 text-white rounded-md text-xs font-medium hover:bg-sky-700 transition-colors">
              Ver Tarea
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-task-${task.id}`);
          if (btn && onSelectTask) {
            btn.onclick = () => {
              onSelectTask(task);
            };
          }
        });

        markersGroup.addLayer(marker);
      });
    }

    // Render Providers
    if (showProviders) {
      providers.forEach((provider) => {
        const isSelected = selectedProviderId === provider.id;
        // Lookup approximate municipality coordinates for provider
        const muni = provider.municipality;
        // Base coordinate with slight random offset to avoid exact stacking
        let coords: [number, number] = [39.5696, 2.6502]; // Palma default
        if (muni.includes('Palma')) coords = [39.5750, 2.6480];
        else if (muni.includes('Sóller')) coords = [39.7667, 2.7153];
        else if (muni.includes('Manacor')) coords = [39.5697, 3.2096];
        else if (muni.includes('Calvià')) coords = [39.5558, 2.5164];
        else if (muni.includes('Inca')) coords = [39.7214, 2.9108];

        const customProIcon = L.divIcon({
          className: 'pro-map-marker',
          html: `
            <div class="group cursor-pointer transform transition-transform hover:scale-110 ${isSelected ? 'scale-125 z-50' : ''}">
              <div class="flex items-center gap-1.5 p-1 bg-white rounded-full shadow-md ring-2 ring-emerald-500">
                <img src="${provider.avatar}" alt="${provider.name}" class="w-6 h-6 rounded-full object-cover" />
                <span class="text-[11px] font-bold text-emerald-800 pr-1.5 whitespace-nowrap">★ ${provider.rating.toFixed(1)}</span>
              </div>
              <div class="w-1.5 h-1.5 bg-emerald-600 rotate-45 mx-auto -mt-0.5"></div>
            </div>
          `,
          iconSize: [60, 28],
          iconAnchor: [30, 28]
        });

        const marker = L.marker(coords, { icon: customProIcon });

        const popupContent = document.createElement('div');
        popupContent.className = 'w-64 p-1 text-slate-800';
        popupContent.innerHTML = `
          <div class="flex items-center gap-2 mb-2">
            <img src="${provider.avatar}" class="w-9 h-9 rounded-full object-cover" />
            <div>
              <div class="text-xs font-bold text-slate-900">${provider.name}</div>
              <div class="text-[11px] text-emerald-700 font-medium">★ ${provider.rating.toFixed(1)} (${provider.reviewCount} reseñas)</div>
            </div>
          </div>
          <div class="text-xs text-slate-600 mb-2 line-clamp-2">${provider.bio}</div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
            <span class="text-[11px] text-slate-500">${provider.municipality}</span>
            <button id="view-pro-${provider.id}" class="px-2.5 py-1 bg-emerald-600 text-white rounded-md text-xs font-medium hover:bg-emerald-700 transition-colors">
              Ver Perfil
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-pro-${provider.id}`);
          if (btn && onSelectProvider) {
            btn.onclick = () => {
              onSelectProvider(provider);
            };
          }
        });

        markersGroup.addLayer(marker);
      });
    }
  }, [tasks, providers, showTasks, showProviders, selectedTaskId, selectedProviderId, onSelectTask, onSelectProvider]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Mode hint badge */}
      {isPickingLocation && (
        <div className="absolute top-3 left-3 right-3 sm:right-auto z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-sky-300 dark:border-sky-700 shadow-md text-xs text-sky-900 dark:text-sky-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
          <span>Fes clic a qualsevol punt de Mallorca per fixar la ubicació exacta de la feina.</span>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm text-[11px] flex items-center gap-3 text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 dark:bg-sky-500" />
          <span>Feines actives</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Prestadors</span>
        </div>
      </div>
    </div>
  );
};
