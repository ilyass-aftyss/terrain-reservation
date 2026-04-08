import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

const inputCls = `w-full px-16 py-[13px] bg-apple-gray border border-apple-medium-gray/40 rounded-[10px] text-[16px] text-apple-dark
  placeholder:text-apple-dark/30 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent focus:bg-white transition-all duration-250`

const selectCls = `${inputCls} cursor-pointer appearance-none`

export default function ReservationForm() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedTerrain = searchParams.get('terrain')

  const [terrains, setTerrains]             = useState([])
  const [form, setForm]                     = useState({
    terrainId: preselectedTerrain || '',
    date: '',
    heureDebut: '',
    heureFin: '',
    type: 'TYPE_5x5'
  })
  const [conflict, setConflict]             = useState(false)
  const [price, setPrice]                   = useState(null)
  const [selectedTerrain, setSelectedTerrain] = useState(null)
  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState(null)
  const [success, setSuccess]               = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    apiClient.get('/terrains').then(res => {
      setTerrains(res.data)
      if (preselectedTerrain) {
        const t = res.data.find(t => t.id == preselectedTerrain)
        if (t) setSelectedTerrain(t)
      }
    })
  }, [])

  useEffect(() => {
    if (form.terrainId) {
      const t = terrains.find(t => t.id == form.terrainId)
      setSelectedTerrain(t)
      if (t) setPrice(form.type === 'TYPE_5x5' ? t.prix5x5 : t.prix7x7)
    }
  }, [form.terrainId, form.type, terrains])

  useEffect(() => {
    if (form.terrainId && form.date && form.heureDebut && form.heureFin) checkConflict()
  }, [form.terrainId, form.date, form.heureDebut, form.heureFin])

  const checkConflict = async () => {
    try {
      const dateDebut = `${form.date}T${form.heureDebut}:00`
      const dateFin   = `${form.date}T${form.heureFin}:00`
      const res = await apiClient.get('/reservations/check-conflict', {
        params: { terrainId: form.terrainId, dateDebut, dateFin }
      })
      setConflict(res.data.conflict)
    } catch { setConflict(false) }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null); setSuccess(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (conflict) { setError('Ce créneau est déjà réservé.'); return }
    setLoading(true)
    try {
      const dateDebut = `${form.date}T${form.heureDebut}:00`
      const dateFin   = `${form.date}T${form.heureFin}:00`
      await apiClient.post('/reservations', {
        userId: user.id, terrainId: parseInt(form.terrainId),
        dateDebut, dateFin, type: form.type, montant: price
      })
      setSuccess('Réservation créée avec succès ! Redirection…')
      setTimeout(() => navigate('/reservations'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la réservation.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-24 py-96 bg-white">
      <div className="w-full max-w-[520px] animate-fade-up">

        {/* Header */}
        <div className="text-center mb-40">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-green-50 flex items-center justify-center mx-auto mb-20">
            <svg className="w-[26px] h-[26px] text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-apple-dark mb-8 tracking-tight">Nouvelle réservation</h1>
          <p className="text-[16px] text-apple-dark/50">Choisissez votre terrain et votre créneau</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-20 p-14 bg-red-50 border border-red-200/60 rounded-[12px] text-[14px] text-red-700 flex items-center gap-8">
            <svg className="w-[16px] h-[16px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-20 p-14 bg-green-50 border border-green-200/60 rounded-[12px] text-[14px] text-green-700 flex items-center gap-8">
            <svg className="w-[16px] h-[16px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-16">
          {/* Terrain */}
          <div>
            <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Terrain</label>
            <div className="relative">
              <select name="terrainId" value={form.terrainId} onChange={handleChange} required className={selectCls}>
                <option value="">Choisir un terrain</option>
                {terrains.map(t => (
                  <option key={t.id} value={t.id}>{t.nom} — {t.localisation}</option>
                ))}
              </select>
              <svg className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-apple-dark/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
              </svg>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required
              min={new Date().toISOString().split('T')[0]} className={inputCls}/>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Heure début</label>
              <input type="time" name="heureDebut" value={form.heureDebut} onChange={handleChange} required className={inputCls}/>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Heure fin</label>
              <input type="time" name="heureFin" value={form.heureFin} onChange={handleChange} required className={inputCls}/>
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Type de terrain</label>
            <div className="grid grid-cols-2 gap-10">
              {[
                ...(selectedTerrain?.type5x5 || !selectedTerrain ? [{ value: 'TYPE_5x5', label: '5 contre 5', color: 'green' }] : []),
                ...(selectedTerrain?.type7x7 || !selectedTerrain ? [{ value: 'TYPE_7x7', label: '7 contre 7', color: 'blue' }] : []),
              ].map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => handleChange({ target: { name: 'type', value: opt.value } })}
                  className={`p-12 rounded-[12px] border-2 text-center transition-all duration-250 cursor-pointer bg-transparent
                    ${form.type === opt.value
                      ? opt.color === 'green' ? 'border-green-500 bg-green-50' : 'border-apple-blue bg-blue-50/60'
                      : 'border-apple-medium-gray/40 hover:border-apple-medium-gray/70'
                    }`}
                >
                  <p className={`text-[14px] font-semibold ${form.type === opt.value ? (opt.color === 'green' ? 'text-green-700' : 'text-apple-blue') : 'text-apple-dark'}`}>
                    {opt.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Conflict warning */}
          {conflict && (
            <div className="p-14 bg-red-50 border border-red-200/60 rounded-[12px] text-[14px] text-red-700 flex items-center gap-8">
              <svg className="w-[16px] h-[16px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              Ce créneau est déjà réservé pour ce terrain.
            </div>
          )}

          {/* Price summary */}
          {price && !conflict && (
            <div className="p-16 bg-green-50 border border-green-200/40 rounded-[12px] flex items-center justify-between">
              <div className="flex items-center gap-8">
                <svg className="w-[16px] h-[16px] text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75"/>
                </svg>
                <span className="text-[14px] text-green-700 font-medium">Prix du créneau</span>
              </div>
              <span className="text-[18px] font-bold text-green-700">{price} MAD</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || conflict}
            className="btn-primary !w-full !py-[14px] !text-[16px] mt-8"
          >
            {loading
              ? <span className="flex items-center justify-center gap-8">
                  <svg className="w-[16px] h-[16px] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Confirmation…
                </span>
              : 'Confirmer la réservation'
            }
          </button>
        </form>
      </div>
    </div>
  )
}
