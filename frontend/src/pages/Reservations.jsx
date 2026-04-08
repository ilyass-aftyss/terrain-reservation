import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

const statusColors = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PAID: 'bg-green-50 text-green-700 border-green-200',
  COMPLETED: 'bg-apple-gray text-apple-dark/60 border-apple-medium-gray/40',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

export default function Reservations() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchReservations()
  }, [user])

  const fetchReservations = async () => {
    try {
      const response = await apiClient.get(`/reservations/user/${user.id}`)
      setReservations(response.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const handleCancel = async (id) => {
    if (!confirm('Confirmer l\'annulation de cette réservation ?')) return
    try {
      await apiClient.put(`/reservations/${id}/cancel`)
      setMessage('Réservation annulée avec succès.')
      fetchReservations()
    } catch { setMessage('Erreur lors de l\'annulation.') }
  }

  const handleDownloadPdf = async (id, numero) => {
    try {
      const res = await apiClient.get(`/reservations/${id}/pdf`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reservation_${numero}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch { setMessage('Erreur lors du téléchargement du PDF.') }
  }

  const handlePay = async (id) => {
    try {
      await apiClient.post('/payments/process', {
        reservationId: id, userId: user.id, methodePaiement: 'CARTE'
      })
      setMessage('Paiement effectué avec succès.')
      fetchReservations()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors du paiement.')
    }
  }

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Chargement...</p>
    </div>
  )

  return (
    <div className="py-96 lg:py-120">
      <div className="max-w-content mx-auto px-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-48 gap-20 animate-fade-up">
          <div>
            <h1 className="text-headline font-semibold text-apple-dark mb-6">Mes réservations</h1>
            <p className="text-caption text-apple-dark/50">{reservations.length} réservation{reservations.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => navigate('/reservation/new')}
            className="btn-primary !py-12 !px-24 !text-caption"
          >
            Nouvelle réservation
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-24 p-14 bg-apple-gray border border-apple-medium-gray/30 rounded-apple text-caption text-apple-dark/70 animate-fade-in">
            {message}
          </div>
        )}

        {/* List */}
        {reservations.length > 0 ? (
          <div className="flex flex-col gap-14">
            {reservations.map(r => (
              <div
                key={r.id}
                className="bg-white rounded-card p-24 border border-apple-medium-gray/20 transition-all duration-300 hover:shadow-soft"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-14">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-12 mb-6">
                      <h3 className="text-body font-semibold text-apple-dark truncate">{r.terrainName}</h3>
                      <span className={`px-8 py-2 text-[11px] font-medium rounded-full border ${statusColors[r.statut] || statusColors.PENDING}`}>
                        {r.statut}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-20 text-caption text-apple-dark/50">
                      <span>{new Date(r.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <span>{new Date(r.dateDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} — {new Date(r.dateFin).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{r.type?.replace('TYPE_', '')}</span>
                    </div>
                    <p className="text-[12px] text-apple-dark/30 mt-4">{r.numeroReservation}</p>
                  </div>

                  {/* Right: price + actions */}
                  <div className="flex items-center gap-14 shrink-0">
                    <span className="text-body font-semibold text-apple-dark">{r.montant} MAD</span>

                    <div className="flex gap-8">
                      <button
                        onClick={() => handleDownloadPdf(r.id, r.numeroReservation)}
                        className="btn-ghost"
                        title="Télécharger PDF"
                      >
                        <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </button>

                      {(r.statut === 'PENDING' || r.statut === 'CONFIRMED') && (
                        <button
                          onClick={() => handlePay(r.id)}
                          className="btn-success !py-6 !px-14"
                        >
                          Payer
                        </button>
                      )}

                      {r.statut !== 'CANCELLED' && r.statut !== 'COMPLETED' && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="btn-danger !py-6 !px-14"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-96">
            <p className="text-body text-apple-dark/40 mb-20">Aucune réservation pour le moment.</p>
            <button onClick={() => navigate('/reservation/new')} className="btn-link text-body">Créer votre première réservation</button>
          </div>
        )}
      </div>
    </div>
  )
}
