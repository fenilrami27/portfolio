import React, { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { Container } from '../components/ui/Container'
import { Skeleton } from '../components/ui/Skeleton'

const Home = lazy(() => import('../pages/Home'))
const Projects = lazy(() => import('../pages/Projects'))
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'))
const Resume = lazy(() => import('../pages/Resume'))
const NotFound = lazy(() => import('../pages/NotFound'))

// Admin back-office pages (lazy loaded)
const AdminLayout = lazy(() =>
  import('../admin/components/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
const AdminLoginPage = lazy(() => import('../admin/pages/AdminLoginPage'))
const AdminDashboardPage = lazy(() => import('../admin/pages/AdminDashboardPage'))
const AdminProfilePage = lazy(() => import('../admin/pages/AdminProfilePage'))
const AdminProjectsPage = lazy(() => import('../admin/pages/AdminProjectsPage'))
const AdminCompetenciesPage = lazy(() => import('../admin/pages/AdminCompetenciesPage'))
const AdminSkillsPage = lazy(() => import('../admin/pages/AdminSkillsPage'))
const AdminExperiencePage = lazy(() => import('../admin/pages/AdminExperiencePage'))
const AdminEducationPage = lazy(() => import('../admin/pages/AdminEducationPage'))
const AdminCertificatesPage = lazy(() => import('../admin/pages/AdminCertificatesPage'))
const AdminAchievementsPage = lazy(() => import('../admin/pages/AdminAchievementsPage'))
const AdminMessagesPage = lazy(() => import('../admin/pages/AdminMessagesPage'))
const AdminSettingsPage = lazy(() => import('../admin/pages/AdminSettingsPage'))

function PageFallback() {
  return (
    <Container className="py-20 space-y-6">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </Container>
  )
}

function AdminFallback() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        <span className="font-mono text-xs text-gray-400">Loading Back-Office...</span>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  // Admin Login (Standalone)
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<AdminFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },

  // Admin Portal Suite
  {
    path: '/admin',
    element: (
      <Suspense fallback={<AdminFallback />}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'competencies',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminCompetenciesPage />
          </Suspense>
        ),
      },
      {
        path: 'skills',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminSkillsPage />
          </Suspense>
        ),
      },
      {
        path: 'experience',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminExperiencePage />
          </Suspense>
        ),
      },
      {
        path: 'education',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminEducationPage />
          </Suspense>
        ),
      },
      {
        path: 'certificates',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminCertificatesPage />
          </Suspense>
        ),
      },
      {
        path: 'achievements',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminAchievementsPage />
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<AdminFallback />}>
            <AdminSettingsPage />
          </Suspense>
        ),
      },
    ],
  },

  // Public Website Pages
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Projects />
          </Suspense>
        ),
      },
      {
        path: 'projects/:slug',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ProjectDetail />
          </Suspense>
        ),
      },
      {
        path: 'resume',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Resume />
          </Suspense>
        ),
      },
      {
        path: '404',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])
