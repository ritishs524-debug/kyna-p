import { useEffect } from 'react'

interface SEOConfig {
  title: string
  description: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
}

const BASE_URL = 'https://kynaphysiotherapy.com'

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSEO({ title, description, canonical, ogTitle, ogDescription }: SEOConfig) {
  useEffect(() => {
    document.title = title

    setMeta('description', description)
    setMeta('og:title', ogTitle || title, 'property')
    setMeta('og:description', ogDescription || description, 'property')
    setMeta('twitter:title', ogTitle || title)
    setMeta('twitter:description', ogDescription || description)

    const canonicalUrl = canonical || `${BASE_URL}${window.location.pathname}`
    setCanonical(canonicalUrl)
    setMeta('og:url', canonicalUrl, 'property')
  }, [title, description, canonical, ogTitle, ogDescription])
}

// ── Page-specific SEO configs ──

export const pageSEO = {
  home: {
    title: 'KYNA Physiotherapy — Best Physiotherapy Clinic in Patiala, Punjab',
    description:
      'KYNA Physiotherapy is the leading physiotherapy clinic in Patiala, Punjab. Expert physiotherapists offering sports rehab, ortho & neuro physiotherapy, manual therapy, dry needling, cupping & women\'s health. Clinics in Patiala, Samana & Sangrur. Book a free consultation!',
  },
  about: {
    title: 'About KYNA Physiotherapy — Our Story, Mission & Approach | Patiala',
    description:
      'Learn about KYNA Physiotherapy\'s journey, our patient-first approach, advanced treatment methods and how Dr. Sorabh Sharma built Punjab\'s most trusted physiotherapy clinic chain in Patiala, Samana & Sangrur.',
  },
  services: {
    title: 'Physiotherapy Services in Patiala — Sports Rehab, Ortho, Neuro, Manual Therapy | KYNA',
    description:
      'Explore KYNA\'s physiotherapy services: sports rehabilitation, orthopaedic physiotherapy, neurological rehab, manual therapy, dry needling, cupping therapy, exercise therapy & women\'s health. Best physiotherapy in Patiala.',
  },
  reviews: {
    title: 'Patient Reviews & Testimonials — KYNA Physiotherapy Patiala',
    description:
      'Read real patient reviews of KYNA Physiotherapy Patiala. 200+ patients trust us for back pain, knee pain, sports injuries, spine care & neuro rehab. Rated 4.9/5 stars.',
  },
  team: {
    title: 'Our Physiotherapy Team — Expert Physiotherapists at KYNA Patiala',
    description:
      'Meet KYNA\'s expert physiotherapists: Dr. Sorabh Sharma (Sports & Osteopath), Pradeep Kumar (Ortho & Neuro), and specialists in women\'s health, paediatrics & geriatrics. Licensed professionals in Patiala.',
  },
  contact: {
    title: 'Contact KYNA Physiotherapy — Book Appointment in Patiala, Samana, Sangrur',
    description:
      'Contact KYNA Physiotherapy for appointments. Clinics at SCF-34 DLF Colony Patiala, Samana & Sangrur. Call +91-98781-82115 for free consultation. Walk-ins welcome!',
  },
} as const
