import { useState, useEffect } from 'react'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

export default function MatchPublic() {
  const { user } = useAuthStore()
  const [matches, setMatches] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [terrains, setTerrains] = useState([])
  const [form, setForm] = useState({
    terrainId: '', dateMatch: '', type: 'TYPE_5x5', maxJoueurs: 10, prixParJoueur: 0, description: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadMatches()
    apiClient.get('/terrains').then(res => setTerrains(res.data))
  }, [])

  const loadMatches = async () => {
    try {
      const res = await apiClient.get('/matches')
      setMatches(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await apiClient.post('/matches', {
        creatorId: user.id,
        terrainId: parseInt(form.terrainId),
        dateMatch: form.dateMatch + ':00',
        type: form.type,
        maxJoueurs: parseInt(form.maxJoueurs),
        prixParJoueur: parseFloat(form.prixParJoueur),
        description: form.description
      })
      setMessage('Match créé avec succès !')
      setShowForm(false)
      loadMatches()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la création')
    }
  }

  const handleJoin = async (matchId) => {
    try {
      await apiClient.post(`/matches/${matchId}/join`, { userId: user.id })
      setMessage('Vous avez rejoint le match !')
      loadMatches()
    } catch (err) { setMessage(err.response?.data?.message || 'Erreur') }
  }

  const handleLeave = async (matchId) => {
    try {
      await apiClient.delete(`/matches/${matchId}/leave`, { data: { userId: user.id } })
      setMessage('Vous avez quitté le match')
      loadMatches()
    } catch (err) { setMessage(err.response?.data?.message || 'Erreur') }
  }

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Chargement...</p>
    </div>
  )

  const inputClass = 'w-full px-14 py-12 bg-apple-gray border border-apple-medium-gray/30 rounded-lg text-caption text-apple-dark outline-none focus:ring-2 focus:ring-apple-blue/30 transition-all duration-300'
  const selectClass = inputClass + ' appearance-none bg-no-repeat bg-[right_12px_center] bg-[length:12px] bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 8%27%3E%3Cpath d=%27M1 1l5 5 5-5%27 stroke=%27%231d1d1f%27 stroke-width=%271.5%27 fill=%27none%27/%3E%3C/svg%3E")]'

  return (
    <div className="py-96 lg:py-120">
      <div className="max-w-content mx-auto px-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-48 animate-fade-up">
          <div>
            <h1 className="text-headline md:text-[40px] md:leading-[1.1] font-semibold text-apple-dark mb-6">Matchs Publics</h1>
            <p className="text-body text-apple-dark/50">{matches.length} match{matches.length > 1 ? 's' : ''} disponible{matches.length > 1 ? 's' : ''}</p>
          </div>
          {user && (
            <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
              {showForm ? 'Annuler' : 'Créer un match'}
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className="mb-24 px-20 py-14 bg-apple-blue/5 border border-apple-blue/20 rounded-card text-caption text-apple-blue animate-fade-up">
            {message}
            <button onClick={() => setMessage(null)} className="ml-12 text-apple-dark/30 hover:text-apple-dark/60">×</button>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <div className="bg-white rounded-card border border-apple-medium-gray/20 p-32 mb-48 animate-fade-up">
            <h2 className="text-body font-semibold text-apple-dark mb-24">Nouveau match public</h2>
            <form onSubmit={handleCreate} className="space-y-16">
              <div>
                <label className="block text-caption text-apple-dark/50 mb-6">Terrain</label>
                <select value={form.terrainId} onChange={e => setForm({...form, terrainId: e.target.value})} required className={selectClass}>
                  <option value="">Choisir un terrain</option>
                  {terrains.map(t => <option key={t.id} value={t.id}>{t.nom} — {t.localisation}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-caption text-apple-dark/50 mb-6">Date et heure</label>
                <input type="datetime-local" value={form.dateMatch} onChange={e => setForm({...form, dateMatch: e.target.value})} required className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
                <div>
                  <label className="block text-caption text-apple-dark/50 mb-6">Type</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className={selectClass}>
                    <option value="TYPE_5x5">5 vs 5</option>
                    <option value="TYPE_7x7">7 vs 7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-caption text-apple-dark/50 mb-6">Max joueurs</label>
                  <input type="number" value={form.maxJoueurs} onChange={e => setForm({...form, maxJoueurs: e.target.value})} min="2" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-caption text-apple-dark/50 mb-6">Prix/joueur (MAD)</label>
                  <input type="number" step="0.01" value={form.prixParJoueur} onChange={e => setForm({...form, prixParJoueur: e.target.value})} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-caption text-apple-dark/50 mb-6">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" placeholder="Détails du match..." className={inputClass + ' resize-none'} />
              </div>
              <button type="submit" className="btn-primary">Créer le match</button>
            </form>
          </div>
        )}

        {/* Matches grid */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            {matches.map((match, i) => {
              const pct = (match.joueursInscrits / match.maxJoueurs) * 100
              const isJoined = match.participants?.includes(user?.nom + ' ' + user?.prenom)
              return (
                <div key={match.id} className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden hover:shadow-hover transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="p-24">
                    {/* Top row: type + status */}
                    <div className="flex items-center justify-between mb-14">
                      <span className="text-[11px] font-semibold text-apple-blue bg-apple-blue/8 px-8 py-2 rounded-full">{match.type?.replace('TYPE_', '')}</span>
                      <span className={`text-[11px] font-medium px-8 py-2 rounded-full ${match.ouvert ? 'bg-green-50 text-green-600' : 'bg-apple-gray text-apple-dark/40'}`}>
                        {match.ouvert ? 'Ouvert' : 'Complet'}
                      </span>
                    </div>

                    <h3 className="text-body font-semibold text-apple-dark mb-8">{match.terrainName}</h3>

                    <div className="space-y-6 mb-16">
                      <p className="flex items-center gap-6 text-caption text-apple-dark/50">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        {match.terrainLocalisation}
                      </p>
                      <p className="flex items-center gap-6 text-caption text-apple-dark/50">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                        {new Date(match.dateMatch).toLocaleString('fr-FR')}
                      </p>
                      <p className="flex items-center gap-6 text-caption text-apple-dark/50">
                        <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                        Organisé par {match.creatorName}
                      </p>
                    </div>

                    {match.description && <p className="text-[12px] text-apple-dark/40 mb-16 line-clamp-2">{match.description}</p>}

                    {/* Players + price */}
                    <div className="flex items-center justify-between mb-12">
                      <span className="text-caption text-apple-dark/60">{match.joueursInscrits}/{match.maxJoueurs} joueurs</span>
                      <span className="text-caption font-semibold text-apple-dark">{match.prixParJoueur} MAD</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-[4px] bg-apple-gray rounded-full mb-16">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#86868b' : '#0071e3' }} />
                    </div>

                    {/* Participants */}
                    {match.participants?.length > 0 && (
                      <p className="text-[11px] text-apple-dark/30 mb-14 line-clamp-1">Participants: {match.participants.join(', ')}</p>
                    )}

                    {/* Action */}
                    {user && match.ouvert && (
                      isJoined ? (
                        <button onClick={() => handleLeave(match.id)} className="btn-danger w-full !py-10 !text-[13px]">Quitter</button>
                      ) : (
                        <button onClick={() => handleJoin(match.id)} className="btn-primary w-full !text-[13px]">Rejoindre</button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-96">
            <p className="text-body text-apple-dark/30">Aucun match public disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
