import React, { useState } from 'react';
import { User, Briefcase, MapPin, MessageSquare, Lock, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Language, translations } from '../i18n';
import { Role } from '../types';

interface HowItWorksSectionProps {
  language: Language;
  onSelectRole: (role: Role) => void;
  onOpenCreateTask: () => void;
  onOpenAvailability: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  language,
  onSelectRole,
  onOpenCreateTask,
  onOpenAvailability
}) => {
  const [activePathway, setActivePathway] = useState<'client' | 'provider'>('client');
  const isCa = language === 'ca';

  const clientSteps = [
    {
      step: '01',
      title: isCa ? 'Publica o cerca la teva feina a Mallorca' : 'Publica o busca tu tarea en Mallorca',
      description: isCa
        ? 'Indica el teu municipi (Palma, Calvià, Inca, Sóller...), descriu què necessites i fixa la ubicació exacta al mapa interactiu.'
        : 'Indica tu municipio (Palma, Calvià, Inca, Sóller...), describe qué necesitas y fija la ubicación exacta en el mapa interactivo.',
      icon: <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      tag: isCa ? 'Geolocalització' : 'Geolocalización'
    },
    {
      step: '02',
      title: isCa ? 'Negocia el preu directament al xat privat' : 'Negocia el precio directamente en el chat privado',
      description: isCa
        ? 'Parla amb els professionals interessats, demana pressupost i pactau lliurement el preu tancat segons el treball a realitzar.'
        : 'Habla con los profesionales interesados, pide presupuesto y pactad libremente el precio cerrado según el trabajo a realizar.',
      icon: <MessageSquare className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
      tag: isCa ? 'Acord directe' : 'Acuerdo directo'
    },
    {
      step: '03',
      title: isCa ? 'Dipòsit en custòdia segura (Escrow)' : 'Depósito en custodia segura (Escrow)',
      description: isCa
        ? 'Paga amb Bizum o targeta bancària. Els teus doblers queden protegits per FEINA X FEINA i el prestador NO els cobra fins al final.'
        : 'Paga con Bizum o tarjeta bancaria. Tu dinero queda protegido por FEINA X FEINA y el prestador NO lo cobra hasta el final.',
      icon: <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tag: isCa ? 'Protecció 100%' : 'Protección 100%'
    },
    {
      step: '04',
      title: isCa ? 'Confirma feina acabada i valora' : 'Confirma trabajo terminado y valora',
      description: isCa
        ? 'Un cop revisada la feina a la teva satisfacció, prem "Confirmar feina acabada", s\'alliberen els fons al prestador i deixes la teva valoració.'
        : 'Una vez revisado el trabajo a tu satisfacción, pulsa "Confirmar trabajo terminado", se liberan los fondos al prestador y dejas tu valoración.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tag: isCa ? 'Satisfacció' : 'Satisfacción'
    }
  ];

  const providerSteps = [
    {
      step: '01',
      title: isCa ? 'Professional o Particular: registra habilitats' : 'Profesional o Particular: registra habilidades',
      description: isCa
        ? 'Obert a autònoms/empreses i també a particulars (cura de persones, repàs, bricolatge...). Indica habilitats, oficis i municipis de Mallorca que cobreixes.'
        : 'Abierto a autónomos/empresas y también a particulares (cuidados, clases, bricolaje...). Indica habilidades, oficios y municipios de Mallorca que cubres.',
      icon: <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tag: isCa ? 'Pro o Particular' : 'Pro o Particular'
    },
    {
      step: '02',
      title: isCa ? 'Defineix serveis i activa disponibilitat' : 'Define servicios y activa disponibilidad',
      description: isCa
        ? 'Posa tarifes orientatives (per hora o feina tancada) i activa l\'interruptor "Disponible avui" per rebre avisos immediats a la teva zona.'
        : 'Pon tarifas orientativas (por hora o trabajo cerrado) y activa el interruptor "Disponible hoy" para recibir avisos inmediatos en tu zona.',
      icon: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tag: isCa ? 'Agenda oberta' : 'Agenda abierta'
    },
    {
      step: '03',
      title: isCa ? 'Proposa preu al xat i assegura el cobrament' : 'Propón precio en el chat y asegura el cobro',
      description: isCa
        ? 'Envia ofertes als clients pel xat. En acceptar-la, el client ingressa el pagament en custòdia garantida abans de que moguis un dit.'
        : 'Envía ofertas a clientes por el chat. Al aceptarla, el cliente ingresa el pago en custodia garantizada antes de que empieces a trabajar.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tag: isCa ? 'Cobrament garantit' : 'Cobro garantizado'
    },
    {
      step: '04',
      title: isCa ? 'Fes la feina i cobra el teu import net' : 'Realiza el trabajo y cobra tu importe neto',
      description: isCa
        ? 'En acabar, el client allibera els fons al teu saldo disponible. Comissió per trams: 2 € (<30 €), 3 € (31-50 €), 5% (51-100 €) i 10% (>100 €) només sobre feines concloses.'
        : 'Al terminar, el cliente libera los fondos a tu saldo disponible. Comisión por tramos: 2 € (<30 €), 3 € (31-50 €), 5% (51-100 €) y 10% (>100 €) solo sobre trabajos concluidos.',
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-400" />,
      tag: isCa ? 'Comissió per trams' : 'Comisión por tramos'
    }
  ];

  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm mb-8 transition-colors duration-200">
      {/* Title & Pathway Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
            {isCa ? 'Guia Ràpida pas a pas' : 'Guía Rápida paso a paso'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            {isCa ? 'Com funciona FEINA X FEINA?' : '¿Cómo funciona FEINA X FEINA?'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {isCa
              ? 'Transparència total: negociació directa entre les parts, pagaments protegits en custòdia i comissió progressiva (des de 2 € o 5%-10%) només si la feina es completa amb èxit.'
              : 'Transparencia total: negociación directa entre ambas partes, pagos protegidos en custodia y comisión progresiva (desde 2 € o 5%-10%) solo si el trabajo se completa con éxito.'}
          </p>
        </div>

        {/* Tab Switcher: Client vs Prestador */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActivePathway('client')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activePathway === 'client'
                ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{isCa ? 'Vull contractar un servei' : 'Quiero contratar un servicio'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePathway('provider')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activePathway === 'provider'
                ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>{isCa ? 'Vull oferir els meus serveis' : 'Quiero ofrecer mis servicios'}</span>
          </button>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(activePathway === 'client' ? clientSteps : providerSteps).map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between group hover:border-sky-300 dark:hover:border-sky-600 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-black font-mono text-slate-300 dark:text-slate-600 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {item.step}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {item.tag}
                </span>
              </div>

              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-2xs mb-3">
                {item.icon}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug font-display">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-sky-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 dark:bg-sky-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {isCa
                ? 'Garantia FEINA X FEINA per a totes les transaccions a Mallorca'
                : 'Garantía FEINA X FEINA para todas las transacciones en Mallorca'}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isCa
                ? 'Sense quotes mensuals ni comissions per avançat. Comissió per trams (2 € per <30 €, 3 € per 31-50 €, 5% per 51-100 € i 10% per >100 €) exclusivament per feines cobrades i satisfactòries.'
                : 'Sin cuotas mensuales ni comisiones por adelantado. Comisión por tramos (2 € para <30 €, 3 € para 31-50 €, 5% para 51-100 € y 10% para >100 €) exclusivamente por trabajos cobrados y satisfactorios.'}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {activePathway === 'client' ? (
            <button
              onClick={() => {
                onSelectRole('client');
                onOpenCreateTask();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isCa ? 'Publicar la meva primera feina' : 'Publicar mi primera solicitud'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                onSelectRole('provider');
                onOpenAvailability();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>{isCa ? 'Configurar la meva agenda i ofertes' : 'Configurar mi agenda y ofertas'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
