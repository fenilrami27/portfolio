import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminProjectsPage() {
  const { addToast } = useAdminToast()
  const coverInputRef = useRef(null)

  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [oneLiner, setOneLiner] = useState('')
  const [description, setDescription] = useState('')
  const [role, setRole] = useState('')
  const [type, setType] = useState('Full Stack')
  const [tier, setTier] = useState('featured')
  const [status, setStatus] = useState('In progress')
  const [liveUrl, setLiveUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [stackStr, setStackStr] = useState('')
  const [order, setOrder] = useState(0)

  // Cover image
  const [coverUrl, setCoverUrl] = useState(null)
  const [coverFile, setPhotoFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [removeCover, setRemoveCover] = useState(false)

  // Delete State
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadProjects = useCallback(async () => {
    try {
      const data = await adminApi.getProjects()
      setProjects(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load projects', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const openCreateModal = () => {
    setEditingProject(null)
    setTitle('')
    setSlug('')
    setOneLiner('')
    setDescription('')
    setRole('Full Stack Developer')
    setType('Full Stack')
    setTier('featured')
    setStatus('In progress')
    setLiveUrl('')
    setGithubUrl('https://github.com/fenilrami27')
    setIsPublished(true)
    setIsFeatured(false)
    setStackStr('Python, Django, React')
    setOrder(projects.length + 1)
    setCoverUrl(null)
    setPhotoFile(null)
    setCoverPreview(null)
    setRemoveCover(false)
    setIsModalOpen(true)
  }

  const openEditModal = (p) => {
    setEditingProject(p)
    setTitle(p.title || '')
    setSlug(p.slug || '')
    setOneLiner(p.one_liner || p.oneLiner || '')
    setDescription(p.description || '')
    setRole(p.role || 'Developer')
    setType(p.type || 'Full Stack')
    setTier(p.tier || 'featured')
    setStatus(p.status || 'Completed')
    setLiveUrl(p.live_url || p.liveUrl || '')
    setGithubUrl(p.github_url || p.githubUrl || '')
    setIsPublished(p.is_published ?? p.isPublished ?? true)
    setIsFeatured(p.is_featured ?? p.isFeatured ?? false)
    setStackStr((p.stack || []).join(', '))
    setOrder(p.order || 0)
    setCoverUrl(p.cover_url || p.coverUrl || null)
    setPhotoFile(null)
    setCoverPreview(null)
    setRemoveCover(false)
    setIsModalOpen(true)
  }

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error')
      return
    }
    setPhotoFile(file)
    setRemoveCover(false)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleTogglePublish = async (p) => {
    const nextVal = !(p.is_published ?? p.isPublished)
    try {
      await adminApi.updateProject(p.id, { is_published: nextVal })
      addToast(`Project "${p.title}" is now ${nextVal ? 'published' : 'hidden'}`)
      loadProjects()
    } catch (err) {
      addToast(err.message || 'Failed to update visibility', 'error')
    }
  }

  const handleReorder = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= projects.length) return

    const itemA = projects[index]
    const itemB = projects[newIdx]

    try {
      await adminApi.updateProject(itemA.id, { order: itemB.order || newIdx + 1 })
      await adminApi.updateProject(itemB.id, { order: itemA.order || index + 1 })
      loadProjects()
    } catch {
      addToast('Failed to reorder projects', 'error')
    }
  }

  const handleSaveProject = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append('title', title)
    if (slug) formData.append('slug', slug)
    formData.append('one_liner', oneLiner)
    formData.append('description', description)
    formData.append('role', role)
    formData.append('type', type)
    formData.append('tier', tier)
    formData.append('status', status)
    formData.append('live_url', liveUrl)
    formData.append('github_url', githubUrl)
    formData.append('is_published', isPublished)
    formData.append('is_featured', isFeatured)
    formData.append('order', order)

    const stackArr = stackStr.split(',').map((s) => s.trim()).filter(Boolean)
    formData.append('stack', JSON.stringify(stackArr))

    if (coverFile) {
      formData.append('cover', coverFile)
    }
    if (removeCover) {
      formData.append('remove_cover', 'true')
    }

    try {
      if (editingProject) {
        await adminApi.updateProject(editingProject.id, formData)
        addToast('Project updated successfully!')
      } else {
        await adminApi.createProject(formData)
        addToast('New project created and published!')
      }
      setIsModalOpen(false)
      loadProjects()
    } catch (err) {
      addToast(err.message || 'Failed to save project', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteProject(deleteId)
      addToast('Project deleted successfully.')
      setDeleteId(null)
      loadProjects()
    } catch (err) {
      addToast(err.message || 'Failed to delete project', 'error')
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
            Projects Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Add, update case studies, upload cover photos, reorder, and toggle public visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List / Table */}
      <div className="bg-[#111622] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/5">
          {projects.map((p, idx) => {
            const isPub = p.is_published ?? p.isPublished
            const isFeat = p.is_featured ?? p.isFeatured
            return (
              <div
                key={p.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Order controls */}
                  <div className="flex flex-col gap-1 items-center justify-center pt-1">
                    <button
                      onClick={() => handleReorder(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-gray-400">{p.order ?? idx + 1}</span>
                    <button
                      onClick={() => handleReorder(idx, 'down')}
                      disabled={idx === projects.length - 1}
                      className="p-1 rounded text-gray-500 hover:text-white disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div className="w-16 h-12 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {p.cover_url || p.coverUrl ? (
                      <img
                        src={p.cover_url || p.coverUrl}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-gray-500 font-bold">COVER</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{p.title}</h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isPub ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {isPub ? 'Published' : 'Hidden'}
                      </span>
                      {isFeat && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">
                      {p.one_liner || p.oneLiner}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(p.stack || []).slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                      {(p.stack || []).length > 4 && (
                        <span className="text-[10px] text-gray-500">
                          +{p.stack.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      isPub
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isPub ? 'Hide from Site' : 'Show on Site'}
                  </button>

                  <a
                    href={`/projects/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                    title="View case study page"
                  >
                    <Eye className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
                    title="Edit project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[#111622] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 text-left shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">
              {editingProject ? 'Edit Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Fill in project details. Changes are updated in real-time.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CMHP Pharmaceutical ERP"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated if left blank"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Your Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Independent Frontend Developer"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Status</label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="e.g. Completed, In progress"
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  One-liner Pitch (Summary)
                </label>
                <textarea
                  rows={2}
                  required
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  placeholder="Concise overview of what the application does and the problem it solves."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  System Overview / Detailed Case Study
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed architecture description. Separate paragraphs with double newlines."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed font-mono"
                />
              </div>

              {/* Cover Image Upload Box */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Project Cover Image
                </label>
                <div className="flex items-center gap-4">
                  {(coverPreview || coverUrl) ? (
                    <div className="relative group w-24 h-16 rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={coverPreview || coverUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-500 text-[10px] font-mono">
                      No Cover
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{coverPreview || coverUrl ? 'Replace' : 'Upload Image'}</span>
                    </button>
                    {(coverPreview || coverUrl) && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null)
                          setCoverPreview(null)
                          setCoverUrl(null)
                          setRemoveCover(true)
                        }}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-white/5"
                        title="Remove cover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverSelect}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={stackStr}
                  onChange={(e) => setStackStr(e.target.value)}
                  placeholder="e.g. Python, Django, React, Redux, PostgreSQL"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    GitHub Repository Link
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Published publicly</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving && (
                    <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project"
        message="Are you sure you want to permanently delete this project? It will be removed from the public website immediately."
        confirmLabel="Delete Project"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
