import React, { useState } from 'react';
import { UserProfile, ServiceTask } from '../types';
import { calculatePlatformCommission, COMMISSION_TIERS } from '../data/mallorcaData';
import { X, DollarSign, ArrowUpRight, ShieldCheck, CheckCircle2, Building, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EarningsDrawerProps {
  currentUser: UserProfile;
  completedTasks: ServiceTask[];
  onClose: () => void;
  onWithdraw: (amount: number) => void;
}

export const EarningsDrawer: React.FC<EarningsDrawerProps> = ({
  currentUser,
  completedTasks,
  onClose,
  onWithdraw
}) => {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [iban, setIban] = useState('ES89 2100 1234 5678 9012 3456');
  const [successMsg, setSuccessMsg] = useState(false);

  const balance = currentUser.earningsBalance ?? 340.0;
  const totalHistorical = currentUser.totalEarned ?? 4890.0;

  const handleWithdrawClick = () => {
    if (balance <= 0) return;
    setIsWithdrawing(true);

    setTimeout(() => {
      setIsWithdrawing(false);
      setSuccessMsg(true);
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      onWithdraw(balance);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-left transition-colors duration-200">
        
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2 font-display">
              <DollarSign className="w-5 h-5 text-teal-400" />
              <span>Billetera i Ingressos Nets</span>
            </h3>
            <p className="text-xs text-teal-200">Panell financer del prestador a Mallorca</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Balance Card */}
          <div className="p-5 bg-gradient-to-br from-teal-800 to-emerald-900 text-white rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs font-medium text-teal-200 uppercase tracking-wider">
                Saldo disponible per a retirar
              </span>
              <div className="text-3xl font-extrabold font-mono mt-1 mb-3">
                {balance.toFixed(2)} €
              </div>

              <div className="text-xs text-teal-100 flex items-center gap-1.5 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Fons alliberats després de la verificació del client</span>
              </div>

              <button
                disabled={balance <= 0 || isWithdrawing}
                onClick={handleWithdrawClick}
                className="w-full py-2.5 bg-white text-teal-900 rounded-xl font-bold text-xs hover:bg-teal-50 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isWithdrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transferint a compte bancari...</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Transferir saldo al meu banc</span>
                  </>
                )}
              </button>

              {successMsg && (
                <div className="mt-3 p-2 bg-emerald-700/80 rounded-xl text-center text-xs font-semibold">
                  Transferència sol·licitada amb èxit! Arribarà en 24h al teu compte.
                </div>
              )}
            </div>
          </div>

          {/* Business Model Explanation with Tiers */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                <Layers className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>Comissió per Trams FEINA X FEINA</span>
              </h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                Sense quotes fixes
              </span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              La comissió s'aplica exclusivament quan la feina s'ha cobrat amb èxit a través de la custòdia protegida:
            </p>

            {/* Visual Tiers Grid */}
            <div className="grid grid-cols-2 gap-2">
              {COMMISSION_TIERS.map((tier, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{tier.rangeCa}</span>
                    <span className="text-xs font-mono font-extrabold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      {tier.feeLabel}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{tier.typeCa}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-mono text-slate-700 dark:text-slate-300">
              <span>Total històric acumulat:</span>
              <span className="font-bold text-slate-900 dark:text-white">{totalHistorical.toFixed(2)} €</span>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="font-bold text-slate-900 dark:text-white">Compte bancari vinculat per a liquidacions SEPA</div>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-100"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              CaixaBank / Santander Illes Balears. Pagaments per transferència immediata.
            </p>
          </div>

          {/* Transactions / Tasks history */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
              Historial de Transaccions
            </h4>
            <div className="space-y-2">
              {completedTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  Sense transaccions completades encara.
                </div>
              ) : (
                completedTasks.map((t) => {
                  const agreed = t.agreedPrice || t.estimatedBudget;
                  const { fee, net, rateLabel } = calculatePlatformCommission(agreed, 'ca');

                  return (
                    <div
                      key={t.id}
                      className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{t.title}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono text-sm">+{net.toFixed(2)} €</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{t.municipality} · Client: {t.clientName}</span>
                        <span className="text-teal-700 dark:text-teal-400 font-mono">Comissió ({rateLabel}): -{fee.toFixed(2)} €</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
