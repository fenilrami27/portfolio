import React, { useState, useEffect, useRef } from 'react'
import {
  Upload,
  Trash2,
  Save,
  FileText,
  ExternalLink,
  Plus,
  X,
  Sparkles,
} from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'
import { useAdminAuth } from '../context/AdminAuthContext'

export default function AdminProfilePage() {
  const { addToast } = useAdminToast()
  const { refreshUser } = useAdminAuth()
  const fileInputRef = useRef(null)
  const resumeInputRef = useRef(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingResume, setIsUploadingResume] = useState(false)

  // Profile fields
  const [fullName, setFullName] = useState('')
  const [headline, setHeadline] = useState('')
  const [statement, setStatement] = useState('')
  const [supportingLine, setSupportingLine] = useState('')
  const [about, setAbout] = useState('')
  const [location, setLocation] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [showEmail, setShowEmail] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState('open_to_work')
  const [availabilityNote, setAvailabilityNote] = useState('')

  // Photo
  const [photoUrl, setPhotoUrl] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [removePhoto, setRemovePhoto] = useState(false)

  // Inlines
  const [roles, setRoles] = useState([])
  const [newRole, setNewRole] = useState('')
  const [socials, setSocials] = useState([])

  // Resume
  const [resumeInfo, setResumeInfo] = useState(null)
  const [resumeNote, setResumeNote] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await adminApi.getProfile()
        if (data) {
          setFullName(data.full_name || data.fullName || '')
          setHeadline(data.headline || '')
          setStatement(data.statement || '')
          setSupportingLine(data.supporting_line || data.supportingLine || '')
          setAbout(data.about || '')
          setLocation(data.location || '')
          setEmail(data.email || '')
          setPhone(data.phone || '')
          setShowEmail(data.show_email ?? data.showEmail ?? true)
          setShowPhone(data.show_phone ?? data.showPhone ?? false)
          setAvailabilityStatus(data.availability_status || data.availabilityStatus || 'open_to_work')
          setAvailabilityNote(data.availability_note || data.availabilityNote || '')
          setPhotoUrl(data.photo_url || data.photoUrl || null)
          setRoles(data.roles || [])
          setSocials(data.socials || [])
          setResumeInfo(data.resume_info || data.resumeInfo || null)
        }
      } catch (err) {
        addToast(err.message || 'Failed to load profile details', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [addToast])

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WebP)', 'error')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      addToast('Photo must be less than 8 MB', 'error')
      return
    }

    setPhotoFile(file)
    setRemovePhoto(false)
    const previewUrl = URL.createObjectURL(file)
    setPhotoPreview(previewUrl)
    addToast('Photo ready for preview. Click "Save Profile" to apply.')
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setPhotoUrl(null)
    setRemovePhoto(true)
    addToast('Profile photo marked for removal. Click "Save Profile" to apply.')
  }

  const handleAddRole = (e) => {
    e.preventDefault()
    if (!newRole.trim()) return
    if (!roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()])
    }
    setNewRole('')
  }

  const handleRemoveRole = (roleToRemove) => {
    setRoles(roles.filter((r) => r !== roleToRemove))
  }

  const handleAddSocial = () => {
    setSocials([
      ...socials,
      { platform: 'LinkedIn', label: 'LinkedIn', url: '', order: socials.length + 1, is_visible: true },
    ])
  }

  const handleUpdateSocial = (index, field, value) => {
    const updated = [...socials]
    updated[index][field] = value
    setSocials(updated)
  }

  const handleRemoveSocial = (index) => {
    setSocials(socials.filter((_, i) => i !== index))
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      addToast('Please upload a PDF file only', 'error')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('Resume must be under 5 MB', 'error')
      return
    }

    setIsUploadingResume(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('note', resumeNote || 'Uploaded via Admin Profile')

    try {
      const res = await adminApi.uploadResume(formData)
      setResumeInfo({
        url: '/api/v1/resume/',
        file_name: res.fileName || res.file_name || file.name,
        uploaded_at: new Date().toISOString(),
      })
      addToast('New resume version uploaded and activated successfully!')
      setResumeNote('')
    } catch (err) {
      addToast(err.message || 'Failed to upload resume', 'error')
    } finally {
      setIsUploadingResume(false)
      if (resumeInputRef.current) resumeInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append('full_name', fullName)
    formData.append('headline', headline)
    formData.append('statement', statement)
    formData.append('supporting_line', supportingLine)
    formData.append('about', about)
    formData.append('location', location)
    formData.append('email', email)
    formData.append('phone', phone)
    formData.append('show_email', showEmail)
    formData.append('show_phone', showPhone)
    formData.append('availability_status', availabilityStatus)
    formData.append('availability_note', availabilityNote)
    formData.append('roles', JSON.stringify(roles))
    formData.append('socials', JSON.stringify(socials))

    if (photoFile) {
      formData.append('photo', photoFile)
    }
    if (removePhoto) {
      formData.append('remove_photo', 'true')
    }

    try {
      const updated = await adminApi.updateProfile(formData)
      setPhotoUrl(updated.photo_url || updated.photoUrl || null)
      setPhotoPreview(null)
      setPhotoFile(null)
      setRemovePhoto(false)
      addToast('Profile changes saved! Public site updated immediately.')
      await refreshUser()
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded-xl" />
        <div className="h-96 bg-white/5 rounded-2xl" />
      </div>
    )
  }

  const currentDisplayPhoto = photoPreview || photoUrl

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile &amp; Personal Details
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Edit your hero statement, biography, contact information, profile avatar, and active resume.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Photo & Availability Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Management Card */}
          <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 flex flex-col items-center text-center">
            <h2 className="text-sm font-bold text-white mb-4">Profile Portrait Photo</h2>

            <div className="relative group mb-4">
              {currentDisplayPhoto ? (
                <img
                  src={currentDisplayPhoto}
                  alt={fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500/30 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-mono">No Photo</span>
                </div>
              )}

              {/* Hover badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-semibold text-white transition-opacity"
              >
                Change Photo
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />

            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 transition-colors"
              >
                Upload / Replace
              </button>
              {currentDisplayPhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed max-w-xs">
              Recommended: high-resolution portrait (minimum 600x600px). Formats: JPG, PNG, WebP (max 8 MB).
            </p>
          </div>

          {/* Availability Status Card */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Availability &amp; Job Status Pill</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'open_to_work', label: 'Open to Work', color: 'emerald' },
                { value: 'freelance', label: 'Available for Freelance', color: 'blue' },
                { value: 'not_available', label: 'Not Available', color: 'gray' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    availabilityStatus === opt.value
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                      : 'bg-black/20 border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  <input
                    type="radio"
                    name="availabilityStatus"
                    value={opt.value}
                    checked={availabilityStatus === opt.value}
                    onChange={(e) => setAvailabilityStatus(e.target.value)}
                    className="accent-emerald-500"
                  />
                  <span className="text-xs font-semibold">{opt.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Availability Note (Tooltip / Description)
              </label>
              <input
                type="text"
                value={availabilityNote}
                onChange={(e) => setAvailabilityNote(e.target.value)}
                placeholder="e.g. Immediately available for full-time backend roles and internships."
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            {/* Resume Upload Box */}
            <div className="pt-3 border-t border-white/5">
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Active Resume PDF (Powers the site&apos;s &quot;Download Resume&quot; button)
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/30 border border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {resumeInfo?.file_name || resumeInfo?.fileName || 'Fenil_Rami_Resume.pdf'}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {resumeInfo?.uploaded_at
                        ? `Uploaded ${new Date(resumeInfo.uploaded_at).toLocaleDateString()}`
                        : 'Active version ready'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/v1/resume/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={isUploadingResume}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingResume ? 'Uploading...' : 'Upload New PDF'}</span>
                  </button>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Personal Information */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-5">
          <h2 className="text-sm font-bold text-white">General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Fenil Rami"
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Professional Title / Headline
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Python Backend & Full Stack Developer"
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ahmedabad, Gujarat, India"
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fenilrami2704@gmail.com"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9978643380"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
              <input
                type="checkbox"
                checked={showEmail}
                onChange={(e) => setShowEmail(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Display email address publicly</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-300">
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Display phone number publicly</span>
            </label>
          </div>
        </div>

        {/* Biography & Statements */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">Hero Statements &amp; About Text</h2>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Hero Pitch (Short Bio / Statement)
            </label>
            <textarea
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Concise 1-2 sentence hero statement."
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Supporting Sub-line</label>
            <input
              type="text"
              value={supportingLine}
              onChange={(e) => setSupportingLine(e.target.value)}
              placeholder="e.g. Python Developer Intern at Vibe Tech Labs."
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Comprehensive About Text</label>
            <textarea
              rows={5}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Detailed biographical paragraphs rendered in the About section."
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
            />
          </div>
        </div>

        {/* Roles Sought Chips */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">Roles Sought (Displayed in Hero Pill Carousel)</h2>

          <div className="flex flex-wrap gap-2 mb-2">
            {roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
              >
                <span>{role}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="hover:text-red-400 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Backend Developer"
              className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
            />
            <button
              type="button"
              onClick={handleAddRole}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-xl border border-white/10 transition-colors"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Social Links Manager */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">Social &amp; Professional Links</h2>
            <button
              type="button"
              onClick={handleAddSocial}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {socials.map((s, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-black/20 border border-white/5 items-center"
              >
                <div>
                  <input
                    type="text"
                    value={s.platform || ''}
                    onChange={(e) => handleUpdateSocial(idx, 'platform', e.target.value)}
                    placeholder="Platform (e.g. LinkedIn)"
                    className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="url"
                    value={s.url || ''}
                    onChange={(e) => handleUpdateSocial(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.is_visible ?? true}
                      onChange={(e) => handleUpdateSocial(idx, 'is_visible', e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span>Show</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
