import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Folder,
  Code2,
  Mail,
  Briefcase,
  Plus,
  User,
  ExternalLink,
  CheckCircle2,
  Circle,
  Trash2,
  Eye,
} from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminDashboardPage() {
  const { addToast } = useAdminToast()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteMsgId, setDeleteMsgId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const stats = await adminApi.getDashboardStats()
      setData(stats)
    } catch (err) {
      addToast(err.message || 'Failed to load dashboard statistics', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleToggleRead = async (msgId, currentRead) => {
    try {
      await adminApi.toggleMessageRead(msgId, !currentRead)
      addToast(`Message marked as ${!currentRead ? 'read' : 'unread'}`)
      loadStats()
    } catch (err) {
      addToast(err.message || 'Failed to update message', 'error')
    }
  }

  const handleDeleteMessage = async () => {
    if (!deleteMsgId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteMessage(deleteMsgId)
      addToast('Message deleted successfully')
      setDeleteMsgId(null)
      loadStats()
    } catch (err) {
      addToast(err.message || 'Failed to delete message', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-60 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  const counts = data?.counts || {}
  const completeness = data?.completeness || { score: 0, checklist: [] }
  const recentMessages = data?.recentMessages || data?.recent_messages || []
  const recentProjects = data?.recentProjects || data?.recent_projects || []

  return (
    <div className="space-y-8">
      {/* Top Banner / Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Content Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage profile copy, projects, live skills, resume PDF, and incoming recruiter messages.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>

          <Link
            to="/admin/profile"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            <User className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </Link>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium border border-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Public Site</span>
          </a>
        </div>
      </div>

      {/* Quick Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="p-5 rounded-2xl bg-[#111622] border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Projects</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Folder className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 mb-1">
            {counts.published_projects ?? counts.publishedProjects ?? counts.projects ?? 0}
            <span className="text-xs font-normal text-gray-400 ml-1.5">
              / {counts.projects ?? 0} total
            </span>
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Published &amp; live on portfolio
          </p>
        </div>

        {/* Skills */}
        <div className="p-5 rounded-2xl bg-[#111622] border border-white/10 relative overflow-hidden group hover:border-teal-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Skills</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 mb-1">{counts.skills ?? 0}</p>
          <p className="text-[11px] text-gray-400">Across Backend, Frontend &amp; DB</p>
        </div>

        {/* Experience */}
        <div className="p-5 rounded-2xl bg-[#111622] border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Experience</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 mb-1">{counts.experience ?? 0}</p>
          <p className="text-[11px] text-gray-400">Work positions &amp; internships</p>
        </div>

        {/* Unread Inbound Messages */}
        <div className="p-5 rounded-2xl bg-[#111622] border border-white/10 relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Inbound Messages</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3 mb-1">
            {counts.unread_messages ?? counts.unreadMessages ?? 0}
            <span className="text-xs font-normal text-gray-400 ml-1.5">
              / {counts.messages ?? 0} total
            </span>
          </p>
          <p className="text-[11px] text-amber-400 font-medium">
            {counts.unread_messages ?? counts.unreadMessages ?? 0} unread recruiter inquiries
          </p>
        </div>
      </div>

      {/* Profile Completeness Checklist */}
      <div className="p-6 rounded-3xl bg-[#111622] border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Profile Completeness</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {completeness.score}%
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Ensure all key sections, photo, resume PDF, and projects are configured for optimal presentation.
            </p>
          </div>

          <Link
            to="/admin/profile"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Complete Missing Items &rarr;
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/40 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${completeness.score}%` }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {completeness.checklist?.map((item) => (
            <div
              key={item.key}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                item.completed
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                  : 'bg-white/5 border-white/5 text-gray-400'
              }`}
            >
              {item.completed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-500 shrink-0" />
              )}
              <span className="truncate font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Recent Inquiries & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Recent Inbound Messages</span>
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All ({counts.messages || 0}) &rarr;
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <Mail className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs">No messages received yet.</p>
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    msg.is_read || msg.isRead
                      ? 'bg-white/5 border-white/5 text-gray-300'
                      : 'bg-emerald-950/20 border-emerald-500/30 text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-xs font-bold">{msg.name}</span>
                      <span className="text-[11px] text-gray-400 ml-2">{msg.email}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">
                      {new Date(msg.created_at || msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed mb-2.5">
                    {msg.message}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                    <button
                      onClick={() => handleToggleRead(msg.id, msg.is_read ?? msg.isRead)}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      {msg.is_read || msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    </button>
                    <button
                      onClick={() => setDeleteMsgId(msg.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Projects Overview */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Folder className="w-4 h-4 text-emerald-400" />
              <span>Project Catalog Overview</span>
            </h3>
            <Link
              to="/admin/projects"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Manage All &rarr;
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentProjects.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        p.is_published ?? p.isPublished
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {p.is_published ?? p.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{p.one_liner || p.oneLiner}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/projects/${p.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                    title="Preview public case study"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/admin/projects"
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteMsgId}
        title="Delete Inbound Message"
        message="Are you sure you want to delete this message? This action is permanent."
        confirmLabel="Delete Message"
        isLoading={isDeleting}
        onConfirm={handleDeleteMessage}
        onClose={() => setDeleteMsgId(null)}
      />
    </div>
  )
}
