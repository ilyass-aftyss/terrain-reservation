import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7]/30 mt-auto">
      <div className="max-w-content mx-auto px-24 py-48">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-32 mb-48">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-8 mb-14">
              <div className="w-[28px] h-[28px] rounded-[8px] bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center">
                <svg className="w-[14px] h-[14px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-apple-dark">
                Terrain<span className="text-apple-blue">Pro</span>
              </span>
            </div>
            <p className="text-[13px] text-apple-dark/50 leading-relaxed">
              La plateforme SaaS de réservation de terrains de football au Maroc.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold text-apple-dark/35 uppercase tracking-wider mb-14">Navigation</h4>
            <ul className="flex flex-col gap-10">
              {[
                { to: '/terrains',     label: 'Terrains' },
                { to: '/matches',      label: 'Matchs Publics' },
                { to: '/reservations', label: 'Réservations' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13px] text-apple-dark/50 hover:text-apple-dark transition-colors duration-250 hover:no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h4 className="text-[11px] font-semibold text-apple-dark/35 uppercase tracking-wider mb-14">Compte</h4>
            <ul className="flex flex-col gap-10">
              {[
                { to: '/login',    label: 'Connexion' },
                { to: '/register', label: 'Inscription' },
                { to: '/profile',  label: 'Mon Profil' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13px] text-apple-dark/50 hover:text-apple-dark transition-colors duration-250 hover:no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h4 className="text-[11px] font-semibold text-apple-dark/35 uppercase tracking-wider mb-14">Informations</h4>
            <ul className="flex flex-col gap-10">
              <li><span className="text-[13px] text-apple-dark/50">Commission : 10%</span></li>
              <li><span className="text-[13px] text-apple-dark/50">Terrains 5×5 et 7×7</span></li>
              <li><span className="text-[13px] text-apple-dark/50">PDF & QR Code inclus</span></li>
              <li><span className="text-[13px] text-apple-dark/50">Multi-rôles JWT</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#d2d2d7]/30 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="text-[12px] text-apple-dark/30">© 2026 TerrainPro. Tous droits réservés.</p>
            <div className="flex gap-24">
              <span className="text-[12px] text-apple-dark/30">Conditions d'utilisation</span>
              <span className="text-[12px] text-apple-dark/30">Politique de confidentialité</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
