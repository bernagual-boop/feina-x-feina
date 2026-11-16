import { MallorcaMunicipality, TaskCategory, UserProfile, ServiceTask, Review, Conversation, ChatMessage, AppNotification } from '../types';

export const PLATFORM_COMMISSION_PERCENT = 10; // Mantenim per retrocompatibilitat

export interface CommissionBreakdown {
  fee: number;
  net: number;
  rateLabel: string;
  tierDescription: string;
  tierType: 'under_30' | '31_to_50' | '51_to_100' | 'over_100';
}

/**
 * Comissió per trams de FEINA X FEINA:
 * - Menys de 30 €: 2 € fixa
 * - Entre 31 i 50 €: 3 € fixa
 * - Entre 51 i 100 €: 5% de comissió
 * - Més de 100 €: 10% de comissió
 */
export function calculatePlatformCommission(amount: number, language: 'ca' | 'es' = 'ca'): CommissionBreakdown {
  const safeAmount = Math.max(0, amount);
  let fee = 0;
  let rateLabel = '';
  let tierDescription = '';
  let tierType: CommissionBreakdown['tierType'] = 'over_100';

  if (safeAmount <= 30) {
    fee = Math.min(safeAmount, 2.0);
    rateLabel = '2,00 €';
    tierDescription = language === 'ca' ? 'Comissió fixa de 2 € (< 30 €)' : 'Comisión fija de 2 € (< 30 €)';
    tierType = 'under_30';
  } else if (safeAmount <= 50) {
    fee = Math.min(safeAmount, 3.0);
    rateLabel = '3,00 €';
    tierDescription = language === 'ca' ? 'Comissió fixa de 3 € (31 - 50 €)' : 'Comisión fija de 3 € (31 - 50 €)';
    tierType = '31_to_50';
  } else if (safeAmount <= 100) {
    fee = Math.round(safeAmount * 0.05 * 100) / 100;
    rateLabel = '5%';
    tierDescription = language === 'ca' ? 'Comissió del 5% (51 - 100 €)' : 'Comisión del 5% (51 - 100 €)';
    tierType = '51_to_100';
  } else {
    fee = Math.round(safeAmount * 0.10 * 100) / 100;
    rateLabel = '10%';
    tierDescription = language === 'ca' ? 'Comissió del 10% (> 100 €)' : 'Comisión del 10% (> 100 €)';
    tierType = 'over_100';
  }

  const net = Math.max(0, safeAmount - fee);

  return {
    fee,
    net,
    rateLabel,
    tierDescription,
    tierType
  };
}

export const COMMISSION_TIERS = [
  {
    rangeCa: 'Fins a 30 €',
    rangeEs: 'Hasta 30 €',
    feeLabel: '2,00 €',
    typeCa: 'Tarifa fixa',
    typeEs: 'Tarifa fija',
    detailCa: 'Ideal per a petits arranjaments o tasques ràpides.',
    detailEs: 'Ideal para pequeños arreglos o tareas rápidas.'
  },
  {
    rangeCa: 'De 31 € a 50 €',
    rangeEs: 'De 31 € a 50 €',
    feeLabel: '3,00 €',
    typeCa: 'Tarifa fixa',
    typeEs: 'Tarifa fija',
    detailCa: 'Per a feines puntuals d\'una o dues hores.',
    detailEs: 'Para trabajos puntuales de una o dos horas.'
  },
  {
    rangeCa: 'De 51 € a 100 €',
    rangeEs: 'De 51 € a 100 €',
    feeLabel: '5%',
    typeCa: 'Percentatge reduït',
    typeEs: 'Porcentaje reducido',
    detailCa: 'Tarifa bonificada per a serveis mitjans a Mallorca.',
    detailEs: 'Tarifa bonificada para servicios medianos en Mallorca.'
  },
  {
    rangeCa: 'Més de 100 €',
    rangeEs: 'Más de 100 €',
    feeLabel: '10%',
    typeCa: 'Percentatge estàndard',
    typeEs: 'Porcentaje estándar',
    detailCa: 'Comissió estàndard per a grans treballs i reformes.',
    detailEs: 'Comisión estándar para grandes trabajos y reformas.'
  }
];


/**
 * Haversine formula: calcula la distància en quilòmetres entre dues coordenades [lat, lng]
 */
export function calculateDistanceKm(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371; // Radi de la Terra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

export function getProviderCoordinates(provider: UserProfile): [number, number] {
  const muni = MALLORCA_MUNICIPALITIES.find((m) =>
    provider.municipality.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])
  );
  return muni ? muni.coordinates : [39.5696, 2.6502]; // Per defecte Palma
}

export const MALLORCA_MUNICIPALITIES: MallorcaMunicipality[] = [
  { id: 'palma', name: 'Palma (Ciutat)', comarca: 'Palma', coordinates: [39.5696, 2.6502], population: 420000 },
  { id: 'calvia', name: 'Calvià', comarca: 'Ponent', coordinates: [39.5658, 2.5064], population: 52000 },
  { id: 'manacor', name: 'Manacor', comarca: 'Llevant', coordinates: [39.5697, 3.2096], population: 45000 },
  { id: 'inca', name: 'Inca', comarca: 'Raiguer', coordinates: [39.7214, 2.9108], population: 34000 },
  { id: 'llucmajor', name: 'Llucmajor', comarca: 'Pla de Mallorca', coordinates: [39.4906, 2.8906], population: 38000 },
  { id: 'marratxi', name: 'Marratxí', comarca: 'Raiguer', coordinates: [39.6389, 2.7381], population: 39000 },
  { id: 'alcudia', name: 'Alcúdia', comarca: 'Raiguer', coordinates: [39.8532, 3.1214], population: 21000 },
  { id: 'felanitx', name: 'Felanitx', comarca: 'Pla de Mallorca', coordinates: [39.4697, 3.1483], population: 18000 },
  { id: 'pollenca', name: 'Pollença', comarca: 'Serra de Tramuntana', coordinates: [39.8772, 3.0161], population: 17000 },
  { id: 'soller', name: 'Sóller', comarca: 'Serra de Tramuntana', coordinates: [39.7667, 2.7153], population: 14000 },
  { id: 'santanyi', name: 'Santanyí', comarca: 'Pla de Mallorca', coordinates: [39.3547, 3.1292], population: 13000 },
  { id: 'andratx', name: 'Andratx', comarca: 'Ponent', coordinates: [39.5764, 2.4225], population: 11800 },
  { id: 'santa_margalida', name: 'Santa Margalida', comarca: 'Pla de Mallorca', coordinates: [39.7028, 3.1039], population: 13000 },
  { id: 'capdepera', name: 'Capdepera', comarca: 'Llevant', coordinates: [39.7036, 3.4339], population: 12000 },
  { id: 'arta', name: 'Artà', comarca: 'Llevant', coordinates: [39.6936, 3.3497], population: 8000 },
  { id: 'binissalem', name: 'Binissalem', comarca: 'Raiguer', coordinates: [39.6881, 2.8436], population: 9000 },
  { id: 'sa_pobla', name: 'Sa Pobla', comarca: 'Raiguer', coordinates: [39.7694, 3.0239], population: 14000 },
  { id: 'valldemossa', name: 'Valldemossa', comarca: 'Serra de Tramuntana', coordinates: [39.7106, 2.6222], population: 2000 },
  { id: 'bunyola', name: 'Bunyola', comarca: 'Serra de Tramuntana', coordinates: [39.6961, 2.6997], population: 7000 },
  { id: 'algaida', name: 'Algaida', comarca: 'Pla de Mallorca', coordinates: [39.5594, 2.8942], population: 6000 },
  { id: 'porreres', name: 'Porreres', comarca: 'Pla de Mallorca', coordinates: [39.5186, 3.0239], population: 5600 },
  { id: 'campos', name: 'Campos', comarca: 'Pla de Mallorca', coordinates: [39.4319, 3.0186], population: 11500 },
  { id: 'son_servera', name: 'Son Servera', comarca: 'Llevant', coordinates: [39.6208, 3.3606], population: 12000 }
];

export const TASK_CATEGORIES: TaskCategory[] = [
  'Electricidad',
  'Fontanería',
  'Jardinería',
  'Reformas y Albañilería',
  'Pintura',
  'Limpieza',
  'Climatización y AC',
  'Cerrajería',
  'Carpintería',
  'Mudanzas y Portes',
  'Piscina y Mantenimiento',
  'Informática y Redes',
  'Cuidado y Acompañamiento'
];

export const DEMO_CLIENT: UserProfile = {
  id: 'client_antoni',
  name: 'Antoni Barceló Gomila',
  email: 'antoni.barcelo@feinaxfeina.es',
  phone: '+34 670 123 456',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  municipality: 'Palma (Ciutat)',
  bio: 'Residint a Palma. Propietari d\'un habitatge unifamiliar i una petita finca rústica a la vall de Sóller. Valoro la puntualitat, el respecte pels materials autòctons i la feina ben feta.',
  memberSince: 'Març 2024',
  rating: 4.95,
  reviewCount: 9,
  completedJobsCount: 14,
  isVerified: true,
  clientPastHistory: [
    {
      id: 'job_past_1',
      title: 'Poda de 12 oliveres centenàries a Sóller',
      category: 'Jardinería',
      municipality: 'Sóller',
      date: '15 Abril 2026',
      amount: 380,
      providerName: 'Catalina Oliver Servera',
      status: 'completed',
      reviewGiven: true
    },
    {
      id: 'job_past_2',
      title: 'Reparació de termo elèctric i vàlvula de pressió',
      category: 'Fontanería',
      municipality: 'Palma (Ciutat)',
      date: '28 Març 2026',
      amount: 140,
      providerName: 'Toni Fiol Llabrés',
      status: 'completed',
      reviewGiven: true
    },
    {
      id: 'job_past_3',
      title: 'Instal·lació de punt de recàrrega Wallbox Pulsar Plus',
      category: 'Electricidad',
      municipality: 'Palma (Ciutat)',
      date: 'En curs',
      amount: 290,
      providerName: 'Marc Coll Amengual',
      status: 'in_progress'
    }
  ],
  clientReviewsReceived: [
    {
      id: 'cl_rev_1',
      taskId: 'job_past_1',
      serviceTitle: 'Poda d\'oliveres a Sóller',
      clientId: 'client_antoni',
      clientName: 'Catalina Oliver Servera (Jardinera)',
      clientAvatar: '/src/assets/images/pro_service_gardener_1794464991176.jpg',
      providerId: 'pro_catalina',
      rating: 5,
      tags: ['Pagament immediat', 'Comunicació perfecta', 'Facilitat d\'accés'],
      comment: 'Un client exemplar. Va facilitar l\'accés a la finca rústica i el pagament es va alliberar immediatament en acabar la poda.',
      date: 'Fa 3 setmanes'
    },
    {
      id: 'cl_rev_2',
      taskId: 'job_past_2',
      serviceTitle: 'Reparació de termo a Palma',
      clientId: 'client_antoni',
      clientName: 'Toni Fiol Llabrés (Fontaner)',
      clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      providerId: 'pro_toni',
      rating: 5,
      tags: ['Molt educat', 'Puntual'],
      comment: 'Tracte immillorable. Explicació molt clara de la fallada abans d\'anar-hi. Un plaer treballar així a Mallorca.',
      date: 'Fa 1 mes'
    }
  ]
};

export const DEMO_PROVIDER: UserProfile = {
  id: 'pro_marc',
  name: 'Marc Coll Amengual',
  email: 'marc.electricitat@feinaxfeina.es',
  phone: '+34 689 987 654',
  role: 'provider',
  providerType: 'professional',
  avatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
  municipality: 'Palma (Ciutat)',
  bio: 'Instal·lador elèctric autoritzat a les Illes Balears. Especialista en recàrrega de vehicles elèctrics (Wallbox), fotovoltaica i climatització eficient per a xalets i cases de poble.',
  memberSince: 'Gener 2023',
  rating: 4.95,
  reviewCount: 42,
  completedJobsCount: 68,
  isVerified: true,
  earningsBalance: 340.00,
  totalEarned: 4890.00,
  experienceYears: 14,
  licenseNumber: 'IB-ELEC-48201 / REBT Categoria Especialista',
  certifications: [
    'Carnet Instal·lador en Baixa Tensió (Conselleria d\'Empresa, IB)',
    'Certificació Oficial Wallbox & Tesla Wall Connector',
    'Tècnic Instal·lador RITE Climatització i Gases Fluorats R32',
    'Prevenció de Riscos Laborals 60h Construcció i Electricitat'
  ],
  skills: [
    'Instal·lació de Wallbox',
    'Butlletins elèctrics oficials',
    'Quadres elèctrics i protecció sobretensions',
    'Energia Solar Fotovoltaica',
    'Aire condicionat Split Inverter',
    'Il·luminació LED per a jardins de marès',
    'Avaries elèctriques urgents'
  ],
  availability: {
    isAvailableToday: true,
    statusText: 'Disponible avui per a urgències i inspeccions a Palma, Calvià i Marratxí',
    scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte matí'],
    workHours: '08:00 - 19:30',
    coveredMunicipalities: ['palma', 'calvia', 'marratxi', 'inca', 'llucmajor', 'andratx']
  },
  servicesOffered: [
    {
      id: 'srv_1',
      category: 'Electricidad',
      name: 'Instal·lació i butlletins elèctrics oficials',
      description: 'Quadres de protecció, butlletí d\'enganxament, augments de potència i recablejat segons REBT.',
      estimatedRate: 40,
      rateType: 'hora'
    },
    {
      id: 'srv_2',
      category: 'Electricidad',
      name: 'Muntatge certificat de carregador Wallbox',
      description: 'Connexió directa des de comptador o quadre amb diferencial Tipus A, tub ignífug i configuració d\'App.',
      estimatedRate: 280,
      rateType: 'servicio'
    },
    {
      id: 'srv_3',
      category: 'Climatización y AC',
      name: 'Instal·lació d\'Aire Condicionat Split',
      description: 'Fixació exterior/interior, buit de circuit, connexió frigorífica i càrrega de gas R32.',
      estimatedRate: 190,
      rateType: 'servicio'
    }
  ],
  portfolioImages: [
    '/src/assets/images/pro_service_electrician_1794464991019.jpg',
    '/src/assets/images/mallorca_hero_landscape_1794464990308.jpg'
  ]
};

export const SEED_PROVIDERS: UserProfile[] = [
  DEMO_PROVIDER,
  {
    id: 'pro_catalina',
    name: 'Catalina Oliver Servera',
    email: 'catalina.jardineria@feinaxfeina.es',
    phone: '+34 654 321 987',
    role: 'provider',
    providerType: 'professional',
    avatar: '/src/assets/images/pro_service_gardener_1794464991176.jpg',
    municipality: 'Sóller',
    bio: 'Jardinera paisatgista mallorquina de la Serra de Tramuntana. Manteniment de finques rústiques, poda de formació i sanitat vegetal per a oliveres centenàries, cítrics de Sóller i reg per degoteig intel·ligent.',
    memberSince: 'Maig 2023',
    rating: 5.0,
    reviewCount: 36,
    completedJobsCount: 54,
    isVerified: true,
    earningsBalance: 520.00,
    totalEarned: 6240.00,
    experienceYears: 11,
    licenseNumber: 'IB-AGRO-9104 / Manipuladora Fitosanitaris Nivell Qualificat',
    certifications: [
      'Titulació en Gestió d\'Espais Verds i Paisatgisme Balear',
      'Certificat Europeu d\'Especialista en Poda d\'Alçada (ETW)',
      'Especialista en Regeneració d\'Oliveres Antigues i Marges'
    ],
    skills: [
      'Poda d\'oliveres de muntanya',
      'Neteja de parcel·les i desbrossament tallafocs',
      'Cura de tarongers i llimoneres de Sóller',
      'Instal·lació de reg automàtic per degoteig',
      'Tractaments ecològics contra plagues',
      'Manteniment de gespa autòctona de baix consum d\'aigua'
    ],
    availability: {
      isAvailableToday: true,
      statusText: 'Disponible aquesta setmana a Tramuntana i Raiguer',
      scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'],
      workHours: '07:30 - 15:30',
      coveredMunicipalities: ['soller', 'valldemossa', 'bunyola', 'deia', 'fornalutx', 'inca', 'palma']
    },
    servicesOffered: [
      {
        id: 'srv_cat_1',
        category: 'Jardinería',
        name: 'Poda d\'oliveres, garrovers i fruiters',
        description: 'Poda de copa, eliminació de xucladors i trituració vegetal in situ per a compostatge.',
        estimatedRate: 35,
        rateType: 'hora'
      },
      {
        id: 'srv_cat_2',
        category: 'Jardinería',
        name: 'Manteniment complet de jardí mediterrani',
        description: 'Punt a punt de sistemes de reg, retallat d\'arbustos i fertilització ecològica.',
        estimatedRate: 140,
        rateType: 'servicio'
      }
    ],
    portfolioImages: ['/src/assets/images/pro_service_gardener_1794464991176.jpg']
  },
  {
    id: 'pro_biel',
    name: 'Biel Ramis - Reformes i Pedra Seca',
    email: 'biel.reformes@feinaxfeina.es',
    phone: '+34 633 876 543',
    role: 'provider',
    providerType: 'professional',
    avatar: '/src/assets/images/pro_service_reforms_1794464991497.jpg',
    municipality: 'Manacor',
    bio: 'Mestre d\'obra i marger artesà. Més de dues dècades restaurant cases de poble, marès vist, microciment continu a banys i cuines, i aixecant marges tradicionals a tot el Llevant de Mallorca.',
    memberSince: 'Agost 2022',
    rating: 4.88,
    reviewCount: 51,
    completedJobsCount: 79,
    isVerified: true,
    earningsBalance: 1250.00,
    totalEarned: 18400.00,
    experienceYears: 22,
    licenseNumber: 'Gremi de Constructors de les Illes Balears nº 772',
    certifications: [
      'Carta de Mestre Artesà Marger (Consell de Mallorca)',
      'Especialista Oficial en Paviments Continus i Microciment',
      'Restauració de Bóvedes Mallorquines i Teulades Tradicionals'
    ],
    skills: [
      'Pedra seca tradicional (Marges)',
      'Restauració de marès i façanes rústiques',
      'Reforma completa de banys de disseny',
      'Microciment continu sense juntes',
      'Plats de dutxa d\'obra i aïllament d\'humitats',
      'Embaldosats de gran format'
    ],
    availability: {
      isAvailableToday: false,
      statusText: 'Pròxima disponibilitat en 4 dies per a pressupostos in situ',
      scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'],
      workHours: '08:00 - 18:00',
      coveredMunicipalities: ['manacor', 'felanitx', 'santanyi', 'arta', 'son_servera', 'campos', 'palma']
    },
    servicesOffered: [
      {
        id: 'srv_biel_1',
        category: 'Reformas y Albañilería',
        name: 'Reforma de bany en microciment o gres porcel·lànic',
        description: 'Enderroc, noves canonades multicapa, plat d\'obra i acabats de luxe.',
        estimatedRate: 1800,
        rateType: 'presupuesto'
      },
      {
        id: 'srv_biel_2',
        category: 'Reformas y Albañilería',
        name: 'Construcció de paret de pedra seca mallorquina',
        description: 'Tècnica tradicional de paredador, acabat net i resistent a esllavissades.',
        estimatedRate: 45,
        rateType: 'hora'
      }
    ],
    portfolioImages: ['/src/assets/images/pro_service_reforms_1794464991497.jpg']
  },
  {
    id: 'pro_elena',
    name: 'Elena Bauzà Soler',
    email: 'elena.neteja@feinaxfeina.es',
    phone: '+34 644 112 233',
    role: 'provider',
    providerType: 'professional',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    municipality: 'Calvià',
    bio: 'Empresa familiar especialitzada en neteja tècnica de xalets, cristalleria de grans dimensions enfront del mar, desinfecció a vapor i posada a punt fin d\'obra.',
    memberSince: 'Febrer 2024',
    rating: 4.96,
    reviewCount: 29,
    completedJobsCount: 45,
    isVerified: true,
    earningsBalance: 210.00,
    totalEarned: 2780.00,
    experienceYears: 8,
    licenseNumber: 'Registre d\'Activitats de Serveis Balears nº 1983',
    certifications: [
      'Protocol Higienicosanitari i Desinfecció Avançada',
      'Treballs d\'Alçada per a Neteja de Vidres Panoràmics'
    ],
    skills: [
      'Neteja de fi d\'obra profunda',
      'Cristalls panoràmics i salnitre marí',
      'Desinfecció d\'entapissats a vapor 140°C',
      'Tractament de sòls hidràulics i fusta noble'
    ],
    availability: {
      isAvailableToday: true,
      statusText: 'Disponible avui a Calvià, Andratx i Palma',
      scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
      workHours: '08:30 - 17:00',
      coveredMunicipalities: ['calvia', 'andratx', 'palma', 'marratxi']
    },
    servicesOffered: [
      {
        id: 'srv_elena_1',
        category: 'Limpieza',
        name: 'Neteja integral d\'habitatge o fi d\'obra',
        description: 'Equip professional amb aspiració HEPA, productes biodegradables i maquinària de vapor.',
        estimatedRate: 20,
        rateType: 'hora'
      }
    ],
    portfolioImages: []
  },
  {
    id: 'pro_toni',
    name: 'Toni Fiol Llabrés',
    email: 'toni.fontaneria@feinaxfeina.es',
    phone: '+34 611 445 566',
    role: 'provider',
    providerType: 'professional',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    municipality: 'Inca',
    bio: 'Fontaner qualificat en descalcificadors de sal d\'alt rendiment (imprescindibles per a l\'aigua dura de Mallorca), bombes de pressió d\'aljubs i urgències d\'aigua 24 hores.',
    memberSince: 'Novembre 2023',
    rating: 4.92,
    reviewCount: 38,
    completedJobsCount: 62,
    isVerified: true,
    earningsBalance: 410.00,
    totalEarned: 4950.00,
    experienceYears: 16,
    licenseNumber: 'IB-FON-3021 / Instal·lador d\'Aigua i Termosfonia',
    certifications: [
      'Instal·lador Autoritzat d\'Aigua i Calefacció',
      'Tècnic Oficial Culligan & Ath en Descalcificació'
    ],
    skills: [
      'Instal·lació de descalcificadors de sal',
      'Canvi de termos elèctrics d\'urgència',
      'Reparació de fuites empotrades',
      'Grups de pressió per a pous i aljubs',
      'Desbussaments mecànics 24h'
    ],
    availability: {
      isAvailableToday: true,
      statusText: 'Urgències 24h actives al Raiguer i Pla de Mallorca',
      scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'],
      workHours: '24 hores per a urgències',
      coveredMunicipalities: ['inca', 'binissalem', 'sa_pobla', 'alcudia', 'marratxi', 'palma']
    },
    servicesOffered: [
      {
        id: 'srv_toni_1',
        category: 'Fontanería',
        name: 'Instal·lació i manteniment de descalcificador',
        description: 'Muntatge complet amb bypass, filtre de sediments i càrrega de sal de qualitat.',
        estimatedRate: 180,
        rateType: 'servicio'
      },
      {
        id: 'srv_toni_2',
        category: 'Fontanería',
        name: 'Reparació de fuites i canvi de termo',
        description: 'Substitució ràpida de termo elèctric amb retirada de l\'antic.',
        estimatedRate: 120,
        rateType: 'servicio'
      }
    ],
    portfolioImages: []
  },
  {
    id: 'pro_laura',
    name: 'Laura Mestre Pou',
    email: 'laura.particular@feinaxfeina.es',
    phone: '+34 622 998 877',
    role: 'provider',
    providerType: 'particular',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    municipality: 'Palma (Ciutat)',
    bio: 'Veïna de Palma i estudiant universitària. Com a particular, ofereixo feines de suport: repàs escolar per a nins, acompanyament i compres per a gent gran, i passeig i cura de gossos i moixos a domicili.',
    memberSince: 'Març 2024',
    rating: 4.95,
    reviewCount: 19,
    completedJobsCount: 27,
    isVerified: true,
    earningsBalance: 140.00,
    totalEarned: 1120.00,
    experienceYears: 4,
    skills: [
      'Classes particulars primària i ESO',
      'Cura de mascotes i passeig',
      'Acompanyament a persones majors',
      'Ajuda amb encàrrecs i compres de proximitat',
      'Atenció i paciència'
    ],
    availability: {
      isAvailableToday: true,
      statusText: 'Disponible avui tardes i caps de setmana a Palma',
      scheduleDays: ['Dilluns', 'Dimecres', 'Divendres', 'Dissabte', 'Diumenge'],
      workHours: '15:30 - 20:30',
      coveredMunicipalities: ['palma', 'marratxi', 'calvia']
    },
    servicesOffered: [
      {
        id: 'srv_laura_1',
        category: 'Cuidado y Acompañamiento',
        name: 'Acompanyament i cura de mascotes a domicili',
        description: 'Passejos diaris, alimentació i cures afectuoses mentre ets fora o feineges.',
        estimatedRate: 15,
        rateType: 'hora'
      },
      {
        id: 'srv_laura_2',
        category: 'Cuidado y Acompañamiento',
        name: 'Classes de repàs escolar i lectura en català/castellà',
        description: 'Suport escolar personalitzat per a primària a domicili.',
        estimatedRate: 18,
        rateType: 'hora'
      }
    ],
    portfolioImages: []
  },
  {
    id: 'pro_joan',
    name: 'Joan Carles Mas',
    email: 'joan.bricolatge@feinaxfeina.es',
    phone: '+34 677 334 455',
    role: 'provider',
    providerType: 'particular',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    municipality: 'Inca',
    bio: 'Particular jubilat amb passió pel bricolatge i la fusteria domèstica. Munto mobles en kit (IKEA, Leroy Merlin), penjo cortines, reparo persianes enrotllables i faig petits arranjaments que els grans industrials no atenen.',
    memberSince: 'Gener 2024',
    rating: 4.89,
    reviewCount: 22,
    completedJobsCount: 35,
    isVerified: true,
    earningsBalance: 195.00,
    totalEarned: 1850.00,
    experienceYears: 25,
    skills: [
      'Muntatge de mobles en kit',
      'Canvi de cintes de persianes',
      'Penjar quadres, miralls i barres de cortines',
      'Reparació de panys senzills i frontisses',
      'Arranjaments casolans de bricolatge'
    ],
    availability: {
      isAvailableToday: true,
      statusText: 'Disponible avui matins a la zona d\'Inca i Raiguer',
      scheduleDays: ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'],
      workHours: '09:00 - 14:00',
      coveredMunicipalities: ['inca', 'binissalem', 'sa_pobla', 'algaida', 'marratxi']
    },
    servicesOffered: [
      {
        id: 'srv_joan_1',
        category: 'Carpintería',
        name: 'Muntatge de mobles i armaris modulars',
        description: 'Muntatge acurat de mobles d\'IKEA o similars amb eines pròpies.',
        estimatedRate: 20,
        rateType: 'hora'
      },
      {
        id: 'srv_joan_2',
        category: 'Reformas y Albañilería',
        name: 'Petits arranjaments de bricolatge i persianes',
        description: 'Substitució de corretges de persianes, silicona de bany i fixacions a parets.',
        estimatedRate: 25,
        rateType: 'hora'
      }
    ],
    portfolioImages: []
  }
];

export const SEED_TASKS: ServiceTask[] = [
  {
    id: 'task_001',
    clientId: 'client_antoni',
    clientName: 'Antoni Barceló Gomila',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Instal·lació de carregador Wallbox per a cotxe elèctric en garatge unifamiliar',
    description: 'Necessit instal·lar una presa de 7.4 kW amb derivació individual des del quadre principal fins al garatge (18 metres de canalització ignífuga). Ja dispòs del Wallbox Pulsar Plus. Es requereix butlletí oficial.',
    category: 'Electricidad',
    municipality: 'Palma (Ciutat)',
    addressDetails: 'Carrer de Son Rapinya, Palma',
    coordinates: [39.5855, 2.6189],
    preferredDate: 'Pròxims 3 dies',
    urgency: 'urgente',
    estimatedBudget: 320,
    status: 'negotiating',
    proposalsCount: 2,
    photos: ['/src/assets/images/pro_service_electrician_1794464991019.jpg'],
    createdAt: 'Fa 4 hores',
    acceptedProviderId: 'pro_marc',
    acceptedProviderName: 'Marc Coll Amengual',
    acceptedProviderAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
    agreedPrice: 290,
    platformFeePercentage: 10,
    platformFeeAmount: 29.00,
    providerNetEarnings: 261.00,
    paymentStatus: 'unpaid'
  },
  {
    id: 'task_002',
    clientId: 'client_maria',
    clientName: 'Maria Antònia Vicens',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Poda de 15 oliveres rústiques i desbrossament de parcel·la en finca',
    description: 'Cercam professional amb maquinària pròpia per a podar 15 oliveres de muntanya i desbrossar uns 1.200 m² de rostoll abans de l\'estiu per a prevenció d\'incendis.',
    category: 'Jardinería',
    municipality: 'Sóller',
    addressDetails: 'Camí de ses Argiles, Sóller (accés per pista asfaltada)',
    coordinates: [39.7681, 2.7198],
    preferredDate: 'Aquest cap de setmana',
    urgency: 'esta_semana',
    estimatedBudget: 450,
    status: 'in_progress',
    proposalsCount: 3,
    photos: ['/src/assets/images/pro_service_gardener_1794464991176.jpg'],
    createdAt: 'Ahir',
    acceptedProviderId: 'pro_catalina',
    acceptedProviderName: 'Catalina Oliver Servera',
    acceptedProviderAvatar: '/src/assets/images/pro_service_gardener_1794464991176.jpg',
    agreedPrice: 420,
    platformFeePercentage: 10,
    platformFeeAmount: 42.00,
    providerNetEarnings: 378.00,
    paymentStatus: 'held_in_escrow',
    paymentMethod: 'bizum'
  },
  {
    id: 'task_003',
    clientId: 'client_joan',
    clientName: 'Joan Martorell',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Reparació urgent de fuita d\'aigua a cuina de poble',
    description: 'Degoteig continu davall la pica de la cuina que prové de la clau de pas encastada a la paret. Hi ha humitat visible a l\'habitació del costat. Es precisa intervenció avui mateix.',
    category: 'Fontanería',
    municipality: 'Inca',
    addressDetails: 'Carrer Comerç, Inca centre',
    coordinates: [39.7208, 2.9115],
    preferredDate: 'Avui urgent',
    urgency: 'urgente',
    estimatedBudget: 110,
    status: 'open',
    proposalsCount: 1,
    photos: [],
    createdAt: 'Fa 45 min',
    platformFeePercentage: 10,
    paymentStatus: 'unpaid'
  },
  {
    id: 'task_004',
    clientId: 'client_clara',
    clientName: 'Clara Rosselló',
    clientAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Reforma i enrajolat de bany complet a casa rústica',
    description: 'Substitució de banyera antiga per plat de resina de 160x80 cm, col·locació de rajola porcel·lànica imitació marès i canvi de fontaneria vista a encastada.',
    category: 'Reformas y Albañilería',
    municipality: 'Santanyí',
    addressDetails: 'Carrer de la Pau, Santanyí',
    coordinates: [39.3562, 3.1284],
    preferredDate: 'A convenir aquest mes',
    urgency: 'flexible',
    estimatedBudget: 1950,
    status: 'open',
    proposalsCount: 4,
    photos: ['/src/assets/images/pro_service_reforms_1794464991497.jpg'],
    createdAt: 'Fa 2 dies',
    platformFeePercentage: 10,
    paymentStatus: 'unpaid'
  },
  {
    id: 'task_005',
    clientId: 'client_pedro',
    clientName: 'Pedro Alomar',
    clientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'Pintura exterior i tractament antihumitat a porxo de xalet',
    description: 'Xalet a Palmanova. Pintar porxo cobert de 60 m² i pilars exteriors amb pintura transpirable al siloxà resistent al salnitre marí.',
    category: 'Pintura',
    municipality: 'Calvià',
    addressDetails: 'Avinguda Platja, Palmanova',
    coordinates: [39.5181, 2.5358],
    preferredDate: 'Pròxima setmana',
    urgency: 'esta_semana',
    estimatedBudget: 550,
    status: 'open',
    proposalsCount: 2,
    photos: [],
    createdAt: 'Fa 1 dia',
    platformFeePercentage: 10,
    paymentStatus: 'unpaid'
  },
  {
    id: 'task_006',
    clientId: 'client_eva',
    clientName: 'Eva Krause',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    title: 'Posada a punt i manteniment de piscina salina de 8x4 m',
    description: 'Neteja de fons, calibratge del clorador salí, revisió de bomba i preparació amb productes respectuosos amb el medi ambient.',
    category: 'Piscina y Mantenimiento',
    municipality: 'Alcúdia',
    addressDetails: 'Urbanització Bonaire, Alcúdia',
    coordinates: [39.8702, 3.1432],
    preferredDate: 'Aquesta setmana',
    urgency: 'esta_semana',
    estimatedBudget: 220,
    status: 'completed',
    proposalsCount: 3,
    photos: [],
    createdAt: 'Fa 5 dies',
    acceptedProviderId: 'pro_marc',
    acceptedProviderName: 'Marc Coll Amengual',
    acceptedProviderAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
    agreedPrice: 200,
    platformFeePercentage: 10,
    platformFeeAmount: 20.00,
    providerNetEarnings: 180.00,
    paymentStatus: 'released_to_provider',
    paymentMethod: 'tarjeta',
    isReviewed: true
  }
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    taskId: 'task_001',
    taskTitle: 'Instal·lació de carregador Wallbox en garatge',
    taskMunicipality: 'Palma (Ciutat)',
    clientId: 'client_antoni',
    clientName: 'Antoni Barceló Gomila',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    providerId: 'pro_marc',
    providerName: 'Marc Coll Amengual',
    providerAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
    lastMessage: 'He ajustat la proposta a 290 € amb els tubs lliures d\'halògens i butlletí inclòs.',
    lastMessageTime: '11:42',
    unreadCountClient: 1,
    unreadCountProvider: 0,
    agreedPrice: 290,
    paymentStatus: 'unpaid',
    taskStatus: 'negotiating'
  },
  {
    id: 'conv_2',
    taskId: 'task_002',
    taskTitle: 'Poda de 15 oliveres rústiques i desbrossament',
    taskMunicipality: 'Sóller',
    clientId: 'client_maria',
    clientName: 'Maria Antònia Vicens',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    providerId: 'pro_catalina',
    providerName: 'Catalina Oliver Servera',
    providerAvatar: '/src/assets/images/pro_service_gardener_1794464991176.jpg',
    lastMessage: 'Pagament de 420 € dipositat en custòdia segura. Dissabte a les 8:00h començam.',
    lastMessageTime: 'Ahir 18:20',
    unreadCountClient: 0,
    unreadCountProvider: 0,
    agreedPrice: 420,
    paymentStatus: 'held_in_escrow',
    taskStatus: 'in_progress'
  }
];

export const SEED_MESSAGES: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_101',
      conversationId: 'conv_1',
      senderId: 'client_antoni',
      senderName: 'Antoni Barceló Gomila',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'client',
      text: 'Bon dia Marc, he vist el teu perfil a FEINA X FEINA especialitzat a Palma. Podries passar a veure la instal·lació del Wallbox a Son Rapinya?',
      timestamp: '10:15',
      type: 'text'
    },
    {
      id: 'msg_102',
      conversationId: 'conv_1',
      senderId: 'pro_marc',
      senderName: 'Marc Coll Amengual',
      senderAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
      senderRole: 'provider',
      text: 'Hola Antoni! Sí, estic disponible avui mateix pel capvespre. He mirat les fotos del quadre. En haver de tirar 18m de línia independent, material i mà d\'obra oficial sortiria a 310 €.',
      timestamp: '10:28',
      type: 'text'
    },
    {
      id: 'msg_103',
      conversationId: 'conv_1',
      senderId: 'client_antoni',
      senderName: 'Antoni Barceló Gomila',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'client',
      text: 'Ho podríem tancar a 290 € si m\'inclous la protecció diferencial tipus A reglamentària?',
      timestamp: '10:45',
      type: 'text'
    },
    {
      id: 'msg_104',
      conversationId: 'conv_1',
      senderId: 'pro_marc',
      senderName: 'Marc Coll Amengual',
      senderAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
      senderRole: 'provider',
      text: 'Tracte fet! T\'envio la proposta formal per l\'App perquè quedi tot fixat amb la garantia de FEINA X FEINA.',
      timestamp: '11:40',
      type: 'text'
    },
    {
      id: 'msg_105',
      conversationId: 'conv_1',
      senderId: 'pro_marc',
      senderName: 'Marc Coll Amengual',
      senderAvatar: '/src/assets/images/pro_service_electrician_1794464991019.jpg',
      senderRole: 'provider',
      text: 'Proposta formal de preu acordat enviada.',
      timestamp: '11:42',
      type: 'price_proposal',
      proposal: {
        amount: 290,
        proposedBy: 'provider',
        proposedByName: 'Marc Coll Amengual',
        status: 'pending',
        notes: 'Instal·lació de 18m de cable 6mm², tub ignífug vist, IGA + diferencial tipus A i butlletí oficial.',
        createdAt: '11:42'
      }
    }
  ]
};

export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    taskId: 'task_006',
    serviceTitle: 'Posada a punt de piscina salina a Alcúdia',
    clientId: 'client_eva',
    clientName: 'Eva Krause',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    providerId: 'pro_marc',
    rating: 5,
    tags: ['Puntualitat excel·lent', 'Molt professional', 'Neteja', 'Preu acordat complert'],
    comment: 'En Marc va ser puntualíssim, va detectar un problema a l\'elèctrode de sal que altres no havien vist i va deixar la piscina cristal·lina. Fa gust tractar amb professionals locals tan seriosos a Mallorca.',
    date: 'Fa 3 dies'
  },
  {
    id: 'rev_2',
    taskId: 'task_past_1',
    serviceTitle: 'Substitució de quadre elèctric a Calvià',
    clientId: 'client_pedro',
    clientName: 'Pedro Alomar',
    clientAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    providerId: 'pro_marc',
    rating: 5,
    tags: ['Ràpid', 'Material de primera', 'Explicació clara'],
    comment: 'Molt recomanable. Ens vam quedar sense llum per una tempesta i va venir en menys de dues hores a resoldre l\'avaria amb butlletí nou. 10 de 10.',
    date: 'Fa 2 setmanes'
  },
  {
    id: 'rev_3',
    taskId: 'task_past_2',
    serviceTitle: 'Poda i neteja de finca a Fornalutx',
    clientId: 'client_antoni',
    clientName: 'Antoni Barceló Gomila',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    providerId: 'pro_catalina',
    rating: 5,
    tags: ['Mestria en oliveres', 'Tracte immillorable', 'Puntual'],
    comment: 'Na Catalina és una artista amb els arbres tradicionals de Mallorca. Va tractar amb màxima cura els marges antics i va deixar-ho tot netíssim.',
    date: 'Fa 1 mes'
  }
];

// Seed push notifications for app
export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'job_match',
    title: 'Nova feina que coincideix amb els teus serveis',
    message: 'Sol·licitud d\'Electricitat a Palma: "Instal·lació de carregador Wallbox en garatge unifamiliar". Presupost: 320 €.',
    timestamp: 'Fa 15 min',
    read: false,
    relatedTaskId: 'task_001'
  },
  {
    id: 'notif_2',
    type: 'chat_message',
    title: 'Nou missatge de negociació de preu',
    message: 'Marc Coll t\'ha enviat una proposta formal tancada per 290,00 €.',
    timestamp: 'Fa 35 min',
    read: false,
    relatedConversationId: 'conv_1'
  },
  {
    id: 'notif_3',
    type: 'transaction_completed',
    title: 'Transacció completada amb èxit',
    message: 'Servei de piscina finalitzat a Alcúdia. S\'han transferit 180,00 € nets al teu saldo (comissió del 10% descomptada: 20,00 €).',
    timestamp: 'Ahir',
    read: true,
    relatedTaskId: 'task_006',
    amount: 180.0
  },
  {
    id: 'notif_4',
    type: 'proposal_accepted',
    title: 'Proposta de preu acceptada',
    message: 'Maria Antònia Vicens ha dipositat 420,00 € en custòdia per a la feina de poda a Sóller.',
    timestamp: 'Fa 1 dia',
    read: true,
    relatedTaskId: 'task_002',
    amount: 420.0
  }
];
