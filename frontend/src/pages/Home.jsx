import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useScrollAnimation from '../hooks/useScrollAnimation'

/* ── Scroll fade wrapper ─────────────────────────────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useScrollAnimation(0.1)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[24px]'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Football pitch SVG ──────────────────────────────────────── */
const FootballPitch = ({ className = '' }) => (
  <svg viewBox="0 0 480 320" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#15803d"/>
        <stop offset="100%" stopColor="#166534"/>
      </linearGradient>
      <linearGradient id="stripeA" x1="0" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#16a34a" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#15803d" stopOpacity="0.15"/>
      </linearGradient>
    </defs>

    {/* Background */}
    <rect width="480" height="320" fill="url(#grass)" rx="16"/>

    {/* Grass stripes */}
    {[0,1,2,3,4,5,6,7].map(i => (
      <rect key={i} x={i*60} y="0" width="60" height="320"
        fill={i%2===0 ? "url(#stripeA)" : "transparent"}/>
    ))}

    {/* Pitch boundary */}
    <rect x="24" y="24" width="432" height="272" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none" rx="4"/>

    {/* Center line */}
    <line x1="240" y1="24" x2="240" y2="296" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"/>

    {/* Center circle */}
    <circle cx="240" cy="160" r="52" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none"/>

    {/* Center spot */}
    <circle cx="240" cy="160" r="4" fill="rgba(255,255,255,0.9)"/>

    {/* Left penalty area */}
    <rect x="24" y="92" width="88" height="136" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none"/>
    {/* Left 6-yard box */}
    <rect x="24" y="122" width="36" height="76" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none"/>
    {/* Left penalty spot */}
    <circle cx="86" cy="160" r="3.5" fill="rgba(255,255,255,0.9)"/>

    {/* Right penalty area */}
    <rect x="368" y="92" width="88" height="136" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none"/>
    {/* Right 6-yard box */}
    <rect x="420" y="122" width="36" height="76" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none"/>
    {/* Right penalty spot */}
    <circle cx="394" cy="160" r="3.5" fill="rgba(255,255,255,0.9)"/>

    {/* Corner arcs */}
    <path d="M24 32 Q32 32 32 24"  stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
    <path d="M456 32 Q448 32 448 24" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
    <path d="M24 288 Q32 288 32 296" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>
    <path d="M456 288 Q448 288 448 296" stroke="rgba(255,255,255,0.7)" strokeWidth="2" fill="none"/>

    {/* Ball at center */}
    <circle cx="240" cy="160" r="12" fill="white" opacity="0.95"/>
    <path d="M234 155 L240 150 L246 155 L244 163 L236 163 Z" fill="#1d1d1f" opacity="0.15"/>
  </svg>
)

/* ── Payment card mockup ─────────────────────────────────────── */
const PaymentMockup = () => (
  <div className="w-full h-[320px] relative flex items-center justify-center p-12">
    {/* Background card */}
    <div className="absolute w-[280px] h-[172px] rounded-[20px] bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg top-[30px] right-[40px] rotate-[-4deg]"/>
    {/* Main card */}
    <div className="relative w-[280px] h-[172px] rounded-[20px] overflow-hidden shadow-2xl"
      style={{ background: 'linear-gradient(135deg, #0071e3 0%, #34aadc 100%)' }}>
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 60%)' }}/>
      <div className="p-[22px] h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-[36px] h-[28px] rounded-[6px] bg-yellow-300/90"/>
          <svg className="w-[36px] h-[36px] text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        <div>
          <p className="text-white/80 text-[13px] font-mono tracking-[3px] mb-[14px]">•••• •••• •••• 2026</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Titulaire</p>
              <p className="text-white font-semibold text-[14px]">Ahmed Ali</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Expire</p>
              <p className="text-white font-semibold text-[14px]">12/28</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Transaction badge */}
    <div className="absolute bottom-[24px] left-[28px] bg-white rounded-[14px] shadow-lg px-[16px] py-[10px] flex items-center gap-[10px]">
      <div className="w-[32px] h-[32px] rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-[16px] h-[16px] text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
        </svg>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-[#1d1d1f]">Paiement réussi</p>
        <p className="text-[11px] text-[#86868b]">200 MAD · Terrain El Ahly</p>
      </div>
    </div>
  </div>
)

/* ── Players mockup ──────────────────────────────────────────── */
const PlayersMockup = () => {
  const players = [
    { initials: 'AA', color: 'from-blue-400 to-blue-600' },
    { initials: 'MH', color: 'from-green-400 to-green-600' },
    { initials: 'KA', color: 'from-purple-400 to-purple-600' },
    { initials: 'YB', color: 'from-orange-400 to-orange-600' },
    { initials: '+3', color: 'from-gray-400 to-gray-500' },
  ]
  return (
    <div className="w-full h-[320px] flex flex-col items-center justify-center gap-[24px]">
      {/* Match card */}
      <div className="w-[300px] bg-white rounded-[20px] shadow-xl p-[20px]">
        <div className="flex items-center justify-between mb-[14px]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-[10px] py-[4px] rounded-full">
            Match public
          </span>
          <span className="text-[12px] text-[#86868b]">Dim. 28 Juil.</span>
        </div>
        <h4 className="text-[15px] font-semibold text-[#1d1d1f] mb-[4px]">Terrain El Ahly — 5×5</h4>
        <p className="text-[12px] text-[#86868b] mb-[16px]">18:00 → 19:00 · Casablanca</p>

        {/* Players avatars */}
        <div className="flex items-center gap-[-8px] mb-[16px]">
          {players.map((p, i) => (
            <div key={i}
              className={`w-[36px] h-[36px] rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-[11px] font-bold border-2 border-white`}
              style={{ marginLeft: i > 0 ? '-10px' : '0', zIndex: players.length - i }}>
              {p.initials}
            </div>
          ))}
          <span className="ml-[14px] text-[12px] text-[#86868b]">7/10 joueurs</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[6px] bg-[#f5f5f7] rounded-full overflow-hidden">
          <div className="h-full w-[70%] bg-gradient-to-r from-green-500 to-green-400 rounded-full"/>
        </div>
      </div>

      {/* Join button hint */}
      <div className="flex items-center gap-[8px] text-[13px] text-[#86868b]">
        <div className="w-[8px] h-[8px] rounded-full bg-green-500 animate-pulse"/>
        3 places disponibles
      </div>
    </div>
  )
}

/* ── Feature data ────────────────────────────────────────────── */
const features = [
  {
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
    title: 'Réservation instantanée',
    desc: 'Choisissez votre créneau horaire avec vérification de disponibilité en temps réel.',
  },
  {
    icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
    title: 'Paiement sécurisé',
    desc: 'Commission transparente de 10% avec suivi complet des transactions.',
  },
  {
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    title: 'PDF & QR Code',
    desc: 'Recevez votre feuille de réservation PDF avec un QR code scannable.',
  },
  {
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    title: 'Matchs Publics',
    desc: 'Créez ou rejoignez des matchs et trouvez des partenaires de jeu facilement.',
  },
  {
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    title: 'Dashboard analytique',
    desc: 'Tableaux de bord détaillés pour les présidents et administrateurs.',
  },
  {
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Multi-rôles sécurisé',
    desc: 'Joueur, Président et Administrateur avec permissions adaptées.',
  },
]

const stats = [
  { value: '3', unit: 'types de terrain', desc: '5×5, 7×7 et mixte' },
  { value: '10%', unit: 'de commission', desc: 'transparente et fixe' },
  { value: '< 1 min', unit: 'pour réserver', desc: 'sans appel, sans déplacement' },
]

const featureSections = [
  {
    title: 'Réservez en quelques clics.',
    subtitle: 'Choisissez votre terrain, vérifiez la disponibilité en temps réel et confirmez votre créneau — tout se passe en ligne, sans appels ni déplacements.',
    cta: 'Voir les terrains',
    link: '/terrains',
    imageRight: true,
    visual: <FootballPitch className="w-full h-[300px] animate-pitch drop-shadow-xl rounded-xl"/>,
  },
  {
    title: 'Paiement transparent. Suivi complet.',
    subtitle: 'Payez en ligne avec une commission de 10% clairement affichée. Suivez chaque transaction dans votre espace personnel.',
    cta: 'Commencer maintenant',
    link: '/register',
    imageRight: false,
    visual: <PaymentMockup />,
  },
  {
    title: 'Votre match, votre communauté.',
    subtitle: "Publiez des matchs publics et invitez d'autres joueurs. Constituez votre équipe et gérez les inscriptions automatiquement.",
    cta: 'Explorer les matchs',
    link: '/matches',
    imageRight: true,
    visual: <PlayersMockup />,
  },
]

/* ── Main component ──────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#f5f5f7]"/>
        <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] rounded-full bg-blue-50/60 blur-[120px] pointer-events-none"/>

        <div className="relative w-full max-w-page mx-auto px-24 py-96 grid lg:grid-cols-2 gap-64 items-center">
          {/* Left: text */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-8 px-14 py-6 rounded-full bg-blue-50 border border-blue-100 text-apple-blue text-[13px] font-medium mb-24">
              <span className="w-[6px] h-[6px] rounded-full bg-apple-blue animate-pulse"/>
              Plateforme SaaS · Maroc
            </div>

            <h1 className="text-hero-mobile md:text-hero-tablet lg:text-hero text-apple-dark mb-20 text-balance leading-[1.05]">
              Réservez votre<br/>
              <span className="text-apple-blue">terrain.</span>{' '}
              Simplement.
            </h1>

            <p className="text-[18px] text-apple-dark/55 mb-40 max-w-[500px] leading-relaxed">
              La plateforme qui connecte joueurs et terrains de football au Maroc — réservation, paiement et gestion en toute simplicité.
            </p>

            <div className="flex flex-wrap gap-12">
              <button
                onClick={() => navigate('/terrains')}
                className="btn-primary !py-14 !px-28 !text-[16px]"
              >
                Voir les terrains
              </button>
              {!user ? (
                <button
                  onClick={() => navigate('/register')}
                  className="btn-secondary !py-14 !px-28 !text-[16px]"
                >
                  Créer un compte
                </button>
              ) : (
                <button
                  onClick={() => navigate('/reservation/new')}
                  className="btn-secondary !py-14 !px-28 !text-[16px]"
                >
                  Réserver un créneau
                </button>
              )}
            </div>
          </div>

          {/* Right: pitch visual */}
          <div className="hidden lg:block animate-pitch">
            <div className="relative">
              <div className="absolute -inset-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-700/10 blur-2xl"/>
              <FootballPitch className="relative w-full h-[340px] rounded-2xl shadow-pitch"/>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-30 animate-bounce">
          <div className="w-px h-[40px] bg-apple-dark"/>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-apple-dark py-64">
        <div className="max-w-content mx-auto px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((s, i) => (
              <FadeSection key={i} delay={i * 100} className="px-32 py-32 text-center">
                <p className="text-[40px] md:text-[48px] font-bold text-white tracking-tight mb-4">{s.value}</p>
                <p className="text-[15px] font-semibold text-white/70 mb-4">{s.unit}</p>
                <p className="text-[13px] text-white/40">{s.desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE SECTIONS (alternating) ───────────────────── */}
      {featureSections.map((s, i) => (
        <section key={i} className={`py-96 lg:py-120 ${i % 2 === 1 ? 'bg-apple-gray' : 'bg-white'}`}>
          <div className="max-w-content mx-auto px-24">
            <FadeSection>
              <div className={`flex flex-col ${s.imageRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-64 lg:gap-96`}>
                <div className="flex-1 max-w-[480px]">
                  <h2 className="text-headline md:text-[42px] md:leading-[1.08] font-bold text-apple-dark mb-16 text-balance">
                    {s.title}
                  </h2>
                  <p className="text-[17px] text-apple-dark/55 mb-28 leading-relaxed">
                    {s.subtitle}
                  </p>
                  <button onClick={() => navigate(s.link)} className="btn-link text-[16px]">
                    {s.cta}
                  </button>
                </div>
                <div className="flex-1 w-full transition-transform duration-500 hover:scale-[1.02]">
                  <div className="rounded-2xl overflow-hidden shadow-hover">
                    {s.visual}
                  </div>
                </div>
              </div>
            </FadeSection>
          </div>
        </section>
      ))}

      {/* ── GRID (6 features) ────────────────────────────────── */}
      <section className="py-96 lg:py-120 bg-white">
        <div className="max-w-content mx-auto px-24">
          <FadeSection className="text-center mb-64">
            <h2 className="text-headline md:text-[42px] md:leading-[1.08] font-bold text-apple-dark mb-14">
              Tout ce dont vous avez besoin.
            </h2>
            <p className="text-[17px] text-apple-dark/55 max-w-[480px] mx-auto">
              Une solution complète pour la gestion de terrains de football.
            </p>
          </FadeSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            {features.map((f, i) => (
              <FadeSection key={i} delay={i * 70}>
                <div className="bg-white rounded-card p-32 border border-apple-medium-gray/30 transition-all duration-300 hover:-translate-y-[6px] hover:shadow-hover hover:border-transparent group">
                  <div className="w-[52px] h-[52px] rounded-[14px] bg-apple-blue/8 flex items-center justify-center mb-20 group-hover:bg-apple-blue/12 transition-colors duration-300">
                    <svg className="w-[24px] h-[24px] text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon}/>
                    </svg>
                  </div>
                  <h3 className="text-[16px] font-semibold text-apple-dark mb-8">{f.title}</h3>
                  <p className="text-[14px] text-apple-dark/50 leading-relaxed">{f.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-96 lg:py-120 bg-apple-dark overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #0071e3 0%, transparent 60%), radial-gradient(circle at 70% 50%, #34aadc 0%, transparent 60%)' }}/>
        <div className="relative max-w-content mx-auto px-24 text-center">
          <FadeSection>
            <h2 className="text-headline md:text-[48px] md:leading-[1.06] font-bold text-white mb-16 text-balance">
              Prêt pour votre prochain match ?
            </h2>
            <p className="text-[18px] text-white/55 mb-40 max-w-[480px] mx-auto">
              Rejoignez TerrainPro et réservez votre terrain en moins d'une minute.
            </p>
            <div className="flex flex-wrap gap-14 justify-center">
              <button
                onClick={() => navigate(user ? '/reservation/new' : '/register')}
                className="btn-primary !py-14 !px-32 !text-[16px]"
              >
                {user ? 'Réserver maintenant' : "S'inscrire gratuitement"}
              </button>
              <button
                onClick={() => navigate('/terrains')}
                className="btn-secondary !py-14 !px-32 !text-[16px] !text-white !border-white/30 hover:!border-white/60"
              >
                Explorer les terrains
              </button>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  )
}
