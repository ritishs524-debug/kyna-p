import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { gsap } from '../../lib/gsap'
import kynaMark from '../../assets/logo/kyna_withoutbg-04.PNG'

type ChatMessage = {
	id: number
	sender: 'user' | 'assistant'
	text: string
}

	const SYSTEM_PROMPT = `
	You are the friendly KYNA Physiotherapy assistant for the official KYNA website.
	- Always base your answers first on the KYNA website information provided below.
	- Answer briefly (2–5 lines) in simple, friendly language. You can mix light Hinglish if the user does.
	- You can explain physiotherapy concepts, KYNA services, locations and team specialities.
	- Do NOT give specific medical diagnoses, prescriptions or exact promises of cure.
	- For anything serious, unclear or very personal, politely suggest visiting or calling the clinic.
	- When you are not fully sure, be honest and guide the user to contact KYNA directly.
	` as const

	const WEBSITE_KNOWLEDGE = `
	Core facts from the KYNA Physiotherapy website. Use this as reference:

	CLINIC OVERVIEW
	- KYNA Physiotherapy is a physiotherapy and rehabilitation clinic group based around Patiala, Punjab (India).
	- The website has pages: Home, About, Services, Reviews, Team and Contact.
	- The focus is long-term rehab, not quick fixes: detailed assessment, hands-on work and structured exercise.

	LOCATIONS & CONTACT (from the Contact page)
	- KYNA has multiple locations:
	  1) Patiala: "SCF-34, DLF Colony, Patiala".
	  2) Anamiva Physiotherapy: "Sco 7-8, behind Moti Palace, Malwa Colony, Rose Avenue, New Officers Colony, Patiala, Punjab 147001".
	  3) Samana: "Krishna Basti, Opp Jain Terapanthi Sabha, Near Ganpati Jewellers, Waraich Colony, Samana, Punjab 147101".
	- Phone number for all clinics (from the Contact cards): +91 9878182115.
	- The contact form note: "We typically respond within the same working day." So response is usually same-day on working days.
	- Users can either call directly or fill the form on the Contact page.

	SERVICES (from the Services page)
	All services are available under one roof at KYNA Physiotherapy:
	1) Physiotherapy (Core Rehabilitation)
	   - Restores pain-free movement and strength after injury, surgery or chronic pain.
	   - Uses assessment, hands-on therapy, targeted exercises, posture correction and education.

	2) Osteopathy – Cranial and Visceral (Gentle Whole-Body Work)
	   - Very gentle, precise hands-on techniques working with nervous system, fascia and internal structures.
	   - Helpful for people sensitive to strong pressure, with headaches, digestive discomfort or postural issues.

	3) Chiropractic (Spine & Joint Alignment)
	   - Focus on spine and major joint alignment and mobility using safe, controlled adjustments.
	   - Often used for neck/back pain, stiffness, radiating nerve symptoms and frequent headaches.

	4) Exercise Therapy (Strength & Conditioning)
	   - Personalised exercise programmes, not generic workouts.
	   - Combines mobility, strength, balance and endurance with coached technique for safe movement.

	5) Manual Physical Therapy (Hands-On Relief)
	   - Hands-on joint mobilisation, soft-tissue release, myofascial work and stretching.
	   - Helpful for frozen shoulder, neck and back stiffness, sports injuries and postural strain.

	6) Women's Health Physiotherapy (For Every Life Stage)
	   - Supports pregnancy, postnatal recovery and hormonal transitions.
	   - Addresses pelvic pain, low back/hip issues, abdominal separation, incontinence and daily discomfort.

	7) Pelvic Floor Rehabilitation (Confident Control)
	   - For leakage, urgency, heaviness, postnatal weakness or pelvic pain.
	   - Uses assessment, targeted exercises, breathing, relaxation and strength work.

	8) Evidence-Based Falls Prevention (Balance & Confidence)
	   - Built for older adults or anyone feeling unsteady or fearful of falling.
	   - Uses researched exercises for strength, balance, reaction speed and home/practical safety tips.

	9) Physiotherapy at Home (Care That Comes to You)
	   - Home visits for people who cannot easily travel: after surgery, illness, elderly, or those preferring home.
	   - Therapist adapts exercises to the home environment and involves caregivers when needed.

	10) Antenatal / Childbirth Education (Prepared Birth Journey)
	    - Combines physiotherapy insight with practical birth preparation for expecting parents and partners.
	    - Covers posture, breathing, pelvic floor care, labour positions, pain-management options and early recovery.

	TEAM HIGHLIGHTS (from the Team page)
	- All therapists are licensed physiotherapists with advanced training. They blend sports rehab, orthopaedics,
	  neurology and women's health to build personalised treatment journeys.
	- Key team members and focus areas:
	  • Sorabh Sharma (PT): Sports Specialist · Osteopath – sports rehab and gentle osteopathic techniques.
	  • Pradeep Kumar (PT): Ortho & Neuro Specialist – spine, joint and nerve conditions, strength and balance.
	  • Angadjot Singh (PT): Ortho Specialist · Osteopath – joint alignment, posture, long-term comfort.
	  • Pratima Chakraborty (PT): Gynae Specialist · Lamaze Practitioner – women’s health, pregnancy, birth prep.
	  • Aakash Kalra (PT): Ortho Specialist – knee and shoulder, return to sport and daily activity.
	  • Harpreet Kaur (PT): Ortho Specialist – chronic pain and posture-related issues.
	  • Naina Rattan (PT): Ortho Specialist – spine and everyday mobility.
	  • Divyansh Bansal (PT): Sports Specialist – athlete care and performance.
	  • Komalpreet Kaur (PT): Physiotherapist – rehab support and patient education.
	  • Mansi (PT): Physiotherapist – exercise therapy and recovery.

	ANSWERING STYLE
	- When asked about "which therapy is right for me" or specific pain, you can explain possible options from the
	  services list, but always say that exact treatment is decided only after in-person assessment.
	- When asked about addresses, phone number or locations, use the details above.
	- When asked about a particular therapist, mention their role and focus areas from the list above.
	- When users ask something NOT covered by this knowledge, you may use general physio knowledge but keep it
	  generic and encourage contacting KYNA for personalised advice.
	` as const

export function ChatbotWidget() {
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: 1,
			sender: 'assistant',
			text: "Hi, I'm the KYNA assistant. Ask anything about physiotherapy, our services, or locations.",
		},
	])
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const panelRef = useRef<HTMLDivElement | null>(null)
	const bubbleRef = useRef<HTMLButtonElement | null>(null)
	const messagesRef = useRef<HTMLDivElement | null>(null)

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		const trimmed = input.trim()
		if (!trimmed || isLoading) return

		const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1

		const userMessage: ChatMessage = {
			id: nextId,
			sender: 'user',
			text: trimmed,
		}

		setMessages((prev) => [...prev, userMessage])
		setInput('')
		setIsLoading(true)

		try {
			const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined
			if (!apiKey) {
				throw new Error('Missing Groq API key')
			}

			// Prepare recent conversation history for better context
			const history = messages.slice(-6).map((message) => ({
				role: message.sender === 'user' ? 'user' : 'assistant',
				content: message.text,
			}))

			const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'llama-3.3-70b-versatile',
					messages: [
						{ role: 'system', content: SYSTEM_PROMPT },
						{ role: 'system', content: WEBSITE_KNOWLEDGE },
						...history,
						{ role: 'user', content: trimmed },
					],
					temperature: 0.3,
				}),
			})

			if (!response.ok) {
				throw new Error(`Groq API error: ${response.status}`)
			}

			const data = await response.json()
			const content: string =
				data?.choices?.[0]?.message?.content?.toString().trim() ??
				"I'm having trouble responding right now. Please try again in a moment or contact the clinic directly."

			const assistantMessage: ChatMessage = {
				id: nextId + 1,
				sender: 'assistant',
				text: content,
			}

			setMessages((prev) => [...prev, assistantMessage])
		} catch (error) {
			console.error('Groq chat error', error)
			const fallback: ChatMessage = {
				id: nextId + 1,
				sender: 'assistant',
				text:
					"Sorry, I'm not able to answer right now. Please try again later or call the KYNA clinic for quick help.",
			}
			setMessages((prev) => [...prev, fallback])
		} finally {
			setIsLoading(false)
		}
	}

	  const handleOpen = () => {
	    setIsOpen(true)
	  }

	  const handleClose = () => {
	    if (!panelRef.current) {
	      setIsOpen(false)
	      return
	    }

	    gsap.to(panelRef.current, {
	      autoAlpha: 0,
	      y: 16,
	      scale: 0.95,
	      duration: 0.25,
	      ease: 'power2.inOut',
	      onComplete: () => setIsOpen(false),
	    })
	  }

		  useLayoutEffect(() => {
		    if (panelRef.current) {
		      gsap.killTweensOf(panelRef.current)
		    }
		    if (bubbleRef.current) {
		      gsap.killTweensOf(bubbleRef.current)
		    }

		    if (isOpen && panelRef.current) {
		      gsap.fromTo(
		        panelRef.current,
		        { autoAlpha: 0, y: 18, scale: 0.96 },
		        {
		          autoAlpha: 1,
		          y: 0,
		          scale: 1,
		          duration: 0.4,
		          ease: 'power3.out',
		        },
		      )
		    }

		    if (!isOpen && bubbleRef.current) {
		      gsap.fromTo(
		        bubbleRef.current,
		        { autoAlpha: 0, y: 8, scale: 0.96 },
		        {
		          autoAlpha: 1,
		          y: 0,
		          scale: 1,
		          duration: 0.35,
		          ease: 'power2.out',
		        },
		      )

		      gsap.to(bubbleRef.current, {
		        y: -4,
		        scale: 1.03,
		        duration: 0.8,
		        ease: 'sine.inOut',
		        repeat: -1,
		        yoyo: true,
		        delay: 0.6,
		      })
		    }
		  }, [isOpen])

	  useLayoutEffect(() => {
	    if (!messagesRef.current) return

	    const items = messagesRef.current.querySelectorAll('.kyna-chat-message')
	    const last = items[items.length - 1] as HTMLElement | undefined
	    if (!last) return

	    gsap.killTweensOf(last)
	    gsap.from(last, {
	      opacity: 0,
	      y: 10,
	      duration: 0.25,
	      ease: 'power2.out',
	    })

	    gsap.killTweensOf(messagesRef.current)
	    gsap.to(messagesRef.current, {
	      scrollTop: messagesRef.current.scrollHeight,
	      duration: 0.3,
	      ease: 'power2.out',
	    })
	  }, [messages.length])

  return (
	    <div className="pointer-events-none fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-10 sm:right-8">
      {/* Collapsed bubble button */}
      {!isOpen && (
        <button
          type="button"
	          ref={bubbleRef}
	          onClick={handleOpen}
	          className="pointer-events-auto inline-flex items-center gap-2 rounded-full
	            bg-gradient-to-br from-sky-500 via-sky-500 to-indigo-500 px-4 py-3 text-sm
	            font-semibold text-white shadow-[0_18px_55px_rgba(15,23,42,0.55)]
	            transition-transform duration-200 ease-out hover:translate-y-[-1px]
	            hover:shadow-[0_24px_80px_rgba(15,23,42,0.75)] focus-visible:outline-none
	            focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2
	            focus-visible:ring-offset-slate-950 dark:from-sky-400 dark:via-sky-500
	            dark:to-indigo-400"
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full
              bg-white/10 ring-1 ring-white/30"
          >
            <span className="text-base leading-none">💬</span>
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[0.7rem] uppercase tracking-[0.16em] text-sky-100/80">
              Need help?
            </span>
            <span className="text-xs sm:text-sm">Chat with KYNA</span>
          </span>
        </button>
      )}

      {/* Expanded chat panel */}
      {isOpen && (
		        <div
			          ref={panelRef}
				          className="pointer-events-auto w-[min(24rem,100vw-3rem)] overflow-hidden
				            rounded-[2rem] border border-slate-200/90 bg-white/95 p-4
				            text-[0.78rem] text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.8)]
				            dark:border-slate-800/80 dark:bg-slate-900"
		        >
          {/* Header */}
	          <div className="mb-3 flex items-center gap-3">
	            <div
	              className="flex h-10 w-10 items-center justify-center rounded-2xl
	                bg-slate-900/5 shadow-[0_10px_30px_rgba(15,23,42,0.35)] ring-1
	                ring-white/60"
	            >
	              <img
	                src={kynaMark}
	                alt="KYNA logo"
	                className="h-8 w-auto object-contain"
	              />
	            </div>
            <div className="flex flex-1 flex-col">
	              <span className="text-[0.8rem] font-semibold tracking-[0.16em] text-slate-900 dark:text-slate-50">
                KYNA ASSISTANT
              </span>
	              <span className="text-[0.72rem] text-slate-500 dark:text-slate-400">
                Usually replies in a few moments
              </span>
            </div>
		            <button
		              type="button"
			              onClick={handleClose}
		              className="inline-flex h-7 w-7 items-center justify-center rounded-full
		                border border-red-200/80 bg-red-50 text-[0.7rem]
		                text-red-500 shadow-sm transition hover:bg-red-100
		                dark:border-red-500/50 dark:bg-red-500/20 dark:text-red-200
		                dark:hover:bg-red-500/30"
		              aria-label="Close chat"
		            >
		              ×
		            </button>
          </div>

          {/* Messages area */}
          <div
	            ref={messagesRef}
		            className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded-[1.6rem]
		              bg-white p-3 pr-2 text-[0.8rem] leading-relaxed text-slate-900
		              shadow-inner dark:bg-slate-900 dark:text-slate-100"
          >
            {messages.map((message) => (
              <div
                key={message.id}
	                className={`kyna-chat-message ${
	                  message.sender === 'assistant'
	                    ? 'flex items-start gap-2'
	                    : 'flex items-start justify-end gap-2'
	                }`}
              >
                {message.sender === 'assistant' && (
                  <div
	                    className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center
	                      rounded-full bg-slate-900/5 shadow-[0_8px_22px_rgba(15,23,42,0.45)]
	                      ring-1 ring-white/70"
                  >
	                    <img
	                      src={kynaMark}
	                      alt="KYNA logo"
	                      className="h-6 w-6 object-contain"
	                    />
                  </div>
                )}
		            <div
		                  className={
		                    message.sender === 'assistant'
		                      ? 'max-w-[82%] rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-white shadow-md dark:from-sky-400 dark:to-indigo-400'
		                      : 'max-w-[82%] rounded-3xl bg-sky-100 px-4 py-2.5 text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-50'
		                  }
		                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

	          {/* Input */}
		          <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-3">
	            <div className="relative flex-1">
	              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 opacity-70" />
	              <div className="relative rounded-full bg-white/95 px-[1px] py-[1px] dark:bg-slate-950/90">
	                <input
	                  type="text"
	                  value={input}
	                  onChange={(event) => setInput(event.target.value)}
	                  placeholder="Ask about a therapy, pain, or booking..."
	                  className="h-10 w-full rounded-full border-0 bg-transparent px-4
	                    text-[0.78rem] text-slate-900 placeholder:text-slate-400
	                    outline-none ring-0 focus-visible:outline-none"
	                />
	              </div>
	            </div>
		            <button
		              type="submit"
		              className="inline-flex h-10 min-w-[3.25rem] items-center justify-center rounded-full
		                bg-gradient-to-br from-sky-500 to-indigo-500 px-3 text-[0.68rem]
		                font-semibold uppercase tracking-[0.18em] text-white
		                shadow-[0_16px_45px_rgba(15,23,42,0.85)] transition
		                hover:translate-y-[-1px] hover:shadow-[0_20px_60px_rgba(15,23,42,0.95)]
		                disabled:opacity-60 dark:from-sky-400 dark:to-indigo-400"
		              disabled={!input.trim() || isLoading}
		            >
		              {isLoading ? 'SENDING...' : 'SEND'}
		            </button>
	          </form>
		
		          {/* Hint / disclaimer */}
		          <p className="mt-2 text-[0.65rem] text-slate-400/90 dark:text-slate-500">
		            Powered by Groq. Responses are AI-generated and do not replace medical advice from a
		            qualified professional.
		          </p>
        </div>
      )}
    </div>
  )
}
