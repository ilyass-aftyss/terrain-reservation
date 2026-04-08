import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

const statusColors = {
  PENDING: 'bg-yellow-50 text-yellow-600',
  CONFIRMED: 'bg-blue-50 text-apple-blue',
  PAID: 'bg-green-50 text-green-600',
  COMPLETED: 'bg-apple-gray text-apple-dark/50',
  CANCELLED: 'bg-red-50 text-red-500',
}

export default function Profile() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    Promise.all([
      apiClient.get(`/reservations/user/${user.id}`),
      apiClient.get(`/payments/user/${user.id}`)
    ]).then(([resRes, payRes]) => {
      setReservations(resRes.data)
      setPayments(payRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Chargement...</p>
    </div>
  )
  if (!user) return null

  const totalSpent = payments.reduce((sum, p) => sum + (p.montant || 0), 0)

  return (
    <div className="py-96 lg:py-120">
      <div className="max-w-narrow mx-auto px-24">
        {/* Profile header */}
        <div className="bg-white rounded-card border border-apple-medium-gray/20 p-32 mb-32 animate-fade-up">
          <div className="flex items-center gap-20">
            <div className="w-[64px] h-[64px] rounded-full bg-apple-gray flex items-center justify-center shrink-0">
              <svg className="w-[28px] h-[28px] text-apple-dark/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <div>
              <h1 className="text-headline font-semibold text-apple-dark">{user.prenom} {user.nom}</h1>
              <p className="text-caption text-apple-dark/40">{user.email}</p>
              {user.telephone && <p className="text-caption text-apple-dark/40">{user.telephone}</p>}
              <span className="inline-block mt-6 text-[11px] font-medium px-8 py-2 rounded-full bg-apple-blue/8 text-apple-blue">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-14 mb-48 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="bg-white rounded-card border border-apple-medium-gray/20 p-20 text-center">
            <p className="text-[24px] font-semibold text-apple-dark">{reservations.length}</p>
            <p className="text-[12px] text-apple-dark/40">Réservations</p>
          </div>
          <div className="bg-white rounded-card border border-apple-medium-gray/20 p-20 text-center">
            <p className="text-[24px] font-semibold text-apple-dark">{payments.length}</p>
            <p className="text-[12px] text-apple-dark/40">Paiements</p>
          </div>
          <div className="bg-white rounded-card border border-apple-medium-gray/20 p-20 text-center">
            <p className="text-[24px] font-semibold text-apple-dark">{totalSpent.toFixed(0)}</p>
            <p className="text-[12px] text-apple-dark/40">MAD dépensés</p>
          </div>
        </div>

        {/* Recent reservations */}
        <div className="mb-48 animate-fade-up" style={{ animationDelay: '160ms' }}>
          <h2 className="text-body font-semibold text-apple-dark mb-20">Réservations récentes</h2>
          {reservations.length > 0 ? (
            <div className="space-y-8">
              {reservations.slice(0, 5).map(r => (
                <div key={r.id} className="bg-white rounded-card border border-apple-medium-gray/20 p-20 flex items-center justify-between hover:shadow-card transition-shadow duration-300">
                  <div className="flex items-center gap-14">
                    <div>
                      <p className="text-caption font-medium text-apple-dark">{r.terrainName}</p>
                      <p className="text-[12px] text-apple-dark/40">{r.type?.replace('TYPE_', '')} · {new Date(r.dateDebut).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <span className="text-caption font-semibold text-apple-dark">{r.montant} MAD</span>
                    <span className={`text-[11px] font-medium px-8 py-2 rounded-full ${statusColors[r.statut] || 'bg-apple-gray text-apple-dark/50'}`}>{r.statut}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-apple-dark/30 py-24 text-center">Aucune réservation</p>
          )}
        </div>

        {/* Payments */}
        <div className="animate-fade-up" style={{ animationDelay: '240ms' }}>
          <h2 className="text-body font-semibold text-apple-dark mb-20">Paiements</h2>
          {payments.length > 0 ? (
            <div className="space-y-8">
              {payments.slice(0, 5).map(p => (
                <div key={p.id} className="bg-white rounded-card border border-apple-medium-gray/20 p-20 flex items-center justify-between hover:shadow-card transition-shadow duration-300">
                  <div>
                    <p className="text-caption font-medium text-apple-dark">{p.numeroReservation}</p>
                    <p className="text-[12px] text-apple-dark/40">{p.methodePaiement} · {p.transactionId}</p>
                  </div>
                  <div className="flex items-center gap-12">
                    <span className="text-caption font-semibold text-apple-dark">{p.montant?.toFixed(2)} MAD</span>
                    <span className={`text-[11px] font-medium px-8 py-2 rounded-full ${statusColors[p.statut] || 'bg-apple-gray text-apple-dark/50'}`}>{p.statut}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-caption text-apple-dark/30 py-24 text-center">Aucun paiement</p>
          )}
        </div>
      </div>
    </div>
  )
}
