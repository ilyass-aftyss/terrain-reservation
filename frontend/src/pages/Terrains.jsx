import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'
import useScrollAnimation from '../hooks/useScrollAnimation'

/* ── Mini pitch SVG ──────────────────────────────────────────── */
const MiniPitch = ({ type5x5, type7x7 }) => (
  <div className="w-full h-[140px] relative overflow-hidden rounded-t-card">
    <svg viewBox="0 0 320 140" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#16a34a"/>
          <stop offset="100%" stopColor="#15803d"/>
        </linearGradient>
      </defs>
      <rect width="320" height="140" fill="url(#mg)"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={i*64} y="0" width="64" height="140"
          fill={i%2===0 ? 'rgba(0,0,0,0.06)' : 'transparent'}/>
      ))}
      <rect x="12" y="10" width="296" height="120" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none"/>
      <line x1="160" y1="10" x2="160" y2="130" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <circle cx="160" cy="70" r="26" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none"/>
      <circle cx="160" cy="70" r="2.5" fill="rgba(255,255,255,0.9)"/>
      <rect x="12" y="36" width="44" height="68" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
      <rect x="264" y="36" width="44" height="68" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>
    </svg>

    {/* Type badges on the image */}
    <div className="absolute top-[10px] right-[10px] flex flex-col gap-[5px]">
      {type5x5 && (
        <span className="text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm px-[8px] py-[3px] rounded-full">
          5×5
        </span>
      )}
      {type7x7 && (
        <span className="text-[10px] font-bold text-white bg-black/30 backdrop-blur-sm px-[8px] py-[3px] rounded-full">
          7×7
        </span>
      )}
    </div>
  </div>
)

function FadeCard({ children, delay = 0 }) {
  const [ref, visible] = useScrollAnimation(0.08)
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[24px]'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Terrains() {
  const [terrains, setTerrains] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    apiClient.get('/terrains')
      .then(res  => { setTerrains(res.data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const handleReserve = (terrainId) => {
    if (!user) { navigate('/login'); return }
    navigate(`/reservation/new?terrain=${terrainId}`)
  }

  const filtered = terrains.filter(t =>
    t.nom?.toLowerCase().includes(search.toLowerCase()) ||
    t.localisation?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-12">
        <div className="w-[40px] h-[40px] rounded-full border-[3px] border-apple-blue/20 border-t-apple-blue animate-spin"/>
        <p className="text-caption text-apple-dark/40">Chargement des terrains...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[40px] mb-12">⚠️</p>
        <p className="text-body text-apple-dark/60 mb-6">Impossible de charger les terrains</p>
        <p className="text-caption text-apple-dark/30">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="bg-apple-gray border-b border-apple-medium-gray/20">
        <div className="max-w-content mx-auto px-24 py-64">
          <div className="animate-fade-up text-center">
            <h1 className="text-headline md:text-[42px] font-bold text-apple-dark mb-14">
              Terrains disponibles
            </h1>
            <p className="text-[17px] text-apple-dark/50 max-w-[460px] mx-auto mb-32">
              Trouvez le terrain idéal pour votre prochain match et réservez en quelques clics.
            </p>

            {/* Search bar */}
            <div className="relative max-w-[440px] mx-auto">
              <svg className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-apple-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher par nom ou ville…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-[44px] pr-[16px] py-[12px] bg-white border border-apple-medium-gray/40 rounded-full text-body text-apple-dark placeholder:text-apple-dark/30 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent transition-all duration-300 shadow-soft"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="max-w-content mx-auto px-24 py-64">
        {filtered.length > 0 ? (
          <>
            <p className="text-caption text-apple-dark/40 mb-24">
              {filtered.length} terrain{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
              {filtered.map((terrain, i) => (
                <FadeCard key={terrain.id} delay={i * 60}>
                  <div className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden transition-all duration-300 hover:-translate-y-[6px] hover:shadow-hover hover:border-transparent flex flex-col h-full">

                    {/* Pitch header */}
                    <MiniPitch type5x5={terrain.type5x5} type7x7={terrain.type7x7}/>

                    {/* Content */}
                    <div className="p-24 flex flex-col flex-1">
                      <h3 className="text-[16px] font-semibold text-apple-dark mb-8">{terrain.nom}</h3>

                      <div className="flex items-center gap-6 text-caption text-apple-dark/50 mb-6">
                        <svg className="w-[14px] h-[14px] shrink-0 text-apple-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        {terrain.localisation}
                      </div>

                      <p className="text-[12px] text-apple-dark/35 mb-14">
                        Géré par {terrain.presidentName}
                      </p>

                      {terrain.description && (
                        <p className="text-caption text-apple-dark/50 mb-14 line-clamp-2 leading-relaxed">{terrain.description}</p>
                      )}

                      {/* Prices */}
                      <div className="flex flex-wrap gap-8 mb-20 mt-auto">
                        {terrain.type5x5 && (
                          <div className="flex items-center gap-6 px-12 py-6 bg-green-50 rounded-full">
                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">5×5</span>
                            <span className="text-[13px] font-semibold text-green-700">{terrain.prix5x5} MAD</span>
                          </div>
                        )}
                        {terrain.type7x7 && (
                          <div className="flex items-center gap-6 px-12 py-6 bg-blue-50 rounded-full">
                            <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">7×7</span>
                            <span className="text-[13px] font-semibold text-apple-blue">{terrain.prix7x7} MAD</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleReserve(terrain.id)}
                        className="btn-primary !w-full !py-12 !text-[14px]"
                      >
                        Réserver ce terrain
                      </button>
                    </div>
                  </div>
                </FadeCard>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-96">
            <div className="w-[64px] h-[64px] rounded-full bg-apple-gray flex items-center justify-center mx-auto mb-20">
              <svg className="w-[28px] h-[28px] text-apple-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </div>
            <p className="text-body text-apple-dark/40 mb-8">Aucun terrain trouvé.</p>
            {search && (
              <button onClick={() => setSearch('')} className="text-caption text-apple-blue hover:underline">
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
