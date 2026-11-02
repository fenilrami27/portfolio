import React from 'react'
import { Helmet } from 'react-helmet-async'
import { LuArrowLeft, LuFileQuestion } from 'react-icons/lu'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Fenil Rami</title>
        <meta name="description" content="The requested page could not be found." />
      </Helmet>

      <section className="py-24 md:py-36 flex items-center justify-center">
        <Container className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-border flex items-center justify-center mx-auto mb-6 text-accent-1 dark:text-accent-2">
            <LuFileQuestion className="w-10 h-10" aria-hidden="true" />
          </div>

          <p className="font-mono text-xs uppercase tracking-wider text-accent-1 dark:text-accent-2 mb-2 font-semibold">
            404 Error
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text mb-4">
            Page not found
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-8">
            The page or project case study you requested does not exist or has been relocated.
          </p>

          <Button
            to="/"
            variant="primary"
            size="md"
            leftIcon={<LuArrowLeft className="w-4 h-4" aria-hidden="true" />}
          >
            Return to homepage
          </Button>
        </Container>
      </section>
    </>
  )
}
