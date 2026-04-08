import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await login(email, password)
      if (user.role === 'ADMIN')     navigate('/admin')
      else if (user.role === 'PRESIDENT') navigate('/dashboard')
      else navigate('/terrains')
    } catch { /* error handled by store */ }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-24 py-96 bg-white">
      <div className="w-full max-w-[400px] animate-fade-up">

        {/* Logo mark */}
        <div className="flex justify-center mb-32">
          <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center shadow-[0_4px_16px_rgba(0,113,227,0.3)]">
            <svg className="w-[24px] h-[24px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        <div className="text-center mb-40">
          <h1 className="text-[28px] font-bold text-apple-dark mb-8 tracking-tight">Connexion</h1>
          <p className="text-[16px] text-apple-dark/50">Accédez à votre espace TerrainPro</p>
        </div>

        {error && (
          <div className="mb-24 p-14 bg-red-50 border border-red-200/60 rounded-[12px] text-[14px] text-red-700 flex items-center gap-8">
            <svg className="w-[16px] h-[16px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-16">
          <div>
            <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-16 py-[13px] bg-apple-gray border border-apple-medium-gray/40 rounded-[10px] text-[16px] text-apple-dark placeholder:text-apple-dark/30 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent focus:bg-white transition-all duration-250"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-apple-dark/60 mb-6">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-16 py-[13px] pr-[44px] bg-apple-gray border border-apple-medium-gray/40 rounded-[10px] text-[16px] text-apple-dark placeholder:text-apple-dark/30 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent focus:bg-white transition-all duration-250"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-[12px] top-1/2 -translate-y-1/2 text-apple-dark/30 hover:text-apple-dark/60 transition-colors border-none bg-transparent cursor-pointer"
              >
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {showPwd
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary !w-full !py-[14px] !text-[16px] mt-8"
          >
            {loading
              ? <span className="flex items-center justify-center gap-8">
                  <svg className="w-[16px] h-[16px] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Connexion…
                </span>
              : 'Se connecter'
            }
          </button>
        </form>

        <p className="text-center text-[14px] text-apple-dark/50 mt-28">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-apple-blue font-medium hover:underline">
            S'inscrire
          </Link>
        </p>

        {/* Demo accounts hint */}
        <div className="mt-32 p-16 bg-apple-gray rounded-[12px] border border-apple-medium-gray/20">
          <p className="text-[12px] font-semibold text-apple-dark/40 uppercase tracking-wider mb-10">Comptes de test</p>
          <div className="space-y-4 text-[12px] text-apple-dark/50 font-mono">
            <p>joueur@test.com / password</p>
            <p>president@test.com / password</p>
            <p>admin@test.com / admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
