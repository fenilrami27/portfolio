import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit, Briefcase, X } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminExperiencePage() {
  const { addToast } = useAdminToast()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('Jun 2026')
  const [endDate, setEndDate] = useState('Present')
  const [isCurrent, setIsCurrent] = useState(true)
  const [bulletsText, setBulletsText] = useState('')
  const [order, setOrder] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Delete
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getExperience()
      setItems(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load experience', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreateModal = () => {
    setEditingItem(null)
    setCompany('Vibe Tech Labs')
    setRole('Python Developer Intern')
    setLocation('Ahmedabad, India')
    setStartDate('Jun 2026')
    setEndDate('Present')
    setIsCurrent(true)
    setBulletsText('')
    setOrder(items.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setCompany(item.company || '')
    setRole(item.role || '')
    setLocation(item.location || '')
    setStartDate(item.start_date || item.start || '')
    setEndDate(item.end_date || item.end || '')
    setIsCurrent(item.is_current ?? item.current ?? false)
    setBulletsText((item.bullets || []).join('\n'))
    setOrder(item.order || 1)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const bullets = bulletsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean)

    const payload = {
      company,
      role,
      location,
      start_date: startDate,
      end_date: isCurrent ? 'Present' : endDate,
      is_current: isCurrent,
      bullets,
      order,
    }

    try {
      if (editingItem) {
        await adminApi.updateExperience(editingItem.id, payload)
        addToast('Experience updated successfully!')
      } else {
        await adminApi.createExperience(payload)
        addToast('New experience entry added!')
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to save experience', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteExperience(deleteId)
      addToast('Experience entry deleted.')
      setDeleteId(null)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to delete experience', 'error')
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Work Experience &amp; Internships
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage company roles, timelines, and accomplishments displayed on the Experience section and Resume.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {/* Experience list */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-[#111622] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-white">{item.role}</h3>
                  <span className="text-xs font-semibold text-emerald-400">@ {item.company}</span>
                  {(item.is_current || item.current) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-gray-400 mb-3">
                  {item.start_date || item.start} &mdash; {item.end_date || item.end} &bull;{' '}
                  {item.location}
                </p>

                <ul className="space-y-1.5 text-xs text-gray-300">
                  {(item.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
                title="Edit position"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="Delete position"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">
              {editingItem ? 'Edit Experience' : 'Add Experience Entry'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Vibe Tech Labs"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Python Developer Intern"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ahmedabad, India"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. Jun 2026"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Currently working here</span>
                </label>

                {!isCurrent && (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End Date (e.g. Dec 2026)"
                      className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Bullet Points (one accomplishment per line)
                </label>
                <textarea
                  rows={4}
                  value={bulletsText}
                  onChange={(e) => setBulletsText(e.target.value)}
                  placeholder="Developed multi-company pharmaceutical ERP frontend in React...&#10;Integrated REST API endpoints and state management..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed font-mono"
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
                  {isSaving ? 'Saving...' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Position"
        message="Are you sure you want to delete this experience record? It will be removed from your resume and experience section."
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
