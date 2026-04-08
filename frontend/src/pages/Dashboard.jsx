import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-card p-24 border border-apple-medium-gray/20">
      <p className="text-caption text-apple-dark/40 mb-4">{label}</p>
      <p className="text-[28px] font-semibold text-apple-dark leading-tight">{value}</p>
      {sub && <p className="text-[12px] text-apple-dark/30 mt-4">{sub}</p>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'PRESIDENT') { navigate('/'); return }
    apiClient.get(`/dashboard/president/${user.id}`)
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Chargement du dashboard...</p>
    </div>
  )
  if (!data) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Aucune donnée disponible.</p>
    </div>
  )

  const maxHourly = Math.max(...Object.values(data.reservationsParHeure || {}), 1)
  const maxMonthly = Math.max(...Object.values(data.revenusMensuels || {}), 1)

  return (
    <div className="py-96 lg:py-120">
      <div className="max-w-content mx-auto px-24">
        {/* Header */}
        <div className="mb-48 animate-fade-up">
          <h1 className="text-headline md:text-[40px] md:leading-[1.1] font-semibold text-apple-dark mb-6">Dashboard</h1>
          <p className="text-body text-apple-dark/50">Vue d'ensemble de vos terrains et réservations</p>
        </div>

        {/* Stats row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-14 mb-14">
          <StatCard label="Total réservations" value={data.totalReservations} />
          <StatCard label="En cours" value={data.reservationsEnCours} />
          <StatCard label="Terminées" value={data.reservationsTerminees} />
          <StatCard label="Annulées" value={data.reservationsAnnulees} />
        </div>

        {/* Stats row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-14 mb-48">
          <StatCard label="Revenu total" value={`${data.revenuTotal?.toFixed(0)} MAD`} />
          <StatCard label="Ce mois" value={`${data.revenuMoisEnCours?.toFixed(0)} MAD`} />
          <StatCard label="Commission plateforme" value={`${data.commissionTotale?.toFixed(0)} MAD`} sub="10% de commission" />
          <StatCard label="Taux d'occupation" value={`${data.tauxOccupation}%`} />
        </div>

        {/* Terrain stats table */}
        {data.statsParTerrain?.length > 0 && (
          <div className="mb-48">
            <h2 className="text-body font-semibold text-apple-dark mb-20">Statistiques par terrain</h2>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-apple-medium-gray/20">
                      <th className="text-left text-[12px] font-medium text-apple-dark/40 uppercase tracking-wider px-24 py-14">Terrain</th>
                      <th className="text-left text-[12px] font-medium text-apple-dark/40 uppercase tracking-wider px-24 py-14">Réservations</th>
                      <th className="text-left text-[12px] font-medium text-apple-dark/40 uppercase tracking-wider px-24 py-14">Revenu</th>
                      <th className="text-left text-[12px] font-medium text-apple-dark/40 uppercase tracking-wider px-24 py-14">Occupation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.statsParTerrain.map(t => (
                      <tr key={t.terrainId} className="border-b border-apple-medium-gray/10 last:border-0 hover:bg-apple-gray/50 transition-colors duration-300">
                        <td className="px-24 py-14 text-caption text-apple-dark font-medium">{t.terrainNom}</td>
                        <td className="px-24 py-14 text-caption text-apple-dark/70">{t.totalReservations}</td>
                        <td className="px-24 py-14 text-caption text-apple-dark/70">{t.revenu?.toFixed(0)} MAD</td>
                        <td className="px-24 py-14">
                          <div className="flex items-center gap-8">
                            <div className="flex-1 h-[4px] bg-apple-gray rounded-full max-w-[80px]">
                              <div className="h-full bg-apple-blue rounded-full transition-all duration-500" style={{ width: `${t.tauxOccupation}%` }} />
                            </div>
                            <span className="text-[12px] text-apple-dark/50">{t.tauxOccupation}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hourly chart */}
        {data.reservationsParHeure && (
          <div className="mb-48">
            <h2 className="text-body font-semibold text-apple-dark mb-20">Réservations par heure</h2>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 p-24">
              <div className="flex items-end gap-4 h-[160px]">
                {Object.entries(data.reservationsParHeure).map(([h, count]) => (
                  <div key={h} className="flex-1 flex flex-col items-center gap-4">
                    <span className="text-[10px] text-apple-dark/30">{count > 0 ? count : ''}</span>
                    <div
                      className="w-full rounded-t-[3px] transition-all duration-500"
                      style={{
                        height: `${Math.max(2, (count / maxHourly) * 120)}px`,
                        backgroundColor: count > 0 ? '#0071e3' : '#f5f5f7'
                      }}
                    />
                    <span className="text-[10px] text-apple-dark/30">{h}h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Monthly revenue */}
        {data.revenusMensuels && (
          <div>
            <h2 className="text-body font-semibold text-apple-dark mb-20">Revenus mensuels</h2>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 p-24">
              <div className="flex flex-col gap-12">
                {Object.entries(data.revenusMensuels).map(([month, rev]) => (
                  <div key={month} className="flex items-center gap-14">
                    <span className="text-caption text-apple-dark/50 w-[80px] shrink-0">{month}</span>
                    <div className="flex-1 h-[6px] bg-apple-gray rounded-full">
                      <div
                        className="h-full bg-apple-dark rounded-full transition-all duration-500"
                        style={{ width: `${(rev / maxMonthly) * 100}%` }}
                      />
                    </div>
                    <span className="text-caption font-medium text-apple-dark w-[90px] text-right shrink-0">{rev.toFixed(0)} MAD</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
