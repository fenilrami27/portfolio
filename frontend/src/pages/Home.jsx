import React from 'react'
import { Helmet } from 'react-helmet-async'
import {
  useProfile,
  useProjects,
  useSkills,
  useExperience,
  useEducation,
  useLeadership,
  useCertificates,
  useHackathons,
  useAchievements,
  useTestimonials,
  useSettings,
  useFocusAreas,
  useStats,
  useJourney,
} from '../hooks/usePortfolio'
import { HeroSection } from '../components/sections/HeroSection'
import { OverviewSection } from '../components/sections/OverviewSection'
import { FeaturedWorkSection } from '../components/sections/FeaturedWorkSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { JourneySection } from '../components/sections/JourneySection'
import { LeadershipSection } from '../components/sections/LeadershipSection'
import {
  CertificatesSection,
  HackathonsSection,
  AchievementsSection,
  TestimonialsSection,
} from '../components/sections/HiddenWhenEmptySection'
import { ContactSection } from '../components/sections/ContactSection'
import { Skeleton } from '../components/ui/Skeleton'
import { Container } from '../components/ui/Container'

export default function Home() {
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { data: projects = [], isLoading: isProjectsLoading } = useProjects()
  const { data: skills = [], isLoading: isSkillsLoading } = useSkills()
  const { data: experience = [] } = useExperience()
  const { data: education = [] } = useEducation()
  const { data: leadership = [] } = useLeadership()
  const { data: certificates = [] } = useCertificates()
  const { data: hackathons = [] } = useHackathons()
  const { data: achievements = [] } = useAchievements()
  const { data: testimonials = [] } = useTestimonials()
  const { data: settings } = useSettings()
  const { data: focusAreas = [] } = useFocusAreas()
  const { data: stats = [] } = useStats()
  const { data: journey = [] } = useJourney()

  if (!profile && (isProfileLoading || isProjectsLoading || isSkillsLoading)) {
    return (
      <Container className="py-24 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-16 w-3/4 rounded-xl" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="md:col-span-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </Container>
    )
  }

  return (
    <>
      <Helmet>
        <title>{settings?.seoTitle || 'Fenil Rami | Python Backend & Full Stack Developer'}</title>
        <meta
          name="description"
          content={
            settings?.seoDescription ||
            'Portfolio of Fenil Rami, Python Backend & Full Stack Developer building role-based business web apps with Django and React.'
          }
        />
      </Helmet>

      {/* 1. Hero */}
      <HeroSection profile={profile} />

      {/* 2. Overview */}
      <OverviewSection
        profile={profile}
        projects={projects}
        settings={settings}
        focusAreas={focusAreas}
        stats={stats}
      />

      {/* 3. Featured Work */}
      <FeaturedWorkSection projects={projects} />

      {/* 4. Skills */}
      <SkillsSection skills={skills} />

      {/* 5. Journey */}
      <JourneySection experience={experience} education={education} journey={journey} />

      {/* 6. Leadership */}
      <LeadershipSection leadership={leadership} />

      {/* 7. Hidden when empty sections */}
      <CertificatesSection certificates={certificates} />
      <HackathonsSection hackathons={hackathons} />
      <AchievementsSection achievements={achievements} />
      <TestimonialsSection testimonials={testimonials} />

      {/* 8. Contact */}
      <ContactSection profile={profile} settings={settings} />
    </>
  )
}
