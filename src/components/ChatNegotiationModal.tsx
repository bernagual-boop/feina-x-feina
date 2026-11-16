import React, { useState, useEffect, useRef } from 'react';
import { Conversation, ChatMessage, UserProfile, Role, ServiceTask } from '../types';
import { calculatePlatformCommission } from '../data/mallorcaData';
import { X, Send, DollarSign, ShieldCheck, CheckCircle2, Lock, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatNegotiationModalProps {
  conversation: Conversation;
  task: ServiceTask;
  currentUser: UserProfile;
  currentRole: Role;
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onSendPriceProposal: (amount: number, notes?: string) => void;
  onAcceptProposal: (amount: number) => void;
  onOpenPaymentEscrow: (task: ServiceTask, agreedAmount: number) => void;
  onCompleteJobAndReleaseFunds: (task: ServiceTask) => void;
}

export const ChatNegotiationModal: React.FC<ChatNegotiationModalProps> = ({
  conversation,
  task,
  currentUser,
  currentRole,
  messages,
  onClose,
  onSendMessage,
  onSendPriceProposal,
  onAcceptProposal,
  onOpenPaymentEscrow,
  onCompleteJobAndReleaseFunds
}) => {
  const [inputText, setInputText] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalAmount, setProposalAmount] = useState<number>(task.agreedPrice || task.estimatedBudget || 100);
  const [proposalNotes, setProposalNotes] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const counterpartyName = currentRole === 'client' ? conversation.providerName : conversation.clientName;
  const counterpartyAvatar = currentRole === 'client' ? conversation.providerAvatar : conversation.clientAvatar;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showProposalForm]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proposalAmount <= 0) return;
    onSendPriceProposal(proposalAmount, proposalNotes);
    setShowProposalForm(false);
    setProposalNotes('');
  };

  const { fee: commission, net: netEarnings, rateLabel, tierDescription } = calculatePlatformCommission(proposalAmount, 'ca');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl h-[92vh] max-h-[780px] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={counterpartyAvatar}
              alt={counterpartyName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-400 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white truncate font-display">{counterpartyName}</h3>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {currentRole === 'client' ? 'Prestador' : 'Client'}
                </span>
              </div>
              <p className="text-xs text-sky-200 truncate">{task.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Negotiation & Escrow Status Ribbon */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 px-4 py-2.5 shrink-0 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="text-slate-500 dark:text-slate-400">Municipi:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{task.municipality}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">Pressupost:</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{task.estimatedBudget} €</span>
          </div>

          <div className="flex items-center gap-2">
            {task.paymentStatus === 'unpaid' && (
              <span className="bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-md font-medium text-[11px] flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Negociant preu
              </span>
            )}
            {task.paymentStatus === 'held_in_escrow' && (
              <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                En custòdia ({task.agreedPrice} €)
              </span>
            )}
            {task.paymentStatus === 'released_to_provider' && (
              <span className="bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 px-2.5 py-0.5 rounded-md font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                Completat i pagat
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Ribbon for Negotiations */}
        <div className="bg-sky-50/70 dark:bg-sky-950/50 border-b border-sky-100 dark:border-sky-900 px-4 py-2 shrink-0 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-sky-950 dark:text-sky-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0" />
            <span>Negocia el preu lliurement. Comissió per trams (des de 2 € o 5%-10%) només per feina finalitzada.</span>
          </div>

          {task.paymentStatus === 'unpaid' && (
            <button
              onClick={() => setShowProposalForm(!showProposalForm)}
              className="px-3 py-1 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shadow-xs"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{showProposalForm ? 'Tancar oferta' : 'Proposar preu tancat'}</span>
            </button>
          )}

          {task.agreedPrice && task.paymentStatus === 'unpaid' && currentRole === 'client' && (
            <button
              onClick={() => onOpenPaymentEscrow(task, task.agreedPrice!)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shadow-xs animate-pulse"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Dipositar {task.agreedPrice} € en Custòdia</span>
            </button>
          )}

          {task.paymentStatus === 'held_in_escrow' && currentRole === 'client' && (
            <button
              onClick={() => onCompleteJobAndReleaseFunds(task)}
              className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirmar feina acabada i alliberar fons</span>
            </button>
          )}
        </div>

        {/* Price Proposal Form Popover */}
        {showProposalForm && (
          <div className="p-4 bg-white dark:bg-slate-850 border-b border-sky-200 dark:border-slate-700 animate-slide-down shrink-0">
            <form onSubmit={handleProposalSubmit} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Proposar Acord Econòmic Tancat
                </h4>
                <button
                  type="button"
                  onClick={() => setShowProposalForm(false)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel·lar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preu total acordat (€)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      step="5"
                      value={proposalAmount}
                      onChange={(e) => setProposalAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 pl-7 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-400 font-bold">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detall del que inclou
                  </label>
                  <input
                    type="text"
                    value={proposalNotes}
                    onChange={(e) => setProposalNotes(e.target.value)}
                    placeholder="Ex. Desplaçament a Calvià, tub ignífug i butlletí..."
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Commission Breakdown preview */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  <span>Desglossament transparent</span>
                  <span className="text-teal-700 dark:text-teal-300 font-bold">{tierDescription}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Preu acordat:</span>
                  <span className="font-mono font-semibold">{proposalAmount.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1">
                  <span>Comissió FEINA X FEINA ({rateLabel}):</span>
                  <span className="font-mono font-semibold text-teal-700 dark:text-teal-400">-{commission.toFixed(2)} €</span>
                </div>
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Cobrament net prestador:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">{netEarnings.toFixed(2)} €</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
              >
                Enviar Proposta Formal de {proposalAmount} €
              </button>
            </form>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/70">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            if (msg.type === 'system') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 py-1 rounded-full font-medium max-w-md text-center">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.type === 'price_proposal' && msg.proposal) {
              const prop = msg.proposal;
              const isProposedByMe = (prop.proposedBy === currentRole);
              const { fee: comm, net, rateLabel: msgRate, tierDescription: msgTier } = calculatePlatformCommission(prop.amount, 'ca');

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-md w-full bg-white dark:bg-slate-850 rounded-2xl p-4 shadow-sm border-2 border-sky-300 dark:border-sky-600">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Proposta d'Acord Tancat</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">{msg.text}</p>

                    {prop.notes && (
                      <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mb-3">
                        "{prop.notes}"
                      </p>
                    )}

                    <div className="bg-sky-50/70 dark:bg-sky-950/60 p-3 rounded-xl border border-sky-100 dark:border-sky-900 mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                        <span>Import fixat:</span>
                        <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{prop.amount.toFixed(2)} €</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>Comissió plataforma ({msgRate}):</span>
                        <span className="font-mono text-teal-700 dark:text-teal-400">-{comm.toFixed(2)} €</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300 pt-1 border-t border-sky-200 dark:border-sky-800">
                        <span>Cobrament net prestador:</span>
                        <span className="font-mono">{net.toFixed(2)} €</span>
                      </div>
                    </div>

                    {/* Action buttons on proposal */}
                    {!isProposedByMe && task.paymentStatus === 'unpaid' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAcceptProposal(prop.amount)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Acceptar Acord ({prop.amount} €)</span>
                        </button>
                        <button
                          onClick={() => {
                            setProposalAmount(prop.amount);
                            setShowProposalForm(true);
                          }}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          Contraofertar
                        </button>
                      </div>
                    )}

                    {isProposedByMe && (
                      <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 py-1.5 rounded-lg">
                        Esperant resposta de {counterpartyName}...
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (msg.type === 'escrow_paid') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs px-4 py-2.5 rounded-2xl shadow-xs max-w-md text-center">
                    <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                      <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Pagament en Dipòsit Segur Realitzat</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">{msg.text}</p>
                  </div>
                </div>
              );
            }

            if (msg.type === 'job_completed') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-200 text-xs px-4 py-2.5 rounded-2xl shadow-xs max-w-md text-center">
                    <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Servei Finalitzat i Fons Alliberats</span>
                    </div>
                    <p className="text-[11px] text-sky-800 dark:text-sky-300">{msg.text}</p>
                  </div>
                </div>
              );
            }

            // Normal text message
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                    isMe
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1 text-right font-mono ${
                      isMe ? 'text-sky-200' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escriu un missatge a ${counterpartyName}...`}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
