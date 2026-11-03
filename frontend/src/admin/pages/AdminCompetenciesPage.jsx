import React, { useState, useEffect, useCallback } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Sparkles,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  LuBrain,
  LuCpu,
  LuBoxes,
  LuEye,
  LuNetwork,
  LuUsers,
  LuKanban,
  LuShieldCheck,
  LuCode,
  LuLayers,
} from 'react-icons/lu'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

const ICON_MAP = {
  LuBrain,
  LuCpu,
  LuBoxes,
  LuEye,
  LuNetwork,
  LuUsers,
  LuKanban,
  LuShieldCheck,
  LuCode,
  LuLayers,
}

export default function AdminCompetenciesPage() {
  const { addToast } = useAdminToast()

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form Fields
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [description, setDescription] = useState('')
  const [iconKey, setIconKey] = useState('LuBrain')
  const [order, setOrder] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // Delete State
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadItems = useCallback(async () => {
    try {
      const data = await adminApi.getCompetencies()
      setItems(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load competencies', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const openCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setCode('')
    setFullName('')
    setDescription('')
    setIconKey('LuBrain')
    setOrder(items.length + 1)
    setIsVisible(true)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setTitle(item.title || '')
    setCode(item.code || '')
    setFullName(item.full_name || item.fullName || '')
    setDescription(item.description || '')
    setIconKey(item.icon_key || item.iconKey || 'LuBrain')
    setOrder(item.order || 0)
    setIsVisible(item.is_visible ?? item.isVisible ?? true)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      title,
      code,
      full_name: fullName,
      description,
      icon_key: iconKey,
      order: Number(order),
      is_visible: isVisible,
    }

    try {
      if (editingItem) {
        await adminApi.updateCompetency(editingItem.id, payload)
        addToast('Competency updated successfully!')
      } else {
        await adminApi.createCompetency(payload)
        addToast('New competency created successfully!')
      }
      setIsModalOpen(false)
      loadItems()
    } catch (err) {
      addToast(err.message || 'Failed to save competency', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteCompetency(deleteId)
      addToast('Competency deleted successfully.')
      setDeleteId(null)
      loadItems()
    } catch (err) {
      addToast(err.message || 'Failed to delete competency', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleVisible = async (item) => {
    const nextVal = !(item.is_visible ?? item.isVisible)
    try {
      await adminApi.updateCompetency(item.id, { is_visible: nextVal })
      addToast(`"${item.title}" is now ${nextVal ? 'visible' : 'hidden'}.`)
      loadItems()
    } catch (err) {
      addToast(err.message || 'Failed to update visibility', 'error')
    }
  }

  const handleReorder = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= items.length) return

    const itemA = items[index]
    const itemB = items[newIdx]

    try {
      await adminApi.updateCompetency(itemA.id, { order: itemB.order || newIdx + 1 })
      await adminApi.updateCompetency(itemB.id, { order: itemA.order || index + 1 })
      loadItems()
    } catch {
      addToast('Failed to reorder items', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            Core Competencies
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage the Core Competencies highlighted on your portfolio (AI, AML, ML, Computer Vision, CN, Team Leadership, Project Management).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Competency
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-40 bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-[#111622] rounded-2xl border border-white/10">
          <p className="text-gray-400 text-sm mb-4">No competencies configured yet.</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-emerald-500 text-gray-950 rounded-xl font-semibold text-sm"
          >
            Create first competency
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const IconComp = ICON_MAP[item.icon_key || item.iconKey] || LuBrain
            return (
              <div
                key={item.id}
                className="bg-[#111622] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-white">{item.title}</h3>
                        {item.full_name && item.full_name !== item.title && (
                          <span className="text-xs font-mono text-emerald-400/80">
                            {item.full_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleVisible(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      title={item.is_visible ? 'Hide from public site' : 'Show on public site'}
                    >
                      {item.is_visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleReorder(index, 'up')}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => handleReorder(index, 'down')}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-gray-400"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-[10px] text-gray-500 ml-1">
                      #{item.order}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingItem ? 'Edit Core Competency' : 'Add Core Competency'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                  Card Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence (AI)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                    Short Code / Abbr
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI, AML, CN"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                    Full Name Expansion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                  Area Description (one short line) <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe the area objectively..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                    Icon Identifier
                  </label>
                  <select
                    value={iconKey}
                    onChange={(e) => setIconKey(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a2233] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LuBrain">LuBrain (AI)</option>
                    <option value="LuCpu">LuCpu (AML / Hardware)</option>
                    <option value="LuBoxes">LuBoxes (ML)</option>
                    <option value="LuEye">LuEye (Computer Vision)</option>
                    <option value="LuNetwork">LuNetwork (Computer Networks)</option>
                    <option value="LuUsers">LuUsers (Team Leadership)</option>
                    <option value="LuKanban">LuKanban (Project Management)</option>
                    <option value="LuShieldCheck">LuShieldCheck (Security / RBAC)</option>
                    <option value="LuCode">LuCode (General Code)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-mono text-gray-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="comp_visible"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="rounded bg-white/5 border-white/10 text-emerald-500"
                />
                <label htmlFor="comp_visible" className="text-sm text-gray-300">
                  Visible on public site
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 text-sm font-semibold"
                >
                  {isSaving ? 'Saving...' : 'Save Competency'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ConfirmModal
          isOpen={Boolean(deleteId)}
          title="Delete Core Competency"
          message="Are you sure you want to delete this competency card? It will be immediately removed from the public website."
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
