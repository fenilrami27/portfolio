import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Edit, Code2, X } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminSkillsPage() {
  const { addToast } = useAdminToast()
  const [skillGroups, setSkillGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Skill modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [groupName, setGroupName] = useState('Backend')
  const [name, setName] = useState('')
  const [iconKey, setIconKey] = useState('SiDjango')
  const [level, setLevel] = useState('comfortable')
  const [isVisible, setIsVisible] = useState(true)
  const [order, setOrder] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Delete modal
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadSkills = useCallback(async () => {
    try {
      const data = await adminApi.getSkills()
      setSkillGroups(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load skills', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadSkills()
  }, [loadSkills])

  const openCreateModal = (groupId = null, defaultGroupName = 'Backend') => {
    setEditingSkill(null)
    setSelectedGroupId(groupId || (skillGroups[0]?.id || ''))
    setGroupName(defaultGroupName)
    setName('')
    setIconKey('SiPython')
    setLevel('comfortable')
    setIsVisible(true)
    setOrder(1)
    setIsModalOpen(true)
  }

  const openEditModal = (skill, groupId) => {
    setEditingSkill(skill)
    setSelectedGroupId(groupId)
    setName(skill.name || '')
    setIconKey(skill.icon_key || skill.iconKey || 'LuCode')
    setLevel(skill.level || 'comfortable')
    setIsVisible(skill.is_visible ?? skill.isVisible ?? true)
    setOrder(skill.order || 0)
    setIsModalOpen(true)
  }

  const handleSaveSkill = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      group_id: selectedGroupId || undefined,
      group_name: groupName,
      name,
      icon_key: iconKey,
      level,
      is_visible: isVisible,
      order,
    }

    try {
      if (editingSkill) {
        await adminApi.updateSkill(editingSkill.id, payload)
        addToast('Skill updated successfully!')
      } else {
        await adminApi.createSkill(payload)
        addToast('New skill added!')
      }
      setIsModalOpen(false)
      loadSkills()
    } catch (err) {
      addToast(err.message || 'Failed to save skill', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteSkill(deleteId)
      addToast('Skill removed.')
      setDeleteId(null)
      loadSkills()
    } catch (err) {
      addToast(err.message || 'Failed to delete skill', 'error')
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
            Skills &amp; Technologies
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Group, organize, reorder and show/hide technical proficiencies.
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skill Groups */}
      <div className="space-y-6">
        {skillGroups.map((group) => (
          <div
            key={group.id}
            className="p-6 rounded-3xl bg-[#111622] border border-white/10 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">{group.name}</h2>
                <span className="text-xs font-mono text-gray-500">
                  ({(group.skills || []).length} skills)
                </span>
              </div>

              <button
                onClick={() => openCreateModal(group.id, group.name)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add in {group.name}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {(group.skills || []).map((skill) => {
                const isVis = skill.is_visible ?? skill.isVisible ?? true
                return (
                  <div
                    key={skill.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isVis
                        ? 'bg-black/30 border-white/10 hover:border-emerald-500/30'
                        : 'bg-black/10 border-white/5 opacity-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{skill.name}</p>
                      <span className="text-[10px] font-mono text-emerald-400 capitalize">
                        {skill.level || 'comfortable'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(skill, group.id)}
                        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5"
                        title="Edit skill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(skill.id)}
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
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
              {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
            </h3>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Skill Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                >
                  {skillGroups.map((g) => (
                    <option key={g.id} value={g.id} className="bg-[#111622] text-white">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Django REST Framework"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Icon Key</label>
                <input
                  type="text"
                  value={iconKey}
                  onChange={(e) => setIconKey(e.target.value)}
                  placeholder="e.g. SiDjango, SiPython, SiReact, LuDatabase"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Proficiency Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                >
                  <option value="daily" className="bg-[#111622]">Daily use (Core)</option>
                  <option value="comfortable" className="bg-[#111622]">Comfortable</option>
                  <option value="learning" className="bg-[#111622]">Currently Learning</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Show publicly</span>
                </label>
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
                  {isSaving ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Skill"
        message="Are you sure you want to remove this skill from the portfolio?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
