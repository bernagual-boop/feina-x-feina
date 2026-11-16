import React from 'react';
import { Conversation, UserProfile, Role } from '../types';
import { MessageSquare, Lock, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  currentRole: Role;
  onOpenConversation: (conv: Conversation) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  currentRole,
  onOpenConversation
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">Missatges i Negociacions Privades</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Converses actives, acords de preu tancat i estat de pagaments en custòdia.
          </p>
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-xs text-slate-500 dark:text-slate-400">
          <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
          <p>No tens converses obertes encara.</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Explora les feines al mapa o contacta amb un prestador per iniciar una negociació.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {conversations.map((conv) => {
            const counterpartyName = currentRole === 'client' ? conv.providerName : conv.clientName;
            const counterpartyAvatar = currentRole === 'client' ? conv.providerAvatar : conv.clientAvatar;
            const unread = currentRole === 'client' ? conv.unreadCountClient : conv.unreadCountProvider;

            return (
              <div
                key={conv.id}
                onClick={() => onOpenConversation(conv)}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-sky-300 dark:hover:border-sky-500 transition-all cursor-pointer flex items-center justify-between gap-4 group duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={counterpartyAvatar}
                      alt={counterpartyName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-sky-400 transition-all"
                    />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate font-display">
                        {counterpartyName}
                      </h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">· {conv.lastMessageTime}</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                      {conv.taskTitle}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {/* Status pills */}
                  {conv.paymentStatus === 'unpaid' && (
                    <span className="text-[10px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span>{conv.agreedPrice ? `Acordat: ${conv.agreedPrice}€` : 'Negociant'}</span>
                    </span>
                  )}
                  {conv.paymentStatus === 'held_in_escrow' && (
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>En Custòdia ({conv.agreedPrice}€)</span>
                    </span>
                  )}
                  {conv.paymentStatus === 'released_to_provider' && (
                    <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                      <span>Finalitzat</span>
                    </span>
                  )}

                  <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    <MapPin className="w-3 h-3" />
                    <span>{conv.taskMunicipality}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
