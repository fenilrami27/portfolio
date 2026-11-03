import fallbackData from '../data/fallback.json'
import { profileData } from '../data/profile'
import { projectsData } from '../data/projects'
import { skillsData } from '../data/skills'
import { experienceData } from '../data/experience'
import { educationData } from '../data/education'
import { leadershipData } from '../data/leadership'
import { certificatesData, achievementsData, testimonialsData } from '../data/emptySections'
import { siteSettings } from '../data/settings'
import { competenciesData } from '../data/competencies'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const USE_LOCAL_DATA = import.meta.env.VITE_USE_LOCAL_DATA === 'true'

/**
 * Fetch helper with AbortController timeout and JSON parsing.
 */
async function fetchWithTimeout(endpoint, options = {}, timeoutMs = 8000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    })
    return res
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function getPortfolioBundle() {
  if (USE_LOCAL_DATA) {
    return fallbackData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/portfolio/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData
  } catch (err) {
    console.warn('Portfolio bundle API call failed, using fallback data:', err.message)
    return fallbackData
  }
}

export async function getProfile() {
  if (USE_LOCAL_DATA) {
    return fallbackData.profile || profileData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/profile/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.profile || profileData
  } catch (err) {
    console.warn('Profile API call failed, using fallback:', err.message)
    return fallbackData.profile || profileData
  }
}

export async function getSettings() {
  if (USE_LOCAL_DATA) {
    return fallbackData.settings || siteSettings
  }

  try {
    const res = await fetchWithTimeout('/api/v1/settings/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.settings || siteSettings
  } catch (err) {
    console.warn('Settings API call failed, using fallback:', err.message)
    return fallbackData.settings || siteSettings
  }
}

export async function getProjects() {
  if (USE_LOCAL_DATA) {
    return (fallbackData.projects || projectsData).filter((p) => p.isPublished)
  }

  try {
    const res = await fetchWithTimeout('/api/v1/projects/')
    if (res.ok) {
      return await res.json()
    }
    return (fallbackData.projects || projectsData).filter((p) => p.isPublished)
  } catch (err) {
    console.warn('Projects API call failed, using fallback:', err.message)
    return (fallbackData.projects || projectsData).filter((p) => p.isPublished)
  }
}

export async function getAllProjectsIncludingUnpublished() {
  if (USE_LOCAL_DATA) {
    return projectsData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/projects/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.projects || projectsData
  } catch {
    return fallbackData.projects || projectsData
  }
}

export async function getProject(slug) {
  if (USE_LOCAL_DATA) {
    const project = (fallbackData.projects || projectsData).find((p) => p.slug === slug)
    if (!project) {
      const error = new Error(`Project with slug "${slug}" not found`)
      error.status = 404
      throw error
    }
    return project
  }

  try {
    const res = await fetchWithTimeout(`/api/v1/projects/${slug}/`)
    if (res.ok) {
      return await res.json()
    }
    if (res.status === 404) {
      const error = new Error(`Project with slug "${slug}" not found`)
      error.status = 404
      throw error
    }
  } catch (err) {
    if (err.status === 404) throw err
  }

  // Graceful fallback lookup
  const fallbackProject = (fallbackData.projects || projectsData).find((p) => p.slug === slug)
  if (fallbackProject) {
    return fallbackProject
  }

  const notFoundErr = new Error(`Project with slug "${slug}" not found`)
  notFoundErr.status = 404
  throw notFoundErr
}

export async function getCompetencies() {
  if (USE_LOCAL_DATA) {
    return fallbackData.competencies || competenciesData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/competencies/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.competencies || competenciesData
  } catch (err) {
    console.warn('Competencies API call failed, using fallback:', err.message)
    return fallbackData.competencies || competenciesData
  }
}

export async function getSkills() {
  if (USE_LOCAL_DATA) {
    return fallbackData.skills || skillsData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/skills/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.skills || skillsData
  } catch (err) {
    console.warn('Skills API call failed, using fallback:', err.message)
    return fallbackData.skills || skillsData
  }
}

export async function getExperience() {
  if (USE_LOCAL_DATA) {
    return fallbackData.experience || experienceData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/experience/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.experience || experienceData
  } catch (err) {
    console.warn('Experience API call failed, using fallback:', err.message)
    return fallbackData.experience || experienceData
  }
}

export async function getEducation() {
  if (USE_LOCAL_DATA) {
    return fallbackData.education || educationData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/education/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.education || educationData
  } catch (err) {
    console.warn('Education API call failed, using fallback:', err.message)
    return fallbackData.education || educationData
  }
}

export async function getLeadership() {
  if (USE_LOCAL_DATA) {
    return fallbackData.leadership || leadershipData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/leadership/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.leadership || leadershipData
  } catch (err) {
    console.warn('Leadership API call failed, using fallback:', err.message)
    return fallbackData.leadership || leadershipData
  }
}

export async function getCertificates() {
  if (USE_LOCAL_DATA) {
    return fallbackData.certificates || certificatesData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/certificates/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.certificates || certificatesData
  } catch {
    return fallbackData.certificates || certificatesData
  }
}

export async function getHackathons() {
  if (USE_LOCAL_DATA) {
    return fallbackData.hackathons || []
  }

  try {
    const res = await fetchWithTimeout('/api/v1/hackathons/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.hackathons || []
  } catch {
    return fallbackData.hackathons || []
  }
}

export async function getAchievements() {
  if (USE_LOCAL_DATA) {
    return fallbackData.achievements || achievementsData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/achievements/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.achievements || achievementsData
  } catch {
    return fallbackData.achievements || achievementsData
  }
}

export async function getTestimonials() {
  if (USE_LOCAL_DATA) {
    return fallbackData.testimonials || testimonialsData
  }

  try {
    const res = await fetchWithTimeout('/api/v1/testimonials/')
    if (res.ok) {
      return await res.json()
    }
    return fallbackData.testimonials || testimonialsData
  } catch {
    return fallbackData.testimonials || testimonialsData
  }
}

export async function getFocusAreas() {
  if (USE_LOCAL_DATA) {
    return fallbackData.focusAreas || []
  }

  try {
    const res = await fetchWithTimeout('/api/v1/portfolio/')
    if (res.ok) {
      const data = await res.json()
      return data.focusAreas || fallbackData.focusAreas || []
    }
    return fallbackData.focusAreas || []
  } catch {
    return fallbackData.focusAreas || []
  }
}

export async function getStats() {
  if (USE_LOCAL_DATA) {
    return fallbackData.stats || []
  }

  try {
    const res = await fetchWithTimeout('/api/v1/portfolio/')
    if (res.ok) {
      const data = await res.json()
      return data.stats || fallbackData.stats || []
    }
    return fallbackData.stats || []
  } catch {
    return fallbackData.stats || []
  }
}

export async function getJourney() {
  if (USE_LOCAL_DATA) {
    return fallbackData.journey || []
  }

  try {
    const res = await fetchWithTimeout('/api/v1/portfolio/')
    if (res.ok) {
      const data = await res.json()
      return data.journey || fallbackData.journey || []
    }
    return fallbackData.journey || []
  } catch {
    return fallbackData.journey || []
  }
}

/**
 * Submit contact message to Django backend
 */
export async function submitContact(payload) {
  if (USE_LOCAL_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    if (payload.website_hp) {
      return { success: true, message: 'Thank you! Your message has been sent successfully.' }
    }
    return { success: true, message: 'Thank you! Your message has been sent successfully.' }
  }

  const res = await fetchWithTimeout('/api/v1/contact/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      website_hp: payload.website_hp || '',
      turnstile_token: payload.turnstile_token || payload.turnstileToken || '',
    }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const errorMsg =
      data.detail ||
      data.message ||
      (data.name && data.name[0]) ||
      (data.email && data.email[0]) ||
      (data.message && data.message[0]) ||
      'Failed to send message. Please reach out directly via email.'
    throw new Error(errorMsg)
  }

  return data
}
