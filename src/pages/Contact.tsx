'use client'

import { useState, type FormEvent } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal, RevealGroup } from '../components/ui/Reveal'
import { LocationCard, type Clinic } from '../components/ui/cards'
import { submitContactForm } from '../lib/api'
import {
  btnPrimary,
  container,
  dark,
  sectionLight,
  sectionTint,
} from '../lib/design-tokens'

/** The three clinics, verbatim from the original page. */
const clinics: Clinic[] = [
  {
    name: 'Patiala',
    address: 'SCF-34, DLF Colony, Patiala',
    phone: '9878182115',
    pin: '#14B8A6',
    pinBg: '#DFF5F1',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SCF-34%2C%20DLF%20Colony%2C%20Patiala',
  },
  {
    name: 'Anamiva Physiotherapy',
    address:
      'Sco 7-8, behind Moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001',
    phone: '9878182115',
    pin: '#8B5CF6',
    pinBg: '#EFE9FC',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Malwa%20Colony%2C%20Patiala%2C%20Punjab%20147001',
  },
  {
    name: 'Samana',
    address:
      'Krishna Basti, Opp Jain Terapanthi Sabha, Near Ganpati Jewellers, Waraich Colony, Samana, Punjab 147101',
    phone: '9878182115',
    pin: '#F0426B',
    pinBg: '#FDE7EC',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Krishna%20Basti%2C%20Waraich%20Colony%2C%20Samana%2C%20Punjab%20147101',
  },
]

/* ── Field styling, straight from the tokens ── */
const fieldBase =
  'min-h-[52px] w-full rounded-2xl border bg-white px-4 text-[15px] text-[#0B2347] outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-[#087CF0] focus:ring-2 focus:ring-[#087CF0]/20 dark:bg-slate-900 dark:text-white'
const fieldOk = `${fieldBase} border-slate-200 dark:border-slate-700`
const fieldErr = `${fieldBase} border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500/60 dark:bg-red-950/30`

const labelCls =
  'mb-2 block text-[12px] font-bold tracking-[0.16em] text-slate-600 uppercase dark:text-slate-300'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0]'

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

/** Validation, unchanged from the original page. */
function validateForm(
  name: string,
  email: string,
  phone: string,
  message: string,
): FormErrors {
  const errors: FormErrors = {}

  const trimmedName = name.trim()
  if (!trimmedName) {
    errors.name = 'Name is required'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    errors.name = 'Name can only contain letters and spaces'
  }

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = 'Email is required'
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address'
  }

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

  const trimmedMessage = message.trim()
  if (!trimmedMessage) {
    errors.message = 'Message is required'
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }

  return errors
}

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateForm(name, email, phone, message))
  }

  const fieldProps = (field: keyof FormErrors) => {
    const showError = touched[field] && errors[field]
    return {
      id: field,
      name: field,
      'aria-invalid': showError ? true : undefined,
      'aria-describedby': showError ? `${field}-error` : undefined,
      className: showError ? fieldErr : fieldOk,
      onBlur: () => handleBlur(field),
    }
  }

  const errorFor = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="mt-2 flex items-start gap-1.5 text-[13px] font-medium text-red-600 dark:text-red-400"
      >
        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {errors[field]}
      </p>
    ) : null

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    setTouched({ name: true, email: true, phone: true, message: true })
    const validationErrors = validateForm(name, email, phone, message)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      // Send focus to the first field that needs attention
      const firstBad = (['name', 'email', 'phone', 'message'] as const).find(
        (f) => validationErrors[f],
      )
      if (firstBad) document.getElementById(firstBad)?.focus()
      return
    }

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
    <div className="flex flex-col pb-24 md:pb-0">
      <PageHero
        eyebrow="Contact Us"
        title="Have a Question?"
        intro="Drop a line, call us directly or visit any of our KYNA Physiotherapy clinics."
      />

      {/* ── Form ── */}
      <section className={`${sectionLight} ${dark.sectionLight}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="Send a Message"
            title="Tell us what you are dealing with"
            intro="Share your pain, sports injury or movement goal and we will get back to you."
          />

          <Reveal className="mx-auto mt-12 max-w-4xl lg:mt-14">
            <div className="rounded-[26px] border border-sky-100 bg-white p-6 shadow-[0_18px_50px_rgba(11,35,71,0.07)] sm:p-9 lg:p-10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>
                      Your name *
                    </label>
                    <input
                      {...fieldProps('name')}
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errorFor('name')}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelCls}>
                      Your e-mail *
                    </label>
                    <input
                      {...fieldProps('email')}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errorFor('email')}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelCls}>
                    Phone number *
                  </label>
                  <input
                    {...fieldProps('phone')}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98781 82115"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errorFor('phone')}
                </div>

                <div>
                  <label htmlFor="message" className={labelCls}>
                    Your message *
                  </label>
                  <textarea
                    {...fieldProps('message')}
                    rows={5}
                    placeholder="Share your concern, pain area or goal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${touched.message && errors.message ? fieldErr : fieldOk} min-h-[140px] resize-y py-3.5`}
                  />
                  {errorFor('message')}
                </div>

                {/* Success / error states, announced to screen readers */}
                <div aria-live="polite">
                  {submitStatus === 'success' && (
                    <p className="flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-[14px] font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <CheckCircle2 className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-[14px] font-medium text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                      <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                      Failed to send message. Please try again.
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-4 pt-1 sm:flex-row sm:justify-between">
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">
                    We typically respond within the same working day.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${btnPrimary} h-[52px] w-full px-9 text-[15px] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto lg:h-[58px] ${focusRing}`}
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Clinic locations ── */}
      <section className={`${sectionTint} ${dark.sectionTint}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="Clinic Locations"
            title="Visit any of our clinics"
            intro="Three clinics across Punjab, each with the same standards of care."
          />

          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {clinics.map((clinic) => (
              <LocationCard key={clinic.name} clinic={clinic} />
            ))}
          </RevealGroup>
        </div>
      </section>
    </div>
  )
}
