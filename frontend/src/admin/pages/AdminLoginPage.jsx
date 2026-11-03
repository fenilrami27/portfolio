import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, ArrowRight, Key, CheckCircle2 } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminLoginPage() {
  const { login, changePassword, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Password change modal state
  const [showChangeModal, setShowChangeModal] = useState(false)
  const [changeOldPass, setChangeOldPass] = useState('')
  const [changeNewPass, setChangeNewPass] = useState('')
  const [changeSuccess, setChangeSuccess] = useState('')
  const [changeError, setChangeError] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  if (isAuthenticated) {
    navigate('/admin', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please verify your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setChangeError('')
    setChangeSuccess('')
    setIsChanging(true)
    try {
      await changePassword(changeOldPass, changeNewPass)
      setChangeSuccess('Password updated successfully! You can now log in with your new password.')
      setPassword(changeNewPass)
      setTimeout(() => setShowChangeModal(false), 2000)
    } catch (err) {
      setChangeError(err.message || 'Failed to change password.')
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Monogram brand header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 mx-auto flex items-center justify-center font-black text-black text-xl shadow-xl shadow-emerald-500/20 mb-4">
            FR
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Fenil Rami</h1>
          <p className="text-xs font-mono text-emerald-400 mt-1 uppercase tracking-widest">
            Portfolio Administration Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Sign In</h2>
            <p className="text-xs text-gray-400 mt-1">
              Enter your administrative credentials to manage portfolio content.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 leading-relaxed animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5" htmlFor="admin-username">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="fenil"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300" htmlFor="admin-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(true)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Change Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-11 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/80 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-gray-400 hover:text-gray-200 absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mt-6 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Back-Office</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Portfolio v2.0</span>
            <a href="/" className="hover:text-emerald-400 transition-colors">
              Return to Website &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111622] border border-white/10 rounded-2xl p-6 max-w-sm w-full relative text-left">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Update Password</h3>
            </div>

            {changeError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-200">
                {changeError}
              </div>
            )}
            {changeSuccess && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={changeOldPass}
                  onChange={(e) => setChangeOldPass(e.target.value)}
                  placeholder="Current password"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  value={changeNewPass}
                  onChange={(e) => setChangeNewPass(e.target.value)}
                  placeholder="New password"
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChanging}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isChanging ? 'Updating...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
