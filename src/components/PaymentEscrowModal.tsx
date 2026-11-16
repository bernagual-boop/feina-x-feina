import React, { useState } from 'react';
import { ServiceTask } from '../types';
import { calculatePlatformCommission } from '../data/mallorcaData';
import { X, Lock, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentEscrowModalProps {
  task: ServiceTask;
  agreedPrice: number;
  onClose: () => void;
  onConfirmPayment: (method: 'bizum' | 'tarjeta' | 'apple_pay') => void;
}

export const PaymentEscrowModal: React.FC<PaymentEscrowModalProps> = ({
  task,
  agreedPrice,
  onClose,
  onConfirmPayment
}) => {
  const [method, setMethod] = useState<'bizum' | 'tarjeta' | 'apple_pay'>('bizum');
  const [bizumPhone, setBizumPhone] = useState('670 123 456');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('492');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { fee: platformFee, net: providerNet, rateLabel, tierDescription } = calculatePlatformCommission(agreedPrice, 'ca');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        onConfirmPayment(method);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-display">Pagament Protegit en Custòdia (Escrow)</h3>
              <p className="text-xs text-sky-200">Garantia FEINA X FEINA per a {task.municipality}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">¡Dipòsit en Custòdia Confirmat!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Els <strong>{agreedPrice.toFixed(2)} €</strong> han quedat retinguts en garantia segura. El professional <strong>{task.acceptedProviderName}</strong> ja pot començar la feina.
            </p>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 max-w-xs mx-auto">
              Només s'alliberaran els fons un cop confirmis que el treball està acabat i al teu gust.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Task summary */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">
                Feina contractada
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{task.title}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">Prestador assignat: {task.acceptedProviderName}</div>
            </div>

            {/* Financial breakdown */}
            <div className="bg-sky-50/60 dark:bg-sky-950/60 p-4 rounded-2xl border border-sky-100 dark:border-sky-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>Preu acordat entre ambdues parts:</span>
                <span className="font-mono font-bold">{agreedPrice.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span>Comissió plataforma ({rateLabel}):</span>
                  <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">{tierDescription}</span>
                </span>
                <span className="font-mono font-semibold text-teal-800 dark:text-teal-300">-{platformFee.toFixed(2)} €</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Cobrament net que rebrà el professional:</span>
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">{providerNet.toFixed(2)} €</span>
              </div>
              <div className="pt-2 border-t border-sky-200 dark:border-sky-800 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                <span className="text-sm">Total retingut en custòdia:</span>
                <span className="text-lg font-mono text-slate-900 dark:text-white">{agreedPrice.toFixed(2)} €</span>
              </div>
            </div>

            {/* Payment method selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Selecciona mètode de pagament
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('bizum')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    method === 'bizum'
                      ? 'border-sky-600 dark:border-sky-400 bg-sky-50/50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 ring-2 ring-sky-300 dark:ring-sky-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-bold">Bizum</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('tarjeta')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    method === 'tarjeta'
                      ? 'border-sky-600 dark:border-sky-400 bg-sky-50/50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 ring-2 ring-sky-300 dark:ring-sky-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  <span className="text-xs font-bold">Targeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('apple_pay')}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    method === 'apple_pay'
                      ? 'border-sky-600 dark:border-sky-400 bg-sky-50/50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 ring-2 ring-sky-300 dark:ring-sky-600'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg font-black leading-none">Pay</span>
                  <span className="text-xs font-bold">Apple / GPay</span>
                </button>
              </div>
            </div>

            {/* Method specific inputs */}
            {method === 'bizum' && (
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Número de telèfon mòbil Bizum
                </label>
                <input
                  type="tel"
                  value={bizumPhone}
                  onChange={(e) => setBizumPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  placeholder="600 000 000"
                  required
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Rebràs una sol·licitud instantània a l'App del teu banc (CaixaBank, BBVA, Santander, Sabadell...).
                </p>
              </div>
            )}

            {method === 'tarjeta' && (
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Número de targeta</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Caducitat</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'apple_pay' && (
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                S'utilitzarà la targeta predeterminada vinculada al teu Wallet d'iOS o dispositiu Android.
              </div>
            )}

            {/* Escrow guarantee note */}
            <div className="flex items-start gap-2 p-3 bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-950 dark:text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Garantia 100% FEINA X FEINA:</strong> Els doblers es mantenen protegits en custòdia. El prestador no cobrarà fins que verifiquis i aprovis la feina completada.
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processant pagament protegit...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Confirmar Dipòsit Segur de {agreedPrice.toFixed(2)} €</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
