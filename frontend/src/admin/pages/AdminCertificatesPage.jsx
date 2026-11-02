import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Trash2, Edit3, Award, X, Upload, ExternalLink } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { ConfirmModal } from '../components/ConfirmModal'

export default function AdminCertificatesPage() {
  const { addToast } = useAdminToast()
  const fileInputRef = useRef(null)

  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [issuedOn, setIssuedOn] = useState('')
  const [credentialUrl, setCredentialUrl] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [file, setFile] = useState(null)
  const [order, setOrder] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Delete
  const [deleteId, setDeleteId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getCertificates()
      setItems(data || [])
    } catch (err) {
      addToast(err.message || 'Failed to load certificates', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const openCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setIssuer('')
    setIssuedOn('')
    setCredentialUrl('')
    setIsVisible(true)
    setFile(null)
    setOrder(items.length + 1)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setTitle(item.title || item.name || '')
    setIssuer(item.issuer || '')
    setIssuedOn(item.issued_on || item.date || '')
    setCredentialUrl(item.credential_url || '')
    setIsVisible(item.is_visible ?? item.isVisible ?? true)
    setFile(null)
    setOrder(item.order || 1)
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('issuer', issuer)
    formData.append('issued_on', issuedOn)
    formData.append('credential_url', credentialUrl)
    formData.append('is_visible', isVisible)
    formData.append('order', order)
    if (file) {
      formData.append('file', file)
    }

    try {
      if (editingItem) {
        await adminApi.updateCertificate(editingItem.id, formData)
        addToast('Certificate updated successfully!')
      } else {
        await adminApi.createCertificate(formData)
        addToast('New certificate added!')
      }
      setIsModalOpen(false)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to save certificate', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await adminApi.deleteCertificate(deleteId)
      addToast('Certificate deleted.')
      setDeleteId(null)
      loadData()
    } catch (err) {
      addToast(err.message || 'Failed to delete certificate', 'error')
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
            Certifications
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Upload certificates and verification credentials. Hidden on public site when empty.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#111622] border border-dashed border-white/10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Award className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Certificates Added Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            This section stays gracefully hidden on your public website until you add your first certificate.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20"
          >
            Add Your First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-[#111622] border border-white/10 shadow-xl flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white truncate">{item.title || item.name}</h3>
                  {!(item.is_visible ?? item.isVisible ?? true) && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-emerald-400 mb-0.5">{item.issuer}</p>
                <p className="text-[11px] font-mono text-gray-400">
                  {item.issued_on || item.date}
                </p>
                {item.credential_url && (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Verify Credential</span>
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
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
      )}

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
              {editingItem ? 'Edit Certificate' : 'Add Certificate'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Meta Backend Developer Specialization"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Coursera / Meta"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Issue Date</label>
                <input
                  type="text"
                  value={issuedOn}
                  onChange={(e) => setIssuedOn(e.target.value)}
                  placeholder="e.g. 2026 or Oct 2026"
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Credential Verification URL
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://coursera.org/verify/..."
                  className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Certificate Document / Image (optional)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{file ? file.name : 'Choose File'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Show on public portfolio</span>
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
                  {isSaving ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Certificate"
        message="Are you sure you want to remove this certificate?"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  )
}
