import React from 'react'
import Head from '@docusaurus/Head'
import {PageMetadata} from '@docusaurus/theme-common'
import LayoutProvider from '@theme/Layout/Provider'
import '@fontsource-variable/inter'
import {silicon} from '../components/landing/content/silicon'
import LandingNav from '../components/landing/core/LandingNav'
import MotionProvider from '../components/landing/motion/MotionProvider'
import HeroSection from '../components/landing/sections/HeroSection'
import ProductSection from '../components/landing/sections/ProductSection'
import {NetworkSection, ArchitectureSection} from '../components/landing/sections/DiagramSection'
import SecuritySection from '../components/landing/sections/SecuritySection'
import InstallSection from '../components/landing/sections/InstallSection'
import FinalCTA, {LandingFooter} from '../components/landing/sections/FinalCTA'
import '../css/landing/tokens.css'
import '../css/landing/landing.css'
import '../css/landing/motion.css'

export default function Home() {
  const title = 'Silicon — Hybrid hosting for your own servers and the cloud'
  return <LayoutProvider>
    <PageMetadata description={silicon.description} />
    <Head><title>{title}</title><meta property="og:title" content={title} /><meta name="twitter:title" content={title} /></Head>
    <div className="silicon-landing">
      <a className="landing-skip" href="#landing-main">Skip to content</a>
      <MotionProvider>
        <LandingNav brand={silicon} links={silicon.navigation} />
        <main id="landing-main" tabIndex="-1">
          <HeroSection product={silicon} />
          {silicon.chapters.map(chapter => <ProductSection key={chapter.id} chapter={chapter} />)}
          <ProductSection chapter={silicon.aws} wide />
          <NetworkSection content={silicon.network} />
          <ArchitectureSection content={silicon.architecture} />
          <SecuritySection content={silicon.security} />
          <InstallSection content={silicon.install} />
          <FinalCTA product={silicon} />
        </main>
        <LandingFooter product={silicon} />
      </MotionProvider>
    </div>
  </LayoutProvider>
}
