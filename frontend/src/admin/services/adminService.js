/**
 * Admin API service client with token authentication and error handling.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

function getAuthHeaders(isMultipart = false) {
  const token = localStorage.getItem('fenil_admin_token')
  const headers = {
    Accept: 'application/json',
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }
  return headers
}

async function handleResponse(res) {
  if (res.status === 204) {
    return true
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const errorMsg = data.detail || data.error || (data.message ? data.message : 'Request failed')
    const error = new Error(errorMsg)
    error.status = res.status
    error.data = data
    throw error
  }
  return data
}

export const adminApi = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return handleResponse(res)
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/auth/me/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/admin/auth/logout/`, {
        method: 'POST',
        headers: getAuthHeaders(),
      })
    } finally {
      localStorage.removeItem('fenil_admin_token')
      localStorage.removeItem('fenil_admin_user')
    }
  },

  changePassword: async (old_password, new_password) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/auth/change-password/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ old_password, new_password }),
    })
    return handleResponse(res)
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Profile
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/profile/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  updateProfile: async (formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/profile/`, {
      method: 'PATCH',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },

  uploadResume: async (formData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/resume/`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData,
    })
    return handleResponse(res)
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/projects/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createProject: async (formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/projects/`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },

  updateProject: async (id, formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/projects/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/projects/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Skills
  getSkills: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/skills/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createSkill: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/skills/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  updateSkill: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/skills/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteSkill: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/skills/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Competencies
  getCompetencies: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/competencies/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createCompetency: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/competencies/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  updateCompetency: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/competencies/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteCompetency: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/competencies/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Experience
  getExperience: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/experience/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createExperience: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/experience/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  updateExperience: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/experience/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteExperience: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/experience/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Education
  getEducation: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/education/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createEducation: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/education/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  updateEducation: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/education/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteEducation: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/education/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Certificates
  getCertificates: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/certificates/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createCertificate: async (formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/certificates/`, {
      method: 'POST',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },

  updateCertificate: async (id, formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/certificates/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },

  deleteCertificate: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/certificates/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Achievements & Hackathons
  getAchievements: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/achievements/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  createAchievement: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/achievements/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  updateAchievement: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/achievements/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteAchievement: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/achievements/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  updateHackathon: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/hackathons/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(res)
  },

  deleteHackathon: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/hackathons/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Messages Inbox
  getMessages: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/messages/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  toggleMessageRead: async (id, is_read) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/messages/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_read }),
    })
    return handleResponse(res)
  },

  deleteMessage: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/messages/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  // Site Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/settings/`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(res)
  },

  updateSettings: async (formData) => {
    const isFormData = formData instanceof FormData
    const res = await fetch(`${API_BASE_URL}/api/v1/admin/settings/`, {
      method: 'PATCH',
      headers: getAuthHeaders(isFormData),
      body: isFormData ? formData : JSON.stringify(formData),
    })
    return handleResponse(res)
  },
}
