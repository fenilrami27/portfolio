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

function PageFallback() {
  return (
    <Container className="py-20 space-y-6">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </Container>
  )
}

export const router = createBrowserRouter([
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
