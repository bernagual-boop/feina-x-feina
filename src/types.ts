export type Role = 'client' | 'provider';

export interface MallorcaMunicipality {
  id: string;
  name: string;
  comarca: 'Palma' | 'Ponent' | 'Raiguer' | 'Pla de Mallorca' | 'Llevant' | 'Serra de Tramuntana';
  coordinates: [number, number]; // [lat, lng]
  population?: number;
}

export type TaskCategory = 
  | 'Electricidad'
  | 'Fontanería'
  | 'Jardinería'
  | 'Reformas y Albañilería'
  | 'Pintura'
  | 'Limpieza'
  | 'Climatización y AC'
  | 'Cerrajería'
  | 'Carpintería'
  | 'Mudanzas y Portes'
  | 'Piscina y Mantenimiento'
  | 'Informática y Redes'
  | 'Cuidado y Acompañamiento';

export interface ProviderService {
  id: string;
  category: TaskCategory;
  name: string;
  description: string;
  estimatedRate: number;
  rateType: 'hora' | 'servicio' | 'presupuesto';
}

export interface ProviderAvailability {
  isAvailableToday: boolean;
  statusText: string;
  scheduleDays: string[];
  workHours: string;
  coveredMunicipalities: string[]; // municipality IDs or 'all'
}

export interface Review {
  id: string;
  taskId: string;
  serviceTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  providerId: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  date: string;
}

export interface ClientPastJob {
  id: string;
  title: string;
  category: TaskCategory;
  municipality: string;
  date: string;
  amount: number;
  providerName: string;
  status: 'completed' | 'in_progress';
  reviewGiven?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  municipality: string;
  bio: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  isVerified: boolean;
  // Provider specifics
  providerType?: 'professional' | 'particular'; // Professional autònom / empresa o particular
  skills?: string[];
  experienceYears?: number;
  certifications?: string[];
  licenseNumber?: string;
  servicesOffered?: ProviderService[];
  availability?: ProviderAvailability;
  portfolioImages?: string[];
  earningsBalance?: number;
  totalEarned?: number;
  // Client specifics
  clientPastHistory?: ClientPastJob[];
  clientReviewsReceived?: Review[];
}

export type TaskStatus = 'open' | 'negotiating' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'held_in_escrow' | 'released_to_provider';

export interface ServiceTask {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientPhone?: string;
  title: string;
  description: string;
  category: TaskCategory;
  municipality: string;
  addressDetails: string;
  coordinates: [number, number]; // [lat, lng]
  preferredDate: string;
  urgency: 'urgente' | 'esta_semana' | 'flexible';
  estimatedBudget: number; // Presupuesto estimado inicial para negociar
  status: TaskStatus;
  proposalsCount: number;
  photos: string[];
  createdAt: string;
  // Negotiation & payment agreement details
  acceptedProviderId?: string;
  acceptedProviderName?: string;
  acceptedProviderAvatar?: string;
  agreedPrice?: number; // Precio final pactado directamente
  platformFeePercentage: number; // 10%
  platformFeeAmount?: number;
  providerNetEarnings?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'bizum' | 'tarjeta' | 'apple_pay';
  isReviewed?: boolean;
}

export interface ChatProposal {
  amount: number;
  proposedBy: 'client' | 'provider';
  proposedByName: string;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: Role;
  text: string;
  timestamp: string;
  type: 'text' | 'price_proposal' | 'proposal_accepted' | 'escrow_paid' | 'job_completed' | 'system';
  proposal?: ChatProposal;
}

export interface Conversation {
  id: string;
  taskId: string;
  taskTitle: string;
  taskMunicipality: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCountClient: number;
  unreadCountProvider: number;
  agreedPrice?: number;
  paymentStatus: PaymentStatus;
  taskStatus: TaskStatus;
  isReviewed?: boolean;
}

export type NotificationType = 
  | 'job_match' 
  | 'chat_message' 
  | 'transaction_completed' 
  | 'proposal_accepted' 
  | 'proposal_declined';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedTaskId?: string;
  relatedConversationId?: string;
  relatedProviderId?: string;
  amount?: number;
}

export interface FilterState {
  municipality: string; // 'all' or municipality id
  category: string; // 'all' or TaskCategory
  urgency: string; // 'all' or urgency
  minBudget: number;
  maxBudget: number;
  minRating: number; // 0, 4.0, 4.5, 4.8
  minRate: number; // provider hourly or service min
  maxRate: number; // provider hourly or service max
  searchQuery: string;
  onlyAvailableToday: boolean;
  viewMode: 'split' | 'map' | 'list';
  sortBy: 'default' | 'proximity' | 'rating' | 'price_asc' | 'price_desc';
  userLocation?: [number, number] | null; // [latitude, longitude]
  maxDistanceKm?: number; // 0 for all distances, or radius in km
  providerTypeFilter?: 'all' | 'professional' | 'particular';
}
