import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/axiosConfig'
import useAuthStore from '../store/authStore'

const tabs = [
  { key: 'stats', label: 'Statistiques' },
  { key: 'users', label: 'Utilisateurs' },
  { key: 'terrains', label: 'Terrains' },
  { key: 'transactions', label: 'Transactions' },
]

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-card p-24 border border-apple-medium-gray/20">
      <p className="text-caption text-apple-dark/40 mb-4">{label}</p>
      <p className="text-[28px] font-semibold text-apple-dark leading-tight">{value}</p>
      {sub && <p className="text-[12px] text-apple-dark/30 mt-4">{sub}</p>}
    </div>
  )
}

const thClass = 'text-left text-[12px] font-medium text-apple-dark/40 uppercase tracking-wider px-24 py-14'
const tdClass = 'px-24 py-14 text-caption text-apple-dark/70'
const trClass = 'border-b border-apple-medium-gray/10 last:border-0 hover:bg-apple-gray/50 transition-colors duration-300'

function RoleBadge({ role }) {
  const colors = { ADMIN: 'bg-red-50 text-red-600', PRESIDENT: 'bg-blue-50 text-apple-blue', JOUEUR: 'bg-green-50 text-green-600' }
  return <span className={`text-[11px] font-medium px-8 py-2 rounded-full ${colors[role] || 'bg-apple-gray text-apple-dark/50'}`}>{role}</span>
}

function StatusDot({ active }) {
  return (
    <span className="flex items-center gap-6 text-caption">
      <span className={`inline-block w-[6px] h-[6px] rounded-full ${active ? 'bg-green-500' : 'bg-apple-medium-gray'}`} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  )
}

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [terrains, setTerrains] = useState([])
  const [transactions, setTransactions] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { navigate('/'); return }
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [statsRes, usersRes, terrainsRes, txRes, dashRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/users'),
        apiClient.get('/admin/terrains'),
        apiClient.get('/admin/transactions'),
        apiClient.get('/dashboard/admin')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setTerrains(terrainsRes.data)
      setTransactions(txRes.data)
      setDashboard(dashRes.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const toggleUser = async (id) => { await apiClient.put(`/admin/users/${id}/toggle`); loadData() }
  const validateTerrain = async (id) => { await apiClient.put(`/admin/terrains/${id}/validate`); loadData() }
  const deactivateTerrain = async (id) => { await apiClient.put(`/admin/terrains/${id}/deactivate`); loadData() }

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <p className="text-body text-apple-dark/40">Chargement...</p>
    </div>
  )

  const maxMonthly = Math.max(...Object.values(dashboard?.revenusMensuels || {}), 1)

  return (
    <div className="py-96 lg:py-120">
      <div className="max-w-content mx-auto px-24">
        {/* Header */}
        <div className="mb-48 animate-fade-up">
          <h1 className="text-headline md:text-[40px] md:leading-[1.1] font-semibold text-apple-dark mb-6">Administration</h1>
          <p className="text-body text-apple-dark/50">Gérez les utilisateurs, terrains et transactions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-32 border-b border-apple-medium-gray/20">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`btn-tab ${tab === t.key ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats tab */}
        {tab === 'stats' && stats && dashboard && (
          <div className="animate-fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-14 mb-14">
              <StatCard label="Utilisateurs" value={stats.totalUsers} />
              <StatCard label="Terrains" value={stats.totalTerrains} />
              <StatCard label="Réservations" value={stats.totalReservations} />
              <StatCard label="Paiements" value={stats.totalPayments} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-48">
              <StatCard label="Revenu total" value={`${dashboard.revenuTotal?.toFixed(0)} MAD`} />
              <StatCard label="Commission plateforme" value={`${dashboard.commissionTotale?.toFixed(0)} MAD`} sub="10% de commission" />
              <StatCard label="Ce mois" value={`${dashboard.revenuMoisEnCours?.toFixed(0)} MAD`} />
            </div>

            {dashboard.revenusMensuels && (
              <div>
                <h2 className="text-body font-semibold text-apple-dark mb-20">Revenus mensuels</h2>
                <div className="bg-white rounded-card border border-apple-medium-gray/20 p-24">
                  <div className="flex flex-col gap-12">
                    {Object.entries(dashboard.revenusMensuels).map(([month, rev]) => (
                      <div key={month} className="flex items-center gap-14">
                        <span className="text-caption text-apple-dark/50 w-[80px] shrink-0">{month}</span>
                        <div className="flex-1 h-[6px] bg-apple-gray rounded-full">
                          <div className="h-full bg-apple-dark rounded-full transition-all duration-500" style={{ width: `${(rev / maxMonthly) * 100}%` }} />
                        </div>
                        <span className="text-caption font-medium text-apple-dark w-[90px] text-right shrink-0">{rev.toFixed(0)} MAD</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-20">
              <h2 className="text-body font-semibold text-apple-dark">Utilisateurs</h2>
              <span className="text-caption text-apple-dark/40">{users.length} au total</span>
            </div>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-apple-medium-gray/20">
                    <th className={thClass}>Nom</th><th className={thClass}>Email</th><th className={thClass}>Rôle</th><th className={thClass}>Statut</th><th className={thClass}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className={trClass}>
                        <td className="px-24 py-14 text-caption text-apple-dark font-medium">{u.nom} {u.prenom}</td>
                        <td className={tdClass}>{u.email}</td>
                        <td className="px-24 py-14"><RoleBadge role={u.role} /></td>
                        <td className="px-24 py-14"><StatusDot active={u.active} /></td>
                        <td className="px-24 py-14">
                          <button onClick={() => toggleUser(u.id)} className={`btn-table-action ${u.active ? 'danger' : 'success'}`}>
                            {u.active ? 'Désactiver' : 'Activer'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Terrains tab */}
        {tab === 'terrains' && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-20">
              <h2 className="text-body font-semibold text-apple-dark">Terrains</h2>
              <span className="text-caption text-apple-dark/40">{terrains.length} au total</span>
            </div>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-apple-medium-gray/20">
                    <th className={thClass}>Nom</th><th className={thClass}>Localisation</th><th className={thClass}>Président</th><th className={thClass}>Prix 5x5</th><th className={thClass}>Prix 7x7</th><th className={thClass}>Statut</th><th className={thClass}>Actions</th>
                  </tr></thead>
                  <tbody>
                    {terrains.map(t => (
                      <tr key={t.id} className={trClass}>
                        <td className="px-24 py-14 text-caption text-apple-dark font-medium">{t.nom}</td>
                        <td className={tdClass}>{t.localisation}</td>
                        <td className={tdClass}>{t.presidentName}</td>
                        <td className={tdClass}>{t.prix5x5} MAD</td>
                        <td className={tdClass}>{t.prix7x7} MAD</td>
                        <td className="px-24 py-14"><StatusDot active={t.actif} /></td>
                        <td className="px-24 py-14">
                          {t.actif ? (
                            <button onClick={() => deactivateTerrain(t.id)} className="btn-table-action danger">Désactiver</button>
                          ) : (
                            <button onClick={() => validateTerrain(t.id)} className="btn-table-action success">Valider</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions tab */}
        {tab === 'transactions' && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-20">
              <h2 className="text-body font-semibold text-apple-dark">Transactions</h2>
              <span className="text-caption text-apple-dark/40">{transactions.length} au total</span>
            </div>
            <div className="bg-white rounded-card border border-apple-medium-gray/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-apple-medium-gray/20">
                    <th className={thClass}>ID Transaction</th><th className={thClass}>Utilisateur</th><th className={thClass}>Montant</th><th className={thClass}>Commission</th><th className={thClass}>Net Président</th><th className={thClass}>Méthode</th><th className={thClass}>Statut</th>
                  </tr></thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} className={trClass}>
                        <td className="px-24 py-14 text-caption text-apple-dark font-medium font-mono">{t.transactionId}</td>
                        <td className={tdClass}>{t.userName}</td>
                        <td className={tdClass}>{t.montant?.toFixed(2)} MAD</td>
                        <td className={tdClass}>{t.commission?.toFixed(2)} MAD</td>
                        <td className={tdClass}>{t.montantPresident?.toFixed(2)} MAD</td>
                        <td className={tdClass}>{t.methode}</td>
                        <td className="px-24 py-14">
                          <span className={`text-[11px] font-medium px-8 py-2 rounded-full ${t.statut === 'COMPLETED' ? 'bg-green-50 text-green-600' : t.statut === 'PENDING' ? 'bg-yellow-50 text-yellow-600' : 'bg-apple-gray text-apple-dark/50'}`}>{t.statut}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
