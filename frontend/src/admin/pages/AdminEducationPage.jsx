import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit3, GraduationCap, X } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminEducationPage() {
  const { addToast } = useAdminToast()
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [institution, setInstitution] = useState('')
  const [degree, setDegree] = useState('')
  const [startYear, setStartYear] = useState('2023')
  const [endYear, setEndYear] = useState('2027')
  const [grade, setGrade] = useState('')
  const [order, setOrder] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Delete
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getEducation()
      setItems(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load education', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreateModal = () => {
    setEditingItem(null)
    setInstitution('Gandhinagar University')
    setDegree('Bachelor of Information Technology')
    setStartYear('2023')
    setEndYear('2027')
    setGrade('')
    setOrder(items.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setInstitution(item.institution || '')
    setDegree(item.degree || '')
    setStartYear(item.start_year || item.start || '')
    setEndYear(item.end_year || item.end || '')
    setGrade(item.grade_label || item.grade || '')
    setOrder(item.order || 1)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      institution,
      degree,
      start_year: startYear,
      end_year: endYear,
      grade_label: grade,
      order,
    }

    try {
      if (editingItem) {
        await adminApi.updateEducation(editingItem.id, payload)
        addToast('Education updated!')
      } else {
        await adminApi.createEducation(payload)
        addToast('Education record added!')
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to save education', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteEducation(deleteId)
      addToast('Education record deleted.')
      setDeleteId(null)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to delete education', 'error')
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Education</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Degree, university, timeline, and grading displayed on the public resume.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-[#111622] border border-white/10 shadow-xl flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-white mb-0.5">{item.degree}</h3>
                <p className="text-xs font-semibold text-emerald-400 mb-1">{item.institution}</p>
                <p className="text-xs font-mono text-gray-400">
                  {item.start_year || item.start} &mdash; {item.end_year || item.end}
                  {(item.grade_label || item.grade) && ` • ${item.grade_label || item.grade}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEditModal(item)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(item.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
              {editingItem ? 'Edit Education' : 'Add Education Record'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. Bachelor of Information Technology"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Institution / University
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Gandhinagar University"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Start Year</label>
                  <input
                    type="text"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    placeholder="2023"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">End Year</label>
                  <input
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    placeholder="2027"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Grade / CGPA (optional)
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Grade A"
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
                  {isSaving ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Education Record"
        message="Are you sure you want to remove this education record?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
