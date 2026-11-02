import { profileData } from '../data/profile'
import { projectsData } from '../data/projects'
import { skillsData } from '../data/skills'
import { experienceData } from '../data/experience'
import { educationData } from '../data/education'
import { leadershipData } from '../data/leadership'
import { certificatesData, achievementsData, testimonialsData } from '../data/emptySections'
import { siteSettings } from '../data/settings'

// Base URL for future Part 2 API integration
const _API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Helper to simulate slight async resolution in local development
const delay = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getProfile() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/profile/`)
  await delay()
  return { ...profileData }
}

export async function getSettings() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/settings/`)
  await delay()
  return { ...siteSettings }
}

export async function getProjects() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/projects/`)
  await delay()
  // Return all published projects, ordered by sort order
  return projectsData
    .filter((p) => p.isPublished)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

export async function getAllProjectsIncludingUnpublished() {
  await delay()
  return [...projectsData]
}

export async function getProject(slug) {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/projects/${slug}/`)
  await delay()
  const project = projectsData.find((p) => p.slug === slug && p.isPublished)
  if (!project) {
    const error = new Error(`Project with slug "${slug}" not found`)
    error.status = 404
    throw error
  }
  return { ...project }
}

export async function getSkills() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/skills/`)
  await delay()
  return [...skillsData]
}

export async function getExperience() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/experience/`)
  await delay()
  return [...experienceData]
}

export async function getEducation() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/education/`)
  await delay()
  return [...educationData]
}

export async function getLeadership() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/leadership/`)
  await delay()
  return [...leadershipData]
}

export async function getCertificates() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/certificates/`)
  await delay()
  return [...certificatesData]
}

export async function getAchievements() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/achievements/`)
  await delay()
  return [...achievementsData]
}

export async function getTestimonials() {
  // TODO(Part 2): fetch(`${API_BASE_URL}/api/testimonials/`)
  await delay()
  return [...testimonialsData]
}

/**
 * Submit contact form message
 * In Part 1, this validates client-side and returns a mock success response after 600ms.
 * In Part 2, this will send an HTTP POST to Django backend contact endpoint.
 */
export async function submitContact(payload) {
  // Simulated network latency
  await delay(600)

  // Honeypot check
  if (payload.website_hp) {
    // Silently reject bot submissions
    return { success: true, message: 'Message sent successfully.' }
  }

  if (!payload.name || !payload.name.trim()) {
    throw new Error('Name is required.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!payload.email || !emailRegex.test(payload.email.trim())) {
    throw new Error('A valid email address is required.')
  }

  if (!payload.message || payload.message.trim().length < 10) {
    throw new Error('Message must be at least 10 characters long.')
  }

  // TODO(Part 2): replace with the real API call
  // const res = await fetch(`${API_BASE_URL}/api/contact/`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  // if (!res.ok) throw new Error('Failed to send message')
  // return await res.json()

  return {
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
  }
}
