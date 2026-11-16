export type Language = 'ca' | 'es';

export interface Translations {
  appName: string;
  tagline: string;
  badgeMallorca: string;
  navExplore: string;
  navMyTasksClient: string;
  navMyTasksProvider: string;
  navMessages: string;
  navProfile: string;
  roleClient: string;
  roleProvider: string;
  btnPublishTask: string;
  btnAvailability: string;
  btnEarnings: string;
  guaranteeNotice: string;
  commissionNotice: string;
  filterMunicipality: string;
  filterCategory: string;
  filterPriceRange: string;
  filterMinRating: string;
  filterAvailableToday: string;
  filterProximity: string;
  filterProximityActive: string;
  gettingLocation: string;
  locationGranted: string;
  distanceKm: string;
  allDistances: string;
  allMunicipalities: string;
  allCategories: string;
  searchPlaceholder: string;
  tabTasks: string;
  tabProviders: string;
  viewSplit: string;
  viewMap: string;
  viewList: string;
  // Provider specifics
  skillsTitle: string;
  servicesTitle: string;
  experienceTitle: string;
  portfolioTitle: string;
  availabilityTitle: string;
  licenseTitle: string;
  btnContact: string;
  btnViewProfile: string;
  // Client specifics
  clientHistoryTitle: string;
  clientReviewsReceivedTitle: string;
  btnViewTask: string;
  btnNegotiate: string;
  // Chat & Escrow
  chatTitle: string;
  proposePrice: string;
  acceptedPrice: string;
  depositEscrow: string;
  confirmFinished: string;
  escrowNotice: string;
  // Notifications
  notificationsTitle: string;
  markAllRead: string;
  noNotifications: string;
  simulateNotification: string;
  // Common
  today: string;
  verified: string;
  urgent: string;
  flexible: string;
  thisWeek: string;
  save: string;
  cancel: string;
  close: string;
  // Offline Mode
  offlineBannerTitle: string;
  offlineBannerDesc: string;
  offlineCachedData: string;
  offlineToggleTest: string;
  offlineBackOnline: string;
  offlineActionNotice: string;
  statusOnline: string;
  statusOffline: string;
}

export const translations: Record<Language, Translations> = {
  ca: {
    appName: 'FEINA X FEINA',
    tagline: 'Plataforma balear de serveis i feines a Mallorca',
    badgeMallorca: 'Mallorca · Illes Balears',
    navExplore: 'Explorar i Mapa',
    navMyTasksClient: 'Les Meves Feines',
    navMyTasksProvider: 'Pressupostos i Treballs',
    navMessages: 'Missatges',
    navProfile: 'El Meu Perfil',
    roleClient: 'Client',
    roleProvider: 'Prestador',
    btnPublishTask: 'Publicar Feina',
    btnAvailability: 'La Meva Disponibilitat',
    btnEarnings: 'El Meu Saldo',
    guaranteeNotice: 'Dipòsit de garantia en custòdia (escrow) · Pagament protegit',
    commissionNotice: 'Comissió per trams (2 € per <30 €, 3 € per 31-50 €, 5% per 51-100 €, 10% per >100 €) només per feina completada',
    filterMunicipality: 'Municipi de Mallorca',
    filterCategory: 'Especialitat / Categoria',
    filterPriceRange: 'Rang de preu (€)',
    filterMinRating: 'Puntuació mínima',
    filterAvailableToday: 'Disponibles avui',
    filterProximity: 'Proximitat GPS',
    filterProximityActive: 'A prop meu',
    gettingLocation: 'Localitzant...',
    locationGranted: 'Ubicació activa',
    distanceKm: 'km de tu',
    allDistances: 'Totes les distàncies',
    allMunicipalities: 'Tota l\'illa de Mallorca',
    allCategories: 'Totes les categories',
    searchPlaceholder: 'Cercar electricista, fontaner, marger, jardiner, persianes...',
    tabTasks: 'Sol·licituds de Feines',
    tabProviders: 'Prestadors de Serveis',
    viewSplit: 'Dividida',
    viewMap: 'Mapa',
    viewList: 'Llista',
    skillsTitle: 'Habilitats i Competències Tècniques',
    servicesTitle: 'Serveis Oferts i Tarifes Orientatives',
    experienceTitle: 'Experiència Professional i Trajectòria',
    portfolioTitle: 'Portafolis de Treballs a Mallorca',
    availabilityTitle: 'Disponibilitat i Cobertura de Municipis',
    licenseTitle: 'Número d\'Instal·lador Autoritzat / Certificació',
    btnContact: 'Contactar i Negociar',
    btnViewProfile: 'Veure Perfil Complet',
    clientHistoryTitle: 'Historial de Feines Sol·licitades',
    clientReviewsReceivedTitle: 'Valoracions Rebudes com a Client',
    btnViewTask: 'Veure Feina',
    btnNegotiate: 'Negociar Preu',
    chatTitle: 'Xat Privat i Negociació de Preu',
    proposePrice: 'Proposar Preu Tancat',
    acceptedPrice: 'Acord acceptat',
    depositEscrow: 'Dipositar Pagament en Custòdia',
    confirmFinished: 'Confirmar Feina Acabada i Alliberar Fons',
    escrowNotice: 'Els doblers queden protegits i només s\'entreguen quan estiguis 100% satisfet.',
    notificationsTitle: 'Notificacions de l\'App',
    markAllRead: 'Marcar-les totes com a llegides',
    noNotifications: 'No tens cap notificació nova',
    simulateNotification: 'Simular Notificació en Directe',
    today: 'Avui',
    verified: 'Identitat Verificada',
    urgent: 'Urgent 24h',
    flexible: 'Flexible',
    thisWeek: 'Aquesta setmana',
    save: 'Desar',
    cancel: 'Cancel·lar',
    close: 'Tancar',
    offlineBannerTitle: 'Mode fora de línia actiu (localStorage)',
    offlineBannerDesc: 'No s\'ha detectat connexió a Internet. Estàs consultant les dades emmagatzemades localment al teu navegador.',
    offlineCachedData: 'Dades locals emmagatzemades',
    offlineToggleTest: 'Simula mode fora de línia',
    offlineBackOnline: 'Tornar a estar en línia',
    offlineActionNotice: 'Acció desada a la memòria local (localStorage). Se sincronitzarà quan recuperis la connexió.',
    statusOnline: 'En línia',
    statusOffline: 'Fora de línia'
  },
  es: {
    appName: 'FEINA X FEINA',
    tagline: 'Plataforma balear de servicios y tareas en Mallorca',
    badgeMallorca: 'Mallorca · Illes Balears',
    navExplore: 'Explorar y Mapa',
    navMyTasksClient: 'Mis Solicitudes',
    navMyTasksProvider: 'Presupuestos y Trabajos',
    navMessages: 'Mensajes',
    navProfile: 'Mi Perfil',
    roleClient: 'Cliente',
    roleProvider: 'Prestador',
    btnPublishTask: 'Publicar Solicitud',
    btnAvailability: 'Mi Disponibilidad',
    btnEarnings: 'Mi Saldo',
    guaranteeNotice: 'Depósito de garantía en custodia (escrow) · Pago protegido',
    commissionNotice: 'Comisión por tramos (2 € para <30 €, 3 € para 31-50 €, 5% para 51-100 €, 10% para >100 €) solo por trabajo completado',
    filterMunicipality: 'Municipio de Mallorca',
    filterCategory: 'Especialidad / Categoría',
    filterPriceRange: 'Rango de precio (€)',
    filterMinRating: 'Puntuación mínima',
    filterAvailableToday: 'Disponibles hoy',
    filterProximity: 'Proximidad GPS',
    filterProximityActive: 'Cerca de mí',
    gettingLocation: 'Localizando...',
    locationGranted: 'Ubicación activa',
    distanceKm: 'km de ti',
    allDistances: 'Todas las distancias',
    allMunicipalities: 'Toda la isla de Mallorca',
    allCategories: 'Todas las categorías',
    searchPlaceholder: 'Buscar electricista, fontanero, albañil, jardinero, persianas...',
    tabTasks: 'Solicitudes de Tareas',
    tabProviders: 'Prestadores de Servicios',
    viewSplit: 'Dividida',
    viewMap: 'Mapa',
    viewList: 'Lista',
    skillsTitle: 'Habilidades y Competencias Técnicas',
    servicesTitle: 'Servicios Ofrecidos y Tarifas Orientativas',
    experienceTitle: 'Experiencia Profesional y Trayectoria',
    portfolioTitle: 'Portafolio de Trabajos en Mallorca',
    availabilityTitle: 'Disponibilidad y Cobertura de Municipios',
    licenseTitle: 'Número de Instalador Autorizado / Certificación',
    btnContact: 'Contactar y Negociar',
    btnViewProfile: 'Ver Perfil Completo',
    clientHistoryTitle: 'Historial de Tareas Solicitadas',
    clientReviewsReceivedTitle: 'Valoraciones Recibidas como Cliente',
    btnViewTask: 'Ver Tarea',
    btnNegotiate: 'Negociar Precio',
    chatTitle: 'Chat Privado y Negociación de Precio',
    proposePrice: 'Proponer Precio Cerrado',
    acceptedPrice: 'Acuerdo aceptado',
    depositEscrow: 'Depositar Pago en Custodia',
    confirmFinished: 'Confirmar Trabajo Completado y Liberar Fondos',
    escrowNotice: 'El dinero queda protegido y solo se transfiere cuando estés 100% satisfecho.',
    notificationsTitle: 'Notificaciones de la App',
    markAllRead: 'Marcar todas como leídas',
    noNotifications: 'No tienes notificaciones pendientes',
    simulateNotification: 'Simular Notificación en Directo',
    today: 'Hoy',
    verified: 'Identidad Verificada',
    urgent: 'Urgente 24h',
    flexible: 'Flexible',
    thisWeek: 'Esta semana',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    offlineBannerTitle: 'Modo sin conexión activo (localStorage)',
    offlineBannerDesc: 'No se ha detectado conexión a Internet. Estás consultando los datos almacenados localmente en tu navegador.',
    offlineCachedData: 'Datos locales almacenados',
    offlineToggleTest: 'Simular modo sin conexión',
    offlineBackOnline: 'Volver a estar en línea',
    offlineActionNotice: 'Acción guardada en la memoria local (localStorage). Se sincronizará en cuanto recuperes la conexión.',
    statusOnline: 'En línea',
    statusOffline: 'Sin conexión'
  }
};
