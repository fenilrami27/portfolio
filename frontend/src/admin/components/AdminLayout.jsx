import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  Folder,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Mail,
  Sparkles,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext'
import { adminApi } from '../services/adminService'
import { useTheme } from '../../context/ThemeContext'

export function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAdminAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Fetch unread count for badge
  useEffect(() => {
    if (!isAuthenticated) return
    adminApi
      .getDashboardStats()
      .then((data) => {
        if (data && data.counts) {
          setUnreadCount(data.counts.unread_messages || data.counts.unreadMessages || 0)
        }
      })
      .catch(() => {})
  }, [isAuthenticated, location.pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="font-mono text-xs text-gray-400">Loading Back-Office...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: Folder },
    { name: 'Competencies', path: '/admin/competencies', icon: Sparkles },
    { name: 'Skills', path: '/admin/skills', icon: Code2 },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#111622] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
            FR
          </div>
          <span className="font-bold text-sm text-white">Fenil Rami Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile overlay) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0E131F] border-r border-white/10 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-extrabold text-black text-sm shadow-lg shadow-emerald-500/20">
              FR
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Fenil Rami</h1>
              <p className="text-[11px] font-mono text-emerald-400">Back-Office Suite</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-black">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0B0F17]/50 space-y-3">
          <div className="flex items-center gap-3">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name || 'Fenil Rami'}
                className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                FR
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Fenil Rami'}</p>
              <p className="text-[11px] text-gray-400 truncate">@{user?.username || 'Admin'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </a>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#0E131F]/80 backdrop-blur border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-emerald-400 capitalize">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Public Site</span>
            </a>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2.5">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={user.name || 'Fenil Rami'}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500/30"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                  FR
                </div>
              )}
              <span className="text-xs font-semibold text-white">{user?.name || 'Fenil Rami'}</span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
