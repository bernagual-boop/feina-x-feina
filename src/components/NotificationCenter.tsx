import React, { useState } from 'react';
import { AppNotification, NotificationType } from '../types';
import { Bell, X, Check, ArrowRight, MessageSquare, Briefcase, DollarSign, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Language, translations } from '../i18n';

interface NotificationCenterProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onSimulateNotification: (type: NotificationType) => void;
  language: Language;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification,
  onSimulateNotification,
  language
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const t = translations[language];

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'job_match':
        return <Briefcase className="w-4 h-4 text-sky-600" />;
      case 'chat_message':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'transaction_completed':
        return <DollarSign className="w-4 h-4 text-teal-600" />;
      case 'proposal_accepted':
        return <CheckCircle2 className="w-4 h-4 text-indigo-600" />;
      case 'proposal_declined':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
  };

  const getBadgeColor = (type: NotificationType) => {
    switch (type) {
      case 'job_match':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'chat_message':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'transaction_completed':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'proposal_accepted':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'proposal_declined':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{t.notificationsTitle}</h3>
              <p className="text-[11px] text-sky-200">Alertes en temps real de FEINA X FEINA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Simulator Toolbar */}
        <div className="p-3 bg-sky-50/80 border-b border-sky-100 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-sky-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{t.simulateNotification}</span>
            </span>
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-sky-700 hover:underline"
            >
              {t.markAllRead}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSimulateNotification('job_match')}
              className="px-2 py-1 bg-white text-sky-800 rounded-lg border border-sky-200 text-[10px] font-semibold hover:bg-sky-100 transition-colors"
            >
              + Nova Feina a Palma
            </button>
            <button
              type="button"
              onClick={() => onSimulateNotification('chat_message')}
              className="px-2 py-1 bg-white text-emerald-800 rounded-lg border border-emerald-200 text-[10px] font-semibold hover:bg-emerald-100 transition-colors"
            >
              + Missatge / Oferta
            </button>
            <button
              type="button"
              onClick={() => onSimulateNotification('transaction_completed')}
              className="px-2 py-1 bg-white text-teal-800 rounded-lg border border-teal-200 text-[10px] font-semibold hover:bg-teal-100 transition-colors"
            >
              + Pagament Rebut (Comissió neta)
            </button>
            <button
              type="button"
              onClick={() => onSimulateNotification('proposal_accepted')}
              className="px-2 py-1 bg-white text-indigo-800 rounded-lg border border-indigo-200 text-[10px] font-semibold hover:bg-indigo-100 transition-colors"
            >
              + Acord Acceptat
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs shrink-0">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Totes ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('job_match')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'job_match' ? 'bg-sky-700 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Feines
          </button>
          <button
            type="button"
            onClick={() => setFilterType('chat_message')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'chat_message' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Xat
          </button>
          <button
            type="button"
            onClick={() => setFilterType('transaction_completed')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filterType === 'transaction_completed' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pagaments
          </button>
        </div>

        {/* List of notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>{t.noNotifications}</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  onSelectNotification(notif);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                  notif.read
                    ? 'bg-white border-slate-200/90 hover:border-sky-300'
                    : 'bg-sky-50/50 border-sky-300 shadow-xs'
                }`}
              >
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-sky-600 absolute top-3.5 right-3.5" />
                )}

                <div className="flex items-start gap-2.5">
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${getBadgeColor(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                        {notif.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-100">
                      <span>{notif.timestamp}</span>
                      <span className="text-sky-600 font-semibold group-hover:underline flex items-center gap-0.5">
                        <span>Veure detall</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// In-App Toast Banner Component
export const ToastBanner: React.FC<{
  notification: AppNotification | null;
  onClose: () => void;
  onAction: (notif: AppNotification) => void;
}> = ({ notification, onClose, onAction }) => {
  if (!notification) return null;

  return (
    <div className="fixed top-18 right-4 z-50 max-w-sm w-full bg-slate-950 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 animate-slide-down flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
            Notificació Push
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-xs font-bold text-white mt-0.5">{notification.title}</div>
        <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notification.message}</p>
        <button
          onClick={() => {
            onAction(notification);
            onClose();
          }}
          className="mt-2 text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
        >
          <span>Obrir ara</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
