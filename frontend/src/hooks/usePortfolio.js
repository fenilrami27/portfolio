import { useQuery, useMutation } from '@tanstack/react-query'
import * as api from '../services/portfolioService'
import fallbackData from '../data/fallback.json'

const retryConfig = {
  retry: 2,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  staleTime: 1000 * 60 * 5, // 5 minutes
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    placeholderData: fallbackData.profile,
    ...retryConfig,
  })
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
    placeholderData: fallbackData.settings,
    ...retryConfig,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    placeholderData: fallbackData.projects,
    ...retryConfig,
  })
}

export function useProject(slug) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProject(slug),
    placeholderData: () => fallbackData.projects?.find((p) => p.slug === slug),
    enabled: Boolean(slug),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: api.getSkills,
    placeholderData: fallbackData.skills,
    ...retryConfig,
  })
}

export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: api.getExperience,
    placeholderData: fallbackData.experience,
    ...retryConfig,
  })
}

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: api.getEducation,
    placeholderData: fallbackData.education,
    ...retryConfig,
  })
}

export function useLeadership() {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: api.getLeadership,
    placeholderData: fallbackData.leadership,
    ...retryConfig,
  })
}

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: api.getCertificates,
    placeholderData: fallbackData.certificates,
    ...retryConfig,
  })
}

export function useHackathons() {
  return useQuery({
    queryKey: ['hackathons'],
    queryFn: api.getHackathons,
    placeholderData: fallbackData.hackathons,
    ...retryConfig,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: api.getAchievements,
    placeholderData: fallbackData.achievements,
    ...retryConfig,
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: api.getTestimonials,
    placeholderData: fallbackData.testimonials,
    ...retryConfig,
  })
}

export function useFocusAreas() {
  return useQuery({
    queryKey: ['focusAreas'],
    queryFn: api.getFocusAreas,
    placeholderData: fallbackData.focusAreas,
    ...retryConfig,
  })
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    placeholderData: fallbackData.stats,
    ...retryConfig,
  })
}

export function useJourney() {
  return useQuery({
    queryKey: ['journey'],
    queryFn: api.getJourney,
    placeholderData: fallbackData.journey,
    ...retryConfig,
  })
}

export function useContactMutation() {
  return useMutation({
    mutationFn: api.submitContact,
  })
}
