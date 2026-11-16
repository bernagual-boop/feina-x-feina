import React, { useState, useEffect } from 'react';
import { 
  Role, 
  UserProfile, 
  ServiceTask, 
  Conversation, 
  ChatMessage, 
  Review, 
  FilterState, 
  AppNotification, 
  NotificationType 
} from './types';
import { 
  DEMO_CLIENT, 
  DEMO_PROVIDER, 
  SEED_PROVIDERS, 
  SEED_TASKS, 
  SEED_CONVERSATIONS, 
  SEED_MESSAGES, 
  SEED_REVIEWS, 
  SEED_NOTIFICATIONS, 
  MALLORCA_MUNICIPALITIES, 
  calculatePlatformCommission,
  calculateDistanceKm,
  getProviderCoordinates
} from './data/mallorcaData';
import { Language, translations } from './i18n';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SearchFilters } from './components/SearchFilters';
import { MallorcaMap } from './components/MallorcaMap';
import { TaskCard } from './components/TaskCard';
import { ProviderCard } from './components/ProviderCard';
import { TaskCreationModal } from './components/TaskCreationModal';
import { ProviderAvailabilityModal } from './components/ProviderAvailabilityModal';
import { ChatNegotiationModal } from './components/ChatNegotiationModal';
import { PaymentEscrowModal } from './components/PaymentEscrowModal';
import { ReviewModal } from './components/ReviewModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ProviderDetailModal } from './components/ProviderDetailModal';
import { ClientDetailModal } from './components/ClientDetailModal';
import { EarningsDrawer } from './components/EarningsDrawer';
import { NotificationCenter, ToastBanner } from './components/NotificationCenter';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineStatusBanner } from './components/OfflineStatusBanner';
import { PlusCircle } from 'lucide-react';

export default function App() {
  // Theme State (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('feinaxfeina_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('feinaxfeina_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Language State (CA default, Balearic focus)
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('feinaxfeina_lang') as Language) || 'ca';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('feinaxfeina_lang', lang);
  };

  const t = translations[language];

  // Offline Detection & Basic LocalStorage Offline Mode
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    return localStorage.getItem('feinaxfeina_simulated_offline') === 'true';
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      localStorage.setItem('feinaxfeina_simulated_offline', String(next));
      return next;
    });
  };

  const isEffectivelyOffline = !isOnline || isSimulatedOffline;

  // User and Role state
  const [currentRole, setCurrentRole] = useState<Role>('client');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_CLIENT);

  // Entities state
  const [tasks, setTasks] = useState<ServiceTask[]>(() => {
    const saved = localStorage.getItem('feinaxfeina_tasks');
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });

  const [providers, setProviders] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('feinaxfeina_providers');
    return saved ? JSON.parse(saved) : SEED_PROVIDERS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('feinaxfeina_conversations');
    return saved ? JSON.parse(saved) : SEED_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('feinaxfeina_messages');
    return saved ? JSON.parse(saved) : SEED_MESSAGES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('feinaxfeina_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('feinaxfeina_notifs');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'explore' | 'my_tasks' | 'messages' | 'profile'>('explore');
  const [activeEntity, setActiveEntity] = useState<'tasks' | 'providers'>('tasks');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    municipality: 'all',
    category: 'all',
    urgency: 'all',
    minBudget: 0,
    maxBudget: 5000,
    minRating: 0,
    minRate: 10,
    maxRate: 500,
    searchQuery: '',
    onlyAvailableToday: false,
    viewMode: 'split',
    sortBy: 'default',
    userLocation: null,
    maxDistanceKm: 0,
    providerTypeFilter: 'all'
  });

  // Modal Dialogs State
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isEarningsOpen, setIsEarningsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activePaymentTask, setActivePaymentTask] = useState<{ task: ServiceTask; amount: number } | null>(null);
  const [activeReviewTask, setActiveReviewTask] = useState<{ task: ServiceTask; provider: UserProfile } | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<ServiceTask | null>(null);
  const [selectedProviderDetail, setSelectedProviderDetail] = useState<UserProfile | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<UserProfile | null>(null);

  // Map Location Picker State
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<[number, number] | null>(null);

  // In-app Toast Banner
  const [toastNotification, setToastNotification] = useState<AppNotification | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('feinaxfeina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('feinaxfeina_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('feinaxfeina_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('feinaxfeina_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('feinaxfeina_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('feinaxfeina_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Role toggle handler
  const handleRoleToggle = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'client') {
      setCurrentUser(DEMO_CLIENT);
      setActiveEntity('tasks');
    } else {
      setCurrentUser(DEMO_PROVIDER);
      setActiveEntity('providers');
    }
  };

  // Switch demo user
  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'client') {
      setActiveEntity('tasks');
    } else {
      setActiveEntity('providers');
    }
  };

  // Trigger Push Notification Simulator
  const triggerPushNotification = (type: NotificationType) => {
    let newNotif: AppNotification;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    switch (type) {
      case 'job_match':
        newNotif = {
          id: `notif_${Date.now()}`,
          type: 'job_match',
          title: language === 'ca' ? 'Nova feina que coincideix amb el teu perfil' : 'Nueva tarea que coincide con tu perfil',
          message: language === 'ca'
            ? 'Sol·licitud a Sóller: "Poda d\'oliveres de muntanya i neteja". Pressupost: 450 €.'
            : 'Solicitud en Sóller: "Poda de olivos de montaña y desbroce". Presupuesto: 450 €.',
          timestamp: timeStr,
          read: false,
          relatedTaskId: 'task_002'
        };
        break;
      case 'chat_message':
        newNotif = {
          id: `notif_${Date.now()}`,
          type: 'chat_message',
          title: language === 'ca' ? 'Nou missatge de negociació' : 'Nuevo mensaje de negociación',
          message: language === 'ca'
            ? 'Marc Coll ha proposat un preu tancat de 290,00 € per a la teva feina a Palma.'
            : 'Marc Coll ha propuesto un precio cerrado de 290,00 € para tu tarea en Palma.',
          timestamp: timeStr,
          read: false,
          relatedConversationId: 'conv_1'
        };
        break;
      case 'transaction_completed':
        const { fee: notifFee, net: notifNet, rateLabel: notifRate } = calculatePlatformCommission(290.0, language);
        newNotif = {
          id: `notif_${Date.now()}`,
          type: 'transaction_completed',
          title: language === 'ca' ? 'Transacció completada amb èxit' : 'Transacción completada con éxito',
          message: language === 'ca'
            ? `Feina confirmada! S'han transferit ${notifNet.toFixed(2)} € nets al teu saldo (comissió ${notifRate}: ${notifFee.toFixed(2)} €).`
            : `¡Trabajo confirmado! Se han transferido ${notifNet.toFixed(2)} € netos a tu saldo (comisión ${notifRate}: ${notifFee.toFixed(2)} €).`,
          timestamp: timeStr,
          read: false,
          amount: notifNet
        };
        break;
      case 'proposal_accepted':
        newNotif = {
          id: `notif_${Date.now()}`,
          type: 'proposal_accepted',
          title: language === 'ca' ? 'Proposta de preu acceptada' : 'Propuesta de precio aceptada',
          message: language === 'ca'
            ? 'El client ha acceptat el preu de 290 € i ha dipositat el pagament en custòdia.'
            : 'El cliente ha aceptado el precio de 290 € y ha depositado el pago en custodia.',
          timestamp: timeStr,
          read: false,
          relatedTaskId: 'task_001',
          amount: 290.0
        };
        break;
      default:
        newNotif = {
          id: `notif_${Date.now()}`,
          type: 'chat_message',
          title: 'Notificació FEINA X FEINA',
          message: 'Actualització del servei a Mallorca.',
          timestamp: timeStr,
          read: false
        };
    }

    setNotifications([newNotif, ...notifications]);
    setToastNotification(newNotif);

    setTimeout(() => {
      setToastNotification((prev) => (prev?.id === newNotif.id ? null : prev));
    }, 6000);
  };

  // Handle Create Task
  const handleCreateTask = (newTaskData: Omit<ServiceTask, 'id' | 'createdAt' | 'proposalsCount' | 'paymentStatus'>) => {
    const taskId = `task_${Date.now()}`;
    const newTask: ServiceTask = {
      ...newTaskData,
      id: taskId,
      createdAt: language === 'ca' ? 'Ara mateix' : 'Ahora mismo',
      proposalsCount: 0,
      paymentStatus: 'unpaid'
    };

    setTasks([newTask, ...tasks]);
    setIsPickingLocation(false);
    setPickedLocation(null);

    if (isEffectivelyOffline) {
      const offlineNotif: AppNotification = {
        id: `notif_offline_${Date.now()}`,
        type: 'job_match',
        title: language === 'ca' ? '⚡ Feina desada localment (localStorage)' : '⚡ Tarea guardada localmente (localStorage)',
        message: language === 'ca'
          ? 'La teva sol·licitud s\'ha desat a la memòria del navegador. La pots visualitzar immediatament en mode fora de línia.'
          : 'Tu solicitud se ha guardado en la memoria del navegador. Puedes visualizarla de inmediato en modo sin conexión.',
        timestamp: 'Ara',
        read: false
      };
      setToastNotification(offlineNotif);
      setTimeout(() => setToastNotification((prev) => prev?.id === offlineNotif.id ? null : prev), 6000);
    } else {
      triggerPushNotification('job_match');
    }
  };

  // Open Chat for Task
  const handleOpenChatForTask = (task: ServiceTask) => {
    let conv = conversations.find((c) => c.taskId === task.id);
    if (!conv) {
      const provider = task.acceptedProviderId 
        ? providers.find((p) => p.id === task.acceptedProviderId) || DEMO_PROVIDER
        : DEMO_PROVIDER;

      conv = {
        id: `conv_${Date.now()}`,
        taskId: task.id,
        taskTitle: task.title,
        taskMunicipality: task.municipality,
        clientId: task.clientId,
        clientName: task.clientName,
        clientAvatar: task.clientAvatar,
        providerId: provider.id,
        providerName: provider.name,
        providerAvatar: provider.avatar,
        lastMessage: language === 'ca' ? 'Negociació oberta' : 'Negociación abierta',
        lastMessageTime: 'Ara',
        unreadCountClient: 0,
        unreadCountProvider: 0,
        agreedPrice: task.agreedPrice,
        paymentStatus: task.paymentStatus,
        taskStatus: task.status
      };

      setConversations([conv, ...conversations]);
      setMessages({
        ...messages,
        [conv.id]: [
          {
            id: `msg_init_${Date.now()}`,
            conversationId: conv.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderRole: currentRole,
            text: language === 'ca' 
              ? `Hola! M'agradaria parlar sobre la feina "${task.title}" a ${task.municipality}.`
              : `¡Hola! Me gustaría hablar sobre la tarea "${task.title}" en ${task.municipality}.`,
            timestamp: 'Ara',
            type: 'text'
          }
        ]
      });
    }

    setSelectedTaskDetail(null);
    setSelectedProviderDetail(null);
    setActiveConversation(conv);
  };

  // Open Chat with Provider
  const handleContactProvider = (provider: UserProfile) => {
    const clientTask = tasks.find((t) => t.clientId === currentUser.id) || tasks[0];
    let conv = conversations.find((c) => c.providerId === provider.id && c.taskId === clientTask.id);

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        taskId: clientTask.id,
        taskTitle: clientTask.title,
        taskMunicipality: clientTask.municipality,
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientAvatar: currentUser.avatar,
        providerId: provider.id,
        providerName: provider.name,
        providerAvatar: provider.avatar,
        lastMessage: language === 'ca' ? 'Sol·licitud de servei' : 'Solicitud de servicio',
        lastMessageTime: 'Ara',
        unreadCountClient: 0,
        unreadCountProvider: 1,
        agreedPrice: clientTask.agreedPrice,
        paymentStatus: clientTask.paymentStatus,
        taskStatus: clientTask.status
      };

      setConversations([conv, ...conversations]);
      setMessages({
        ...messages,
        [conv.id]: [
          {
            id: `msg_init_${Date.now()}`,
            conversationId: conv.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderRole: currentRole,
            text: language === 'ca'
              ? `Bon dia ${provider.name.split(' ')[0]}, he vist la teva disponibilitat a Mallorca per a serveis de ${provider.servicesOffered?.[0]?.category || 'manteniment'}.`
              : `Hola ${provider.name.split(' ')[0]}, he visto tu disponibilidad en Mallorca para servicios de ${provider.servicesOffered?.[0]?.category || 'mantenimiento'}.`,
            timestamp: 'Ara',
            type: 'text'
          }
        ]
      });
    }

    setSelectedProviderDetail(null);
    setActiveConversation(conv);
  };

  // Send message in chat
  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentRole,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    const convMessages = messages[activeConversation.id] || [];
    setMessages({
      ...messages,
      [activeConversation.id]: [...convMessages, newMsg]
    });

    setConversations(
      conversations.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: newMsg.timestamp,
              unreadCountProvider: currentRole === 'client' ? c.unreadCountProvider + 1 : c.unreadCountProvider,
              unreadCountClient: currentRole === 'provider' ? c.unreadCountClient + 1 : c.unreadCountClient
            }
          : c
      )
    );
  };

  // Send Price Proposal
  const handleSendPriceProposal = (amount: number, notes?: string) => {
    if (!activeConversation) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const proposalMsg: ChatMessage = {
      id: `prop_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentRole,
      text: language === 'ca' ? `Proposta formal de preu tancat: ${amount.toFixed(2)} €` : `Propuesta formal de precio cerrado: ${amount.toFixed(2)} €`,
      timestamp: timeStr,
      type: 'price_proposal',
      proposal: {
        amount,
        proposedBy: currentRole,
        proposedByName: currentUser.name,
        status: 'pending',
        notes,
        createdAt: timeStr
      }
    };

    const convMessages = messages[activeConversation.id] || [];
    setMessages({
      ...messages,
      [activeConversation.id]: [...convMessages, proposalMsg]
    });

    setConversations(
      conversations.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: `Proposta de preu: ${amount} €`,
              lastMessageTime: timeStr,
              agreedPrice: amount
            }
          : c
      )
    );

    triggerPushNotification('chat_message');
  };

  // Accept Proposal
  const handleAcceptProposal = (amount: number) => {
    if (!activeConversation) return;

    const { fee: commission, net: providerNet } = calculatePlatformCommission(amount, language);

    setTasks(
      tasks.map((t) =>
        t.id === activeConversation.taskId
          ? {
              ...t,
              agreedPrice: amount,
              platformFeeAmount: commission,
              providerNetEarnings: providerNet,
              status: 'negotiating'
            }
          : t
      )
    );

    setConversations(
      conversations.map((c) =>
        c.id === activeConversation.id
          ? { ...c, agreedPrice: amount }
          : c
      )
    );

    const confirmMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'system',
      senderName: 'FEINA X FEINA',
      senderAvatar: '',
      senderRole: 'client',
      text: language === 'ca'
        ? `Preu de ${amount.toFixed(2)} € acceptat per ambdues parts. El client pot procedir al dipòsit en custòdia segura.`
        : `Precio de ${amount.toFixed(2)} € aceptado por ambas partes. El cliente puede proceder al depósito en custodia segura.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system'
    };

    const convMessages = messages[activeConversation.id] || [];
    setMessages({
      ...messages,
      [activeConversation.id]: [...convMessages, confirmMsg]
    });

    triggerPushNotification('proposal_accepted');
  };

  // Confirm Escrow Payment
  const handleConfirmPayment = (method: 'bizum' | 'tarjeta' | 'apple_pay') => {
    if (!activePaymentTask) return;
    const { task, amount } = activePaymentTask;
    const { fee, net } = calculatePlatformCommission(amount, language);

    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: 'in_progress',
              paymentStatus: 'held_in_escrow',
              paymentMethod: method,
              agreedPrice: amount,
              platformFeeAmount: fee,
              providerNetEarnings: net
            }
          : t
      )
    );

    if (activeConversation) {
      const escrowMsg: ChatMessage = {
        id: `escrow_${Date.now()}`,
        conversationId: activeConversation.id,
        senderId: 'system',
        senderName: 'FEINA X FEINA',
        senderAvatar: '',
        senderRole: 'client',
        text: language === 'ca'
          ? `Pagament de ${amount.toFixed(2)} € dipositat en custòdia segura mitjançant ${method.toUpperCase()}. El prestador ja pot executar el servei.`
          : `Pago de ${amount.toFixed(2)} € depositado en custodia segura mediante ${method.toUpperCase()}. El prestador ya puede ejecutar el servicio.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'escrow_paid'
      };

      setMessages({
        ...messages,
        [activeConversation.id]: [...(messages[activeConversation.id] || []), escrowMsg]
      });

      setConversations(
        conversations.map((c) =>
          c.id === activeConversation.id
            ? { ...c, paymentStatus: 'held_in_escrow', taskStatus: 'in_progress' }
            : c
        )
      );
    }

    setActivePaymentTask(null);
  };

  // Complete Job & Release Funds
  const handleCompleteJobAndReleaseFunds = (task: ServiceTask) => {
    const amount = task.agreedPrice || task.estimatedBudget;
    const { fee, net, rateLabel } = calculatePlatformCommission(amount, language);

    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: 'completed',
              paymentStatus: 'released_to_provider'
            }
          : t
      )
    );

    setProviders(
      providers.map((p) =>
        p.id === (task.acceptedProviderId || DEMO_PROVIDER.id)
          ? {
              ...p,
              earningsBalance: (p.earningsBalance || 0) + net,
              totalEarned: (p.totalEarned || 0) + net,
              completedJobsCount: p.completedJobsCount + 1
            }
          : p
      )
    );

    if (activeConversation) {
      const doneMsg: ChatMessage = {
        id: `comp_${Date.now()}`,
        conversationId: activeConversation.id,
        senderId: 'system',
        senderName: 'FEINA X FEINA',
        senderAvatar: '',
        senderRole: 'client',
        text: language === 'ca'
          ? `Feina confirmada com a finalitzada. S'han alliberat ${net.toFixed(2)} € nets al prestador (comissió ${rateLabel}: ${fee.toFixed(2)} €).`
          : `Trabajo confirmado como finalizado. Se han liberado ${net.toFixed(2)} € netos al prestador (comisión ${rateLabel}: ${fee.toFixed(2)} €).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'job_completed'
      };

      setMessages({
        ...messages,
        [activeConversation.id]: [...(messages[activeConversation.id] || []), doneMsg]
      });

      setConversations(
        conversations.map((c) =>
          c.id === activeConversation.id
            ? { ...c, paymentStatus: 'released_to_provider', taskStatus: 'completed' }
            : c
        )
      );
    }

    triggerPushNotification('transaction_completed');

    const provider = providers.find((p) => p.id === task.acceptedProviderId) || DEMO_PROVIDER;
    setActiveReviewTask({ task, provider });
  };

  // Submit Review
  const handleSubmitReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);

    setProviders(
      providers.map((p) => {
        if (p.id === newReview.providerId) {
          const proReviews = [...reviews.filter((r) => r.providerId === p.id), newReview];
          const avg = proReviews.reduce((sum, r) => sum + r.rating, 0) / proReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(2)),
            reviewCount: p.reviewCount + 1
          };
        }
        return p;
      })
    );

    setTasks(
      tasks.map((t) =>
        t.id === newReview.taskId
          ? { ...t, isReviewed: true }
          : t
      )
    );

    setActiveReviewTask(null);
  };

  // Withdraw provider funds
  const handleWithdrawFunds = (amount: number) => {
    setProviders(
      providers.map((p) =>
        p.id === currentUser.id
          ? { ...p, earningsBalance: 0 }
          : p
      )
    );
    setCurrentUser((prev) => ({ ...prev, earningsBalance: 0 }));
  };

  // Filter Tasks
  let filteredTasks = tasks.filter((t) => {
    if (filters.municipality !== 'all') {
      const muniObj = MALLORCA_MUNICIPALITIES.find((m) => m.id === filters.municipality);
      if (muniObj && !t.municipality.toLowerCase().includes(muniObj.name.toLowerCase().split(' ')[0])) {
        return false;
      }
    }

    if (filters.category !== 'all' && t.category !== filters.category) {
      return false;
    }

    if (filters.maxRate && t.estimatedBudget > filters.maxRate) {
      return false;
    }

    if (filters.sortBy === 'proximity' && filters.userLocation && filters.maxDistanceKm && filters.maxDistanceKm > 0) {
      const dist = calculateDistanceKm(filters.userLocation, t.coordinates);
      if (dist > filters.maxDistanceKm) return false;
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.municipality.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  if (filters.sortBy === 'proximity' && filters.userLocation) {
    const loc = filters.userLocation;
    filteredTasks = filteredTasks.slice().sort((a, b) => {
      return calculateDistanceKm(loc, a.coordinates) - calculateDistanceKm(loc, b.coordinates);
    });
  }

  // Filter Providers
  let filteredProviders = providers.filter((p) => {
    if (filters.providerTypeFilter && filters.providerTypeFilter !== 'all') {
      if (filters.providerTypeFilter === 'particular' && p.providerType !== 'particular') {
        return false;
      }
      if (filters.providerTypeFilter === 'professional' && p.providerType === 'particular') {
        return false;
      }
    }

    if (filters.municipality !== 'all') {
      const covered = p.availability?.coveredMunicipalities || [];
      if (!covered.includes('all') && !covered.includes(filters.municipality) && !p.municipality.toLowerCase().includes(filters.municipality)) {
        return false;
      }
    }

    if (filters.category !== 'all') {
      const hasCat = p.servicesOffered?.some((s) => s.category === filters.category);
      if (!hasCat) return false;
    }

    if (filters.minRating > 0 && p.rating < filters.minRating) {
      return false;
    }

    if (filters.onlyAvailableToday && !p.availability?.isAvailableToday) {
      return false;
    }

    if (filters.sortBy === 'proximity' && filters.userLocation && filters.maxDistanceKm && filters.maxDistanceKm > 0) {
      const dist = calculateDistanceKm(filters.userLocation, getProviderCoordinates(p));
      if (dist > filters.maxDistanceKm) return false;
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBio = p.bio.toLowerCase().includes(q);
      const matchSkills = p.skills?.some((s) => s.toLowerCase().includes(q));
      const matchServices = p.servicesOffered?.some((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchSkills && !matchServices) return false;
    }

    return true;
  });

  if (filters.sortBy === 'proximity' && filters.userLocation) {
    const loc = filters.userLocation;
    filteredProviders = filteredProviders.slice().sort((a, b) => {
      return calculateDistanceKm(loc, getProviderCoordinates(a)) - calculateDistanceKm(loc, getProviderCoordinates(b));
    });
  }

  const selectedMunicipalityObj = MALLORCA_MUNICIPALITIES.find((m) => m.id === filters.municipality) || null;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const unreadMessagesCount = conversations.reduce(
    (acc, c) => acc + (currentRole === 'client' ? c.unreadCountClient : c.unreadCountProvider),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 md:pb-12 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleToggle={handleRoleToggle}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenEarnings={() => setIsEarningsOpen(true)}
        onOpenAvailability={() => setIsAvailabilityOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={handleToggleSimulatedOffline}
      />

      {/* Floating Push Notification Toast */}
      <ToastBanner
        notification={toastNotification}
        onClose={() => setToastNotification(null)}
        onAction={(notif) => {
          if (notif.relatedConversationId) {
            const conv = conversations.find((c) => c.id === notif.relatedConversationId);
            if (conv) setActiveConversation(conv);
          } else if (notif.relatedTaskId) {
            const task = tasks.find((t) => t.id === notif.relatedTaskId);
            if (task) setSelectedTaskDetail(task);
          } else {
            setIsNotificationsOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        {/* Offline Status & LocalStorage Cache Banner */}
        <OfflineStatusBanner
          isOnline={isOnline}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulatedOffline={handleToggleSimulatedOffline}
          tasksCount={tasks.length}
          providersCount={providers.length}
          conversationsCount={conversations.length}
          language={language}
        />
        
        {/* TAB: EXPLORE & MAP */}
        {activeTab === 'explore' && (
          <div>
            <HeroSection
              currentRole={currentRole}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenAvailability={() => setIsAvailabilityOpen(true)}
              tasksCount={tasks.length}
              providersCount={providers.length}
              language={language}
            />

            {/* How It Works Onboarding (Pas a Pas per a Client i Prestador) */}
            <HowItWorksSection
              language={language}
              onSelectRole={handleRoleToggle}
              onOpenCreateTask={() => setIsCreateTaskOpen(true)}
              onOpenAvailability={() => setIsAvailabilityOpen(true)}
            />

            {/* Search and Filters */}
            <div className="mb-6">
              <SearchFilters
                filters={filters}
                onFilterChange={setFilters}
                tasksCount={filteredTasks.length}
                providersCount={filteredProviders.length}
                activeEntity={activeEntity}
                setActiveEntity={setActiveEntity}
                language={language}
              />
            </div>

            {/* Content view modes: Split, Map or List */}
            {filters.viewMode === 'map' ? (
              <div className="mb-8">
                <MallorcaMap
                  tasks={filteredTasks}
                  providers={filteredProviders}
                  selectedMunicipality={selectedMunicipalityObj}
                  onSelectTask={(task) => setSelectedTaskDetail(task)}
                  onSelectProvider={(pro) => setSelectedProviderDetail(pro)}
                  isPickingLocation={isPickingLocation}
                  pickedLocation={pickedLocation}
                  onLocationPicked={setPickedLocation}
                  heightClass="h-[620px]"
                  showTasks={activeEntity === 'tasks'}
                  showProviders={activeEntity === 'providers'}
                />
              </div>
            ) : filters.viewMode === 'list' ? (
              <div className="mb-8">
                {activeEntity === 'tasks' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        distanceKm={filters.userLocation ? calculateDistanceKm(filters.userLocation, task.coordinates) : undefined}
                        onSelect={setSelectedTaskDetail}
                        onOpenChat={handleOpenChatForTask}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProviders.map((provider) => (
                      <ProviderCard
                        key={provider.id}
                        provider={provider}
                        distanceKm={filters.userLocation ? calculateDistanceKm(filters.userLocation, getProviderCoordinates(provider)) : undefined}
                        onSelect={setSelectedProviderDetail}
                        onContact={handleContactProvider}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Split View (List + Interactive Map) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-start">
                {/* Left: Cards List */}
                <div className="lg:col-span-6 space-y-4 max-h-[720px] overflow-y-auto pr-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-1">
                    <span>
                      {activeEntity === 'tasks'
                        ? `${filteredTasks.length} sol·licituds a ${selectedMunicipalityObj ? selectedMunicipalityObj.name : 'Mallorca'}`
                        : `${filteredProviders.length} professionals verificats`}
                    </span>
                    <span className="text-[11px] font-mono text-teal-800 dark:text-teal-400">Comissió per trams garantida</span>
                  </div>

                  {activeEntity === 'tasks' ? (
                    filteredTasks.length === 0 ? (
                      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        No s'han trobat sol·licituds amb aquests filtres a Mallorca.
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          distanceKm={filters.userLocation ? calculateDistanceKm(filters.userLocation, task.coordinates) : undefined}
                          onSelect={setSelectedTaskDetail}
                          onOpenChat={handleOpenChatForTask}
                        />
                      ))
                    )
                  ) : (
                    filteredProviders.length === 0 ? (
                      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        No s'han trobat professionals amb aquests criteris.
                      </div>
                    ) : (
                      filteredProviders.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          distanceKm={filters.userLocation ? calculateDistanceKm(filters.userLocation, getProviderCoordinates(provider)) : undefined}
                          onSelect={setSelectedProviderDetail}
                          onContact={handleContactProvider}
                        />
                      ))
                    )
                  )}
                </div>

                {/* Right: Interactive Mallorca Map */}
                <div className="lg:col-span-6 sticky top-24">
                  <MallorcaMap
                    tasks={filteredTasks}
                    providers={filteredProviders}
                    selectedMunicipality={selectedMunicipalityObj}
                    onSelectTask={(task) => setSelectedTaskDetail(task)}
                    onSelectProvider={(pro) => setSelectedProviderDetail(pro)}
                    isPickingLocation={isPickingLocation}
                    pickedLocation={pickedLocation}
                    onLocationPicked={setPickedLocation}
                    heightClass="h-[520px] lg:h-[700px]"
                    showTasks={activeEntity === 'tasks'}
                    showProviders={activeEntity === 'providers'}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: MY TASKS / MY QUOTES */}
        {activeTab === 'my_tasks' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                  {currentRole === 'client' ? t.navMyTasksClient : t.navMyTasksProvider}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentRole === 'client'
                    ? 'Seguiment de feines publicades, negociacions i dipòsits en custòdia.'
                    : 'Feines assignades, estat del treball i ingressos pendents de liquidar.'}
                </p>
              </div>

              {currentRole === 'client' && (
                <button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.btnPublishTask}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks
                .filter((task) =>
                  currentRole === 'client'
                    ? task.clientId === currentUser.id
                    : task.acceptedProviderId === currentUser.id
                )
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onSelect={setSelectedTaskDetail}
                    onOpenChat={handleOpenChatForTask}
                  />
                ))}
            </div>
          </div>
        )}

        {/* TAB: MESSAGES & NEGOTIATIONS */}
        {activeTab === 'messages' && (
          <MessagesView
            conversations={conversations}
            currentUser={currentUser}
            currentRole={currentRole}
            onOpenConversation={(conv) => setActiveConversation(conv)}
          />
        )}

        {/* TAB: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            currentRole={currentRole}
            onSwitchUser={handleSwitchUser}
            onOpenAvailability={() => setIsAvailabilityOpen(true)}
            onOpenEarnings={() => setIsEarningsOpen(true)}
            onOpenClientProfile={setSelectedClientDetail}
            onOpenProviderProfile={setSelectedProviderDetail}
            tasks={tasks}
            reviews={reviews}
            language={language}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (iOS & Android touch ergonomically pinned) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadMessagesCount}
        currentRole={currentRole}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
      />

      {/* MODAL: Task Creation */}
      {isCreateTaskOpen && (
        <TaskCreationModal
          currentUser={currentUser}
          onClose={() => setIsCreateTaskOpen(false)}
          onCreateTask={handleCreateTask}
          onPickOnMapRequest={() => {
            setIsCreateTaskOpen(false);
            setActiveTab('explore');
            setFilters((f) => ({ ...f, viewMode: 'map' }));
            setIsPickingLocation(true);
          }}
          pickedCoords={pickedLocation}
        />
      )}

      {/* MODAL: Provider Availability */}
      {isAvailabilityOpen && (
        <ProviderAvailabilityModal
          provider={currentUser}
          onClose={() => setIsAvailabilityOpen(false)}
          onUpdateProvider={(updated) => {
            setCurrentUser((prev) => ({ ...prev, ...updated }));
            setProviders(
              providers.map((p) => (p.id === currentUser.id ? { ...p, ...updated } : p))
            );
          }}
        />
      )}

      {/* MODAL: Chat & Direct Price Negotiation */}
      {activeConversation && (
        <ChatNegotiationModal
          conversation={activeConversation}
          task={tasks.find((t) => t.id === activeConversation.taskId) || tasks[0]}
          currentUser={currentUser}
          currentRole={currentRole}
          messages={messages[activeConversation.id] || []}
          onClose={() => setActiveConversation(null)}
          onSendMessage={handleSendMessage}
          onSendPriceProposal={handleSendPriceProposal}
          onAcceptProposal={handleAcceptProposal}
          onOpenPaymentEscrow={(task, amount) => {
            setActivePaymentTask({ task, amount });
          }}
          onCompleteJobAndReleaseFunds={handleCompleteJobAndReleaseFunds}
        />
      )}

      {/* MODAL: Escrow Payment Simulation */}
      {activePaymentTask && (
        <PaymentEscrowModal
          task={activePaymentTask.task}
          agreedPrice={activePaymentTask.amount}
          onClose={() => setActivePaymentTask(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* MODAL: Review & Rating */}
      {activeReviewTask && (
        <ReviewModal
          task={activeReviewTask.task}
          provider={activeReviewTask.provider}
          currentUser={currentUser}
          onClose={() => setActiveReviewTask(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* MODAL: Task Detail */}
      {selectedTaskDetail && (
        <TaskDetailModal
          task={selectedTaskDetail}
          currentUser={currentUser}
          currentRole={currentRole}
          onClose={() => setSelectedTaskDetail(null)}
          onOpenChat={handleOpenChatForTask}
        />
      )}

      {/* MODAL: Provider Detail */}
      {selectedProviderDetail && (
        <ProviderDetailModal
          provider={selectedProviderDetail}
          reviews={reviews}
          onClose={() => setSelectedProviderDetail(null)}
          onContactProvider={handleContactProvider}
          language={language}
        />
      )}

      {/* MODAL: Client Detail */}
      {selectedClientDetail && (
        <ClientDetailModal
          client={selectedClientDetail}
          onClose={() => setSelectedClientDetail(null)}
          language={language}
        />
      )}

      {/* DRAWER: Provider Earnings Ledger */}
      {isEarningsOpen && (
        <EarningsDrawer
          currentUser={currentUser}
          completedTasks={tasks.filter((t) => t.paymentStatus === 'released_to_provider')}
          onClose={() => setIsEarningsOpen(false)}
          onWithdraw={handleWithdrawFunds}
        />
      )}

      {/* DRAWER: Push Notification Center */}
      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAsRead={(id) => {
          setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onMarkAllAsRead={() => {
          setNotifications(notifications.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(notif) => {
          if (notif.relatedConversationId) {
            const conv = conversations.find((c) => c.id === notif.relatedConversationId);
            if (conv) setActiveConversation(conv);
          } else if (notif.relatedTaskId) {
            const task = tasks.find((t) => t.id === notif.relatedTaskId);
            if (task) setSelectedTaskDetail(task);
          }
          setIsNotificationsOpen(false);
        }}
        onSimulateNotification={triggerPushNotification}
        language={language}
      />
    </div>
  );
}
