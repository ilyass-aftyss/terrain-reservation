import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Icon = ({ d, className = '' }) => (
  <svg className={`w-[18px] h-[18px] ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
  </svg>
)

const icons = {
  terrains:       'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
  reservations:   'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5',
  matches:        'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
  dashboard:      'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  admin:          'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  profile:        'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  logout:         'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
  login:          'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  newReservation: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
  home:           'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  chevron:        'M19.5 8.25l-7.5 7.5-7.5-7.5',
}

const RoleBadge = ({ role }) => {
  const map = {
    ADMIN:     { bg: 'bg-red-50',          text: 'text-red-600',       label: 'Admin' },
    PRESIDENT: { bg: 'bg-blue-50',         text: 'text-apple-blue',    label: 'Président' },
    JOUEUR:    { bg: 'bg-green-50',        text: 'text-green-600',     label: 'Joueur' },
  }
  const r = map[role] || { bg: 'bg-apple-gray', text: 'text-apple-dark/50', label: role }
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-6 py-2 rounded-full ${r.bg} ${r.text}`}>
      {r.label}
    </span>
  )
}

export default function Navbar() {
  const { user, logout }  = useAuthStore()
  const navigate          = useNavigate()
  const location          = useLocation()
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setProfileOpen(false) }, [location.pathname])

  useEffect(() => {
    const h = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { setMobileOpen(false); setProfileOpen(false) } }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path

  const navItems = [
    { to: '/',            label: 'Accueil',       icon: icons.home,         show: true },
    { to: '/terrains',    label: 'Terrains',       icon: icons.terrains,     show: true },
    { to: '/reservations',label: 'Réservations',   icon: icons.reservations, show: !!user },
    { to: '/matches',     label: 'Matchs Publics', icon: icons.matches,      show: !!user },
    { to: '/dashboard',   label: 'Dashboard',      icon: icons.dashboard,    show: user?.role === 'PRESIDENT' },
    { to: '/admin',       label: 'Administration', icon: icons.admin,        show: user?.role === 'ADMIN' },
  ].filter(i => i.show)

  const DesktopLink = ({ to, label, icon }) => (
    <Link to={to}
      className={`group relative flex items-center gap-6 px-12 py-6 rounded-[10px] text-[13px] font-medium tracking-[0.01em] transition-all duration-300 hover:no-underline
        ${isActive(to) ? 'text-apple-blue bg-apple-blue/[0.07]' : 'text-apple-dark/65 hover:text-apple-dark hover:bg-apple-dark/[0.04]'}`}>
      <Icon d={icon} className={`w-[15px] h-[15px] transition-colors duration-300 ${isActive(to) ? 'text-apple-blue' : 'text-apple-dark/40 group-hover:text-apple-dark/70'}`}/>
      {label}
      {isActive(to) && <span className="absolute bottom-[-1px] left-[50%] translate-x-[-50%] w-[16px] h-[2px] bg-apple-blue rounded-full"/>}
    </Link>
  )

  const MobileLink = ({ to, label, icon }) => (
    <Link to={to}
      className={`flex items-center gap-14 px-14 py-12 rounded-xl text-[15px] font-medium transition-all duration-300 hover:no-underline
        ${isActive(to) ? 'text-apple-blue bg-apple-blue/[0.07]' : 'text-apple-dark/70 hover:text-apple-dark hover:bg-apple-gray'}`}>
      <Icon d={icon} className={`w-[20px] h-[20px] ${isActive(to) ? 'text-apple-blue' : 'text-apple-dark/40'}`}/>
      {label}
      {isActive(to) && <span className="ml-auto w-[6px] h-[6px] rounded-full bg-apple-blue"/>}
    </Link>
  )

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
          ${scrolled
            ? 'h-[56px] bg-white/80 backdrop-blur-2xl border-b border-apple-medium-gray/25 shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
            : 'h-[64px] bg-white/0'
          }`}
        role="navigation" aria-label="Navigation principale">

        <div className="w-full max-w-page mx-auto h-full px-24 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-8 hover:no-underline group shrink-0">
            <div className="w-[32px] h-[32px] rounded-[9px] bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shadow-[0_2px_8px_rgba(0,113,227,0.3)] transition-transform duration-300 group-hover:scale-105">
              <svg className="w-[16px] h-[16px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-[17px] font-semibold text-apple-dark tracking-[-0.3px]">
              Terrain<span className="text-apple-blue">Pro</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            {navItems.map(item => <DesktopLink key={item.to} {...item}/>)}
          </div>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-8">
            {user ? (
              <>
                <Link to="/reservation/new"
                  className="flex items-center gap-6 px-12 py-[7px] text-[13px] font-medium text-white bg-apple-blue rounded-full hover:bg-blue-700 hover:no-underline transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,113,227,0.35)] active:scale-[0.97]">
                  <Icon d={icons.newReservation} className="w-[15px] h-[15px] text-white"/>
                  Réserver
                </Link>

                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className={`group flex items-center gap-8 pl-6 pr-10 py-[4px] rounded-full border bg-transparent cursor-pointer transition-all duration-400
                      ${profileOpen ? 'border-apple-blue/30 shadow-[0_0_0_3px_rgba(0,113,227,0.1)]' : 'border-apple-medium-gray/40 hover:border-apple-medium-gray/70 hover:shadow-soft'}`}
                    style={{ background: profileOpen ? 'rgba(0,113,227,0.03)' : 'transparent' }}>
                    <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #0071e3 0%, #34aadc 100%)', boxShadow: '0 2px 8px rgba(0,113,227,0.25)' }}>
                      <span className="text-[11px] font-bold text-white tracking-[0.3px]">
                        {user.prenom?.[0]}{user.nom?.[0]}
                      </span>
                    </div>
                    <span className="text-[13px] font-medium text-apple-dark">{user.prenom}</span>
                    <Icon d={icons.chevron} className={`w-[12px] h-[12px] text-apple-dark/40 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}/>
                  </button>

                  {/* Dropdown */}
                  <div className={`absolute right-0 top-[calc(100%+8px)] w-[260px] rounded-[12px] border border-[rgba(0,0,0,0.06)]
                      transition-all duration-250 ease-[cubic-bezier(.2,0,.38,.9)] origin-top-right
                      ${profileOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-[0.96] -translate-y-1 pointer-events-none'}`}
                    style={{ background: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 30px -5px rgba(0,0,0,0.1)' }}>

                    {/* User info */}
                    <div className="flex items-center gap-12 px-16 py-14">
                      <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #0071e3, #34aadc)' }}>
                        <span className="text-[14px] font-bold text-white">{user.prenom?.[0]}{user.nom?.[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#1d1d1f] truncate">{user.prenom} {user.nom}</p>
                        <p className="text-[12px] text-[#86868b] truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="px-16 pb-12"><RoleBadge role={user.role}/></div>
                    <div className="h-px bg-[#f0f0f0]"/>

                    <div className="py-6 px-8">
                      {[
                        { to: '/profile',      icon: icons.profile,      label: 'Mon Profil' },
                        { to: '/reservations', icon: icons.reservations,  label: 'Mes Réservations' },
                        { to: '/matches',      icon: icons.matches,       label: 'Matchs Publics' },
                      ].map(item => (
                        <Link key={item.to} to={item.to}
                          className={`flex items-center gap-12 px-10 py-[10px] rounded-[8px] text-[13px] font-medium hover:no-underline transition-colors duration-150
                            ${isActive(item.to) ? 'text-[#0071e3] bg-[#0071e3]/[0.07]' : 'text-[#1d1d1f]/80 hover:bg-[#f5f5f7]'}`}>
                          <Icon d={item.icon} className={`w-[18px] h-[18px] shrink-0 ${isActive(item.to) ? 'text-[#0071e3]' : 'text-[#86868b]'}`}/>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-[#f0f0f0]"/>
                    <div className="px-8 py-6">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-12 px-10 py-[10px] rounded-[8px] text-[13px] font-medium text-[#ff453a] hover:bg-[#ff453a]/[0.06] bg-transparent border-none cursor-pointer transition-colors duration-150">
                        <Icon d={icons.logout} className="w-[18px] h-[18px] shrink-0"/>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="flex items-center gap-6 px-14 py-[7px] text-[13px] font-medium text-apple-dark/70 hover:text-apple-dark rounded-full hover:bg-apple-gray transition-all duration-300 hover:no-underline">
                  <Icon d={icons.login} className="w-[15px] h-[15px] text-apple-dark/40"/>
                  Connexion
                </Link>
                <Link to="/register"
                  className="flex items-center gap-6 px-14 py-[7px] text-[13px] font-medium text-white bg-apple-dark rounded-full hover:bg-apple-dark-2 hover:no-underline transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)] active:scale-[0.97]">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden relative w-[40px] h-[40px] flex items-center justify-center bg-transparent border-none cursor-pointer rounded-xl hover:bg-apple-gray transition-colors duration-300"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
            <div className="w-[18px] h-[14px] flex flex-col justify-between">
              <span className={`block w-full h-[1.5px] bg-apple-dark rounded-full transition-all duration-500 origin-center ${mobileOpen ? 'rotate-45 translate-y-[6.25px]' : ''}`}/>
              <span className={`block h-[1.5px] bg-apple-dark rounded-full transition-all duration-500 ${mobileOpen ? 'w-0 opacity-0' : 'w-[12px] opacity-100'}`}/>
              <span className={`block w-full h-[1.5px] bg-apple-dark rounded-full transition-all duration-500 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[6.25px]' : ''}`}/>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileOpen(false)}/>

      {/* Mobile panel */}
      <div className={`lg:hidden fixed top-0 right-0 z-50 w-[min(320px,85vw)] h-full bg-white/[0.97] backdrop-blur-2xl
          shadow-[-8px_0_30px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)]
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-20 h-[64px] border-b border-apple-medium-gray/20">
          <span className="text-[15px] font-semibold text-apple-dark">Menu</span>
          <button onClick={() => setMobileOpen(false)}
            className="w-[32px] h-[32px] rounded-full bg-apple-gray flex items-center justify-center border-none cursor-pointer hover:bg-apple-medium-gray/30 transition-colors duration-300">
            <svg className="w-[14px] h-[14px] text-apple-dark/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {user && (
          <div className="mx-16 mt-16 p-14 rounded-2xl bg-apple-gray/70 border border-apple-medium-gray/15">
            <div className="flex items-center gap-12">
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shrink-0">
                <span className="text-[15px] font-semibold text-white">{user.prenom?.[0]}{user.nom?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-apple-dark truncate">{user.prenom} {user.nom}</p>
                <p className="text-[11px] text-apple-dark/40 truncate">{user.email}</p>
              </div>
            </div>
            <div className="mt-10"><RoleBadge role={user.role}/></div>
          </div>
        )}

        <div className="px-12 mt-16 flex flex-col gap-2">
          {navItems.map((item, i) => (
            <div key={item.to} className="transition-all duration-500"
              style={{ transitionDelay: mobileOpen ? `${(i+1)*50}ms` : '0ms', opacity: mobileOpen ? 1 : 0, transform: mobileOpen ? 'translateX(0)' : 'translateX(20px)' }}>
              <MobileLink {...item}/>
            </div>
          ))}
        </div>

        {user && (
          <div className="px-16 mt-20">
            <Link to="/reservation/new"
              className="flex items-center justify-center gap-8 w-full py-12 text-[15px] font-semibold text-white bg-apple-blue rounded-xl hover:bg-blue-700 hover:no-underline transition-all duration-300 active:scale-[0.98] shadow-[0_2px_12px_rgba(0,113,227,0.3)]">
              <Icon d={icons.newReservation} className="w-[18px] h-[18px] text-white"/>
              Nouvelle Réservation
            </Link>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-16 pb-[max(20px,env(safe-area-inset-bottom))] pt-12 border-t border-apple-medium-gray/20 bg-white/80 backdrop-blur-xl">
          {user ? (
            <div className="flex gap-8">
              <Link to="/profile"
                className="flex-1 flex items-center justify-center gap-6 py-10 text-[13px] font-medium text-apple-dark/70 hover:text-apple-dark rounded-xl border border-apple-medium-gray/30 hover:bg-apple-gray hover:no-underline transition-all duration-300">
                <Icon d={icons.profile} className="w-[16px] h-[16px]"/>
                Profil
              </Link>
              <button onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-6 py-10 text-[13px] font-medium text-red-500 hover:text-red-600 rounded-xl border border-red-200/60 hover:bg-red-50 bg-transparent cursor-pointer transition-all duration-300">
                <Icon d={icons.logout} className="w-[16px] h-[16px]"/>
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex gap-8">
              <Link to="/login"
                className="flex-1 flex items-center justify-center py-10 text-[13px] font-medium text-apple-dark/70 hover:text-apple-dark rounded-xl border border-apple-medium-gray/30 hover:bg-apple-gray hover:no-underline transition-all duration-300">
                Connexion
              </Link>
              <Link to="/register"
                className="flex-1 flex items-center justify-center py-10 text-[13px] font-medium text-white bg-apple-dark rounded-xl hover:bg-apple-dark-2 hover:no-underline transition-all duration-300">
                S'inscrire
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
