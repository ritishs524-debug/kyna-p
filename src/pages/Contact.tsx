import type { FormEvent } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { submitContactForm } from '../lib/api'

const locations = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind Moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, Opp Jain Terapanthi Sabha, Near Ganpati Jewellers, Waraich Colony, Samana, Punjab 147101',
  },
] as const

const inputCls =
  'h-12 w-full rounded-full border border-slate-200/80 bg-slate-50/60 px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-50 dark:focus:border-sky-400'

const inputErrorCls =
  'h-12 w-full rounded-full border border-red-400 bg-red-50/30 px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-200 dark:border-red-500/60 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

function validateForm(name: string, email: string, phone: string, message: string): FormErrors {
  const errors: FormErrors = {}

  // Name: min 2 chars, only letters & spaces
  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Name is required'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    errors.name = 'Name can only contain letters and spaces'
  }

  // Email
  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address'
  }

  // Phone: 10 digits (with optional +91 prefix)
  const digitsOnly = phone.replace(/[\s\-+()]/g, '')
  if (!phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (digitsOnly.startsWith('91') && digitsOnly.length === 12) {
    // Valid: +91 followed by 10 digits
  } else if (/^[0-9]{10}$/.test(digitsOnly)) {
    // Valid: 10 digits
  } else {
    errors.phone = 'Please enter a valid 10-digit phone number'
  }

  // Message: min 10 chars
  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    errors.message = 'Message is required'
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}

export function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Validate on blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateForm(name, email, phone, message))
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-hero', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.contact-form-card', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        delay: 0.15,
        ease: 'power3.out',
      })

      gsap.from('.contact-location-card', {
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.14,
        scrollTrigger: {
          trigger: '.contact-locations',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    // Mark all fields as touched
    setTouched({ name: true, email: true, phone: true, message: true })

    // Validate
    const validationErrors = validateForm(name, email, phone, message)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      await submitContactForm({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      })
      setSubmitStatus('success')
      setName('')
      setEmail('')
      setPhone('')
      setMessage('')
      setTouched({})
      setErrors({})
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(148,163,184,0.18),_transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:px-6">
        {/* Top intro */}
        <div className="contact-hero mb-10 space-y-4 text-center">
          <p className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4b55ad] px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-sky-50 shadow-sm shadow-[0_10px_26px_rgba(15,23,42,0.45)]">
            Contact Us
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Have a Question?
          </h1>
          <p className="text-sm font-medium text-slate-500 sm:text-base dark:text-slate-300/90">
            Drop a line, call us directly or visit any of our KYNA Physiotherapy clinics.
          </p>
        </div>

        {/* Contact form — moved to top */}
        <div className="contact-form-card mx-auto mb-16 max-w-4xl rounded-[2.5rem] bg-gradient-to-br from-[#020617] via-[#0f172a] to-sky-500/90 p-[1px] shadow-[0_32px_95px_rgba(15,23,42,0.7)]">
          <div className="rounded-[2.4rem] bg-white/98 px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.18)] backdrop-blur-sm sm:px-8 sm:py-8 dark:bg-slate-950/95">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Your name*
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={touched.name && errors.name ? inputErrorCls : inputCls}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Your e-mail*
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={touched.email && errors.email ? inputErrorCls : inputCls}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Phone number*
                </label>
                <input
                  type="tel"
                  placeholder="+91 98781 82115"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={touched.phone && errors.phone ? inputErrorCls : inputCls}
                />
                {touched.phone && errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Your message*
                </label>
                <textarea
                  rows={5}
                  placeholder="Share your concern, pain area or goal..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => handleBlur('message')}
                  className={`w-full rounded-3xl px-4 py-3 text-sm outline-none ring-0 transition ${
                    touched.message && errors.message
                      ? 'border border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-red-500/60 dark:bg-red-900/10 dark:text-slate-50 dark:focus:border-red-400'
                      : 'border border-slate-200/80 bg-slate-50/60 text-slate-900 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-50 dark:focus:border-sky-400'
                  }`}
                />
                {touched.message && errors.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">{errors.message}</p>
                )}
              </div>

              {submitStatus === 'success' && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  ✅ Message sent successfully! We'll get back to you soon.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  ❌ Failed to send message. Please try again.
                </p>
              )}

              <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
                <p className="text-[0.7rem] text-slate-500 dark:text-slate-400">
                  We typically respond within the same working day.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4b55ad] to-sky-500 px-8 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_18px_45px_rgba(56,189,248,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(56,189,248,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Locations row — below form */}
        <div className="contact-locations grid gap-6 md:grid-cols-3">
          {locations.map((loc) => (
            <article
              key={loc.name}
              className="contact-location-card flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-sky-50/70 to-sky-100/80 p-5 text-sm text-slate-900 shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:border-slate-800/80 dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:text-slate-50"
            >
              <div className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
                  {loc.name}
                </p>
                <p className="text-slate-600 dark:text-slate-200/90">{loc.address}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[0.7rem]">
                <a
                  href="tel:9878182115"
                  className="rounded-full border border-sky-500/60 bg-white/80 px-3 py-1.5 font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-[0_14px_35px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:border-sky-500 hover:bg-gradient-to-r hover:from-[#4b55ad] hover:to-sky-500 hover:text-white dark:border-sky-400/70 dark:bg-slate-900/80 dark:text-sky-100 dark:hover:border-sky-300 dark:hover:bg-gradient-to-r dark:hover:from-[#4b55ad] dark:hover:to-sky-500"
                >
                  Call Clinic
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

