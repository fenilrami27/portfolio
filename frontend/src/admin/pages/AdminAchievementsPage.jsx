import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Trophy, X } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminAchievementsPage() {
  const { addToast } = useAdminToast()

  const [achievements, setAchievements] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [kind, setKind] = useState('achievement')
  const [title, setTitle] = useState('')
  const [org, setOrg] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, kind }
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getAchievements()
      setAchievements(data.achievements || [])
      setHackathons(data.hackathons || [])
    } catch (err) {
      addToast(err.message || 'Failed to load achievements', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreateModal = (targetKind = 'achievement') => {
    setKind(targetKind)
    setTitle('')
    setOrg('')
    setDate('')
    setDescription('')
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      kind,
      title,
      event: title,
      organization: org,
      project_title: org,
      date,
      issued_on: date,
      description,
      is_visible: true,
    }

    try {
      await adminApi.createAchievement(payload)
      addToast(kind === 'hackathon' ? 'Hackathon added!' : 'Achievement added!')
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to save', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      if (deleteTarget.kind === 'hackathon') {
        await adminApi.deleteHackathon(deleteTarget.id)
      } else {
        await adminApi.deleteAchievement(deleteTarget.id)
      }
      addToast('Deleted successfully.')
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to delete', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-xl" />
        <div className="h-64 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Achievements &amp; Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Awards, competitive programming, and hackathon milestones. Hidden on public site when empty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openCreateModal('achievement')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Achievement</span>
          </button>
          <button
            onClick={() => openCreateModal('hackathon')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Hackathon</span>
          </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Honors &amp; Awards ({achievements.length})</span>
        </h2>

        {achievements.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#111622] border border-dashed border-white/10 text-center text-xs text-gray-400">
            No honors or awards recorded yet. Stays hidden on public site.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-[#111622] border border-white/10 shadow-xl flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{item.title}</h3>
                  <p className="text-xs text-emerald-400">{item.organization}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">{item.issued_on || item.date}</p>
                  {item.description && (
                    <p className="text-xs text-gray-300 mt-1">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: item.id, kind: 'achievement' })}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hackathons Section */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-purple-400" />
          <span>Hackathons ({hackathons.length})</span>
        </h2>

        {hackathons.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#111622] border border-dashed border-white/10 text-center text-xs text-gray-400">
            No hackathons recorded yet. Stays hidden on public site.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hackathons.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-3xl bg-[#111622] border border-white/10 shadow-xl flex items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{h.event || h.name}</h3>
                  <p className="text-xs text-purple-400">{h.result || 'Participant'}</p>
                  <p className="text-[11px] font-mono text-gray-400 mt-1">Project: {h.project_title || 'N/A'}</p>
                </div>
                <button
                  onClick={() => setDeleteTarget({ id: h.id, kind: 'hackathon' })}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full text-left shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              Add {kind === 'hackathon' ? 'Hackathon' : 'Achievement'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {kind === 'hackathon' ? 'Hackathon Event Name' : 'Achievement Title'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={kind === 'hackathon' ? 'e.g. Smart India Hackathon' : 'e.g. 1st Place Coding Contest'}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  {kind === 'hackathon' ? 'Project Title or Result' : 'Organization / Issuer'}
                </label>
                <input
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder={kind === 'hackathon' ? 'e.g. PharmaSync' : 'e.g. University Tech Council'}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Date / Year</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Oct 2026"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of accomplishment..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Item"
        message="Are you sure you want to remove this entry?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  )
}
