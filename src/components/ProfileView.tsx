import React from 'react';
import { UserProfile, Role, ServiceTask, Review } from '../types';
import { DEMO_CLIENT, DEMO_PROVIDER, SEED_PROVIDERS } from '../data/mallorcaData';
import { User, Star, MapPin, Briefcase, DollarSign, ShieldCheck, CheckCircle2, Wrench, Award, FileText, ArrowRight, UserCheck, BarChart3 } from 'lucide-react';
import { Language, translations } from '../i18n';
import { ClientActivityCharts } from './ClientActivityCharts';

interface ProfileViewProps {
  currentUser: UserProfile;
  currentRole: Role;
  onSwitchUser: (user: UserProfile) => void;
  onOpenAvailability: () => void;
  onOpenEarnings: () => void;
  onOpenClientProfile: (client: UserProfile) => void;
  onOpenProviderProfile: (provider: UserProfile) => void;
  tasks: ServiceTask[];
  reviews: Review[];
  language: Language;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  currentRole,
  onSwitchUser,
  onOpenAvailability,
  onOpenEarnings,
  onOpenClientProfile,
  onOpenProviderProfile,
  tasks,
  reviews,
  language
}) => {
  const t = translations[language];
  const providerReviews = reviews.filter((r) => r.providerId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Demo Profile Quick Switcher */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            {language === 'ca' ? 'Demostració de Perfils Reals a Mallorca' : 'Demostración de Perfiles Reales en Mallorca'}
          </span>
          <p className="text-xs text-slate-500">
            {language === 'ca'
              ? 'Canvia de perfil per experimentar l\'App com a Client o com a Prestador Professional.'
              : 'Cambia de perfil para experimentar la App como Cliente o como Prestador Profesional.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchUser(DEMO_CLIENT)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentUser.id === DEMO_CLIENT.id
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            👤 Antoni (Client Palma)
          </button>
          <button
            onClick={() => onSwitchUser(DEMO_PROVIDER)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentUser.id === DEMO_PROVIDER.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🛠️ Marc (Pro Palma)
          </button>
          {SEED_PROVIDERS[4] && (
            <button
              onClick={() => onSwitchUser(SEED_PROVIDERS[4])}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentUser.id === SEED_PROVIDERS[4].id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🌱 Laura (Particular)
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  {currentUser.isVerified && (
                    <span className="p-0.5 bg-emerald-500 text-white rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
                    {currentRole === 'client' ? t.roleClient : t.roleProvider}
                  </span>
                  {currentUser.role === 'provider' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
                      {currentUser.providerType === 'particular' ? (
                        <>
                          <UserCheck className="w-3 h-3 text-emerald-300" />
                          <span>Particular</span>
                        </>
                      ) : (
                        <>
                          <Briefcase className="w-3 h-3 text-sky-300" />
                          <span>Professional</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-sky-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{currentUser.municipality} · Membre des de {currentUser.memberSince}</span>
                </div>
                <div className="flex items-center gap-3 text-xs mt-2">
                  <div className="flex items-center text-amber-400 font-bold bg-white/10 px-2.5 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                    <span>{currentUser.rating.toFixed(1)}</span>
                    <span className="text-white/70 font-normal ml-1">({currentUser.reviewCount} ressenyes)</span>
                  </div>
                  <span className="text-teal-200 font-medium">
                    {currentUser.completedJobsCount} feines gestionades
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {currentRole === 'provider' ? (
                <>
                  <button
                    onClick={onOpenAvailability}
                    className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{t.btnAvailability}</span>
                  </button>
                  <button
                    onClick={onOpenEarnings}
                    className="px-3.5 py-2 bg-white text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>{t.btnEarnings} ({currentUser.earningsBalance?.toFixed(2)} €)</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onOpenClientProfile(currentUser)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Veure Fitxa Completa de Client</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Presentació
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {currentUser.bio}
            </p>
          </div>

          {/* If CLIENT: Activity Charts + Past Job History & Ratings received */}
          {currentRole === 'client' && (
            <div className="space-y-6">
              {/* Activity Charts */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-display">
                  <BarChart3 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>{language === 'ca' ? 'Gràfics d\'Activitat & Despeses' : 'Gráficos de Actividad & Gastos'}</span>
                </h3>
                <ClientActivityCharts client={currentUser} tasks={tasks} language={language} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>{t.clientHistoryTitle} ({currentUser.clientPastHistory?.length || 0})</span>
                  </h3>
                  <button
                    onClick={() => onOpenClientProfile(currentUser)}
                    className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Veure tot el detall</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {currentUser.clientPastHistory?.map((job) => (
                    <div
                      key={job.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{job.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {job.municipality} · {job.category} · Prestador: <strong>{job.providerName}</strong>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-900 block">{job.amount} €</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {job.status === 'completed' ? 'Finalitzada' : 'En curs'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings received as client */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{t.clientReviewsReceivedTitle} ({currentUser.clientReviewsReceived?.length || 0})</span>
                </h3>
                <div className="space-y-2">
                  {currentUser.clientReviewsReceived?.map((rev) => (
                    <div key={rev.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{rev.clientName}</span>
                        <div className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-1" />
                          <span>{rev.rating} / 5</span>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-2">"{rev.comment}"</p>
                      {rev.tags && (
                        <div className="flex flex-wrap gap-1">
                          {rev.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* If PROVIDER: Skills, Services & Availability */}
          {currentRole === 'provider' && (
            <div className="space-y-6">
              {/* Skills */}
              {currentUser.skills && (
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-teal-600" />
                    <span>{t.skillsTitle}</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl text-xs font-medium">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* License & Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 space-y-1">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-700" />
                    <span>{t.licenseTitle}</span>
                  </span>
                  <div className="font-mono text-slate-800 font-bold pt-1">{currentUser.licenseNumber}</div>
                  <p className="text-[11px] text-teal-800">
                    Instal·lador autoritzat certificat a les Illes Balears.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-teal-600" />
                    <span>{t.experienceTitle}</span>
                  </span>
                  <div className="font-bold text-slate-800 pt-1">{currentUser.experienceYears} anys d'experiència</div>
                  <p className="text-[11px] text-slate-600">
                    {currentUser.completedJobsCount} treballs amb garantia a Mallorca.
                  </p>
                </div>
              </div>

              {/* Public Profile Preview button */}
              <button
                onClick={() => onOpenProviderProfile(currentUser)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <span>Veure com veuen els clients el meu perfil complet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Guarantee transparency banner */}
          <div className="p-5 bg-gradient-to-r from-sky-50 to-teal-50 rounded-3xl border border-sky-200 text-xs text-slate-800 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-sky-950">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Garantia FEINA X FEINA: Transaccions Protegides a Mallorca</span>
            </h4>
            <ul className="space-y-1 text-slate-600 text-[11px] list-disc pl-4">
              <li>El preu final es pacta lliurement entre ambdues parts al xat privat segons les necessitats reals.</li>
              <li>El client diposita l'import acordat en custòdia segura (escrow amb Bizum o Targeta bancària).</li>
              <li>El professional cobra el seu import net quan el client confirma que la feina s'ha finalitzat amb èxit.</li>
              <li>FEINA X FEINA aplica una comissió per trams (2 € per &lt;30 €, 3 € per 31-50 €, 5% per 51-100 € i 10% per &gt;100 €) exclusivament sobre transaccions concloses satisfactòriament.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
