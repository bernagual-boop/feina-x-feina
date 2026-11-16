import React from 'react';
import { UserProfile, ServiceTask } from '../types';
import { BarChart3, TrendingUp, Clock, Euro, CheckCircle2, MessageSquare, Briefcase, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../i18n';

interface ClientActivityChartsProps {
  client: UserProfile;
  tasks?: ServiceTask[];
  language: Language;
}

export const ClientActivityCharts: React.FC<ClientActivityChartsProps> = ({
  client,
  tasks = [],
  language
}) => {
  const isCa = language === 'ca';

  // Calculate client metrics from past history + current tasks
  const pastJobs = client.clientPastHistory || [];
  const clientTasks = tasks.filter((t) => t.clientId === client.id || t.clientName === client.name);
  
  // Total published tasks
  const totalTasksPublished = Math.max(client.completedJobsCount || 0, pastJobs.length + clientTasks.length);
  const completedCount = pastJobs.filter((j) => j.status === 'completed').length + clientTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = clientTasks.filter((t) => t.status === 'in_progress').length;
  const openCount = clientTasks.filter((t) => t.status === 'open' || t.status === 'negotiating').length;

  // Total expenditure in services
  const pastExpenditure = pastJobs.reduce((sum, j) => sum + (j.amount || 0), 0);
  const currentExpenditure = clientTasks
    .filter((t) => t.paymentStatus === 'held_in_escrow' || t.paymentStatus === 'released_to_provider')
    .reduce((sum, t) => sum + (t.agreedPrice || t.estimatedBudget || 0), 0);
  const totalSpent = pastExpenditure + currentExpenditure || 810.0;

  // Average response rate of providers for this client
  const providerResponseRate = 96; // 96% response rate
  const averageResponseTimeMinutes = 24; // 24 minutes

  // Monthly expenditure breakdown for chart
  const monthlySpending = [
    { month: isCa ? 'Nov' : 'Nov', amount: 140, label: 'Fontaneria' },
    { month: isCa ? 'Des' : 'Dic', amount: 90, label: 'Bricolatge' },
    { month: isCa ? 'Gen' : 'Ene', amount: 220, label: 'Electricitat' },
    { month: isCa ? 'Feb' : 'Feb', amount: 160, label: 'Neteja' },
    { month: isCa ? 'Mar' : 'Mar', amount: 380, label: 'Jardineria' },
    { month: isCa ? 'Abr' : 'Abr', amount: 290, label: 'Wallbox' }
  ];

  const maxMonthSpend = Math.max(...monthlySpending.map((m) => m.amount), 400);

  // Category distribution
  const categoriesBreakdown = [
    { name: isCa ? 'Electricitat' : 'Electricidad', percent: 35, color: 'bg-sky-500', amount: 290 },
    { name: isCa ? 'Jardineria' : 'Jardinería', percent: 30, color: 'bg-emerald-500', amount: 380 },
    { name: isCa ? 'Fontaneria' : 'Fontanería', percent: 20, color: 'bg-teal-500', amount: 140 },
    { name: isCa ? 'Altres serveis' : 'Otros servicios', percent: 15, color: 'bg-amber-500', amount: 90 }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Tasks Published */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isCa ? 'Feines Publicades' : 'Tareas Publicadas'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {totalTasksPublished}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{completedCount} {isCa ? 'finalitzades' : 'finalizadas'}</span>
            </div>
          </div>
        </div>

        {/* Total Expenditure */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isCa ? 'Despesa Total' : 'Gasto Total'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <Euro className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {totalSpent.toFixed(0)} €
            </div>
            <div className="text-[10px] text-teal-700 dark:text-teal-300 flex items-center gap-0.5 mt-0.5 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>100% {isCa ? 'en custòdia' : 'en custodia'}</span>
            </div>
          </div>
        </div>

        {/* Provider Response Rate */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isCa ? 'Taxa de Resposta' : 'Tasa de Respuesta'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {providerResponseRate}%
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {isCa ? 'Prestadors a Mallorca' : 'Prestadores en Mallorca'}
            </div>
          </div>
        </div>

        {/* Average Response Time */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {isCa ? 'Temps de Resposta' : 'Tiempo Respuesta'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {averageResponseTimeMinutes} <span className="text-xs font-normal">min</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{isCa ? 'Molt ràpid' : 'Muy rápido'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid: Monthly Spending Bar Chart + Circular Response Rate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Monthly Expenditure Chart (7 cols) */}
        <div className="md:col-span-7 p-4 sm:p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{isCa ? 'Historial de Despesa en Serveis (€)' : 'Historial de Gasto en Servicios (€)'}</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Darrers 6 mesos</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
              {isCa
                ? 'Evolució mensual dels imports dipositats en custòdia a Mallorca'
                : 'Evolución mensual de los importes depositados en custodia en Mallorca'}
            </p>
          </div>

          {/* SVG Bar Chart with values */}
          <div className="pt-2">
            <div className="flex items-end justify-between gap-2 h-36 border-b border-slate-100 dark:border-slate-700 pb-2">
              {monthlySpending.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.amount / maxMonthSpend) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.amount}€
                    </span>
                    <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-28 flex items-end p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-sky-600 to-teal-400 rounded-t-md transition-all duration-500 group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
              <span>0 €</span>
              <span className="font-semibold text-sky-700 dark:text-sky-400">
                {isCa ? 'Mitjana mensual: ~180 €' : 'Media mensual: ~180 €'}
              </span>
              <span>{maxMonthSpend} €</span>
            </div>
          </div>
        </div>

        {/* Response Rate & Category Distribution (5 cols) */}
        <div className="md:col-span-5 p-4 sm:p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-display">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{isCa ? 'Efectivitat i Categories' : 'Efectividad y Categorías'}</span>
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              {isCa
                ? 'Distribució de feines contractades per especialitat'
                : 'Distribución de trabajos contratados por especialidad'}
            </p>
          </div>

          {/* Categories Progress Bars */}
          <div className="space-y-2.5">
            {categoriesBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{cat.amount} € ({cat.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percent}%` }}
                    className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Provider response rate summary box */}
          <div className="mt-4 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/60 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">
              96%
            </div>
            <div className="text-[11px] leading-tight">
              <strong>{isCa ? 'Interès alt dels prestadors:' : 'Alto interés de prestadores:'}</strong>{' '}
              {isCa
                ? 'Reps una mitjana de 3.2 propostes per cada sol·licitud publicada.'
                : 'Recibes una media de 3.2 propuestas por cada solicitud publicada.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
