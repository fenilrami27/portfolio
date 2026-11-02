import { useQuery, useMutation } from '@tanstack/react-query'
import * as api from '../services/portfolioService'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.getProjects,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProject(slug) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => api.getProject(slug),
    enabled: Boolean(slug),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: api.getSkills,
    staleTime: 1000 * 60 * 5,
  })
}

export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: api.getExperience,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: api.getEducation,
    staleTime: 1000 * 60 * 5,
  })
}

export function useLeadership() {
  return useQuery({
    queryKey: ['leadership'],
    queryFn: api.getLeadership,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCertificates() {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: api.getCertificates,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: api.getAchievements,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: api.getTestimonials,
    staleTime: 1000 * 60 * 5,
  })
}

export function useContactMutation() {
  return useMutation({
    mutationFn: api.submitContact,
  })
}
