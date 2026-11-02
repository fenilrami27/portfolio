import React, { useState, useEffect } from 'react'
import { Save, Settings } from 'lucide-react'
import { adminApi } from '../services/adminService'
import { useAdminToast } from '../components/AdminToast'

export default function AdminSettingsPage() {
  const { addToast } = useAdminToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fields
  const [siteTitle, setSiteTitle] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [contactHeading, setContactHeading] = useState('')
  const [contactText, setContactText] = useState('')
  const [footerText, setFooterText] = useState('')
  const [canonicalUrl, setCanonicalUrl] = useState('')
  const [buildingTitle, setBuildingTitle] = useState('')
  const [buildingText, setBuildingText] = useState('')
  const [buildingStatus, setBuildingStatus] = useState('In progress')

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await adminApi.getSettings()
        if (data) {
          setSiteTitle(data.site_title || data.siteTitle || '')
          setSeoTitle(data.seo_title || data.seoTitle || '')
          setSeoDescription(data.seo_description || data.seoDescription || '')
          setContactHeading(data.contact_heading || data.contactHeading || '')
          setContactText(data.contact_text || data.contactText || '')
          setFooterText(data.footer_text || data.footerText || '')
          setCanonicalUrl(data.canonical_url || data.canonicalUrl || '')
          setBuildingTitle(data.currently_building_title || data.currentlyBuildingTitle || '')
          setBuildingText(data.currently_building_text || data.currentlyBuildingText || '')
          setBuildingStatus(data.currently_building_status || data.currentlyBuildingStatus || 'In progress')
        }
      } catch (err) {
        addToast(err.message || 'Failed to load settings', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [addToast])

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      site_title: siteTitle,
      seo_title: seoTitle,
      seo_description: seoDescription,
      contact_heading: contactHeading,
      contact_text: contactText,
      footer_text: footerText,
      canonical_url: canonicalUrl,
      currently_building_title: buildingTitle,
      currently_building_text: buildingText,
      currently_building_status: buildingStatus,
    }

    try {
      await adminApi.updateSettings(payload)
      addToast('Site settings updated! Public site updated immediately.')
    } catch (err) {
      addToast(err.message || 'Failed to save settings', 'error')
    } finally {
      setIsSaving(false)
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
            Site &amp; SEO Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Global metadata, Open Graph sharing cards, footer text, and contact banners.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO & Titles */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Search Engine Optimization &amp; Brand</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Default Site Title
              </label>
              <input
                type="text"
                required
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Fenil Rami · Portfolio"
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Fenil Rami · Python Backend & Full Stack Developer"
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              SEO Meta Description (150-160 characters recommended)
            </label>
            <textarea
              rows={2}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Portfolio of Fenil Rami, Python Backend & Full Stack Developer..."
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Canonical URL
            </label>
            <input
              type="url"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              placeholder="https://fenilrami.com"
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 font-mono"
            />
          </div>
        </div>

        {/* Contact & Footer Copy */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">Contact &amp; Footer Copy</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Contact Section Heading
              </label>
              <input
                type="text"
                value={contactHeading}
                onChange={(e) => setContactHeading(e.target.value)}
                placeholder="Let's build something reliable."
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Contact Section Subtext
              </label>
              <input
                type="text"
                value={contactText}
                onChange={(e) => setContactText(e.target.value)}
                placeholder="Open to Python Backend and Full Stack roles."
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Footer Biography Summary
            </label>
            <textarea
              rows={3}
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="Python Backend & Full Stack Developer specializing in role-based business web applications..."
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
            />
          </div>
        </div>

        {/* Currently Building Badge */}
        <div className="p-6 rounded-3xl bg-[#111622] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white">Currently Building Badge</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Project Title / Feature
              </label>
              <input
                type="text"
                value={buildingTitle}
                onChange={(e) => setBuildingTitle(e.target.value)}
                placeholder="HR University Django Backend"
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Status Badge</label>
              <input
                type="text"
                value={buildingStatus}
                onChange={(e) => setBuildingStatus(e.target.value)}
                placeholder="In progress"
                className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={buildingText}
              onChange={(e) => setBuildingText(e.target.value)}
              placeholder="Short description of what you are currently engineering..."
              className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500/80 leading-relaxed"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
