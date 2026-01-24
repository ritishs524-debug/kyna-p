import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { gsap } from '../../lib/gsap'
import kynaMark from '../../assets/logo/kyna_withoutbg-04.PNG'

type ChatMessage = {
  id: number
  sender: 'user' | 'assistant'
  text: string
}

export function ChatbotWidget() {
	  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi, I'm the KYNA assistant. Ask anything about physiotherapy, our services, or locations.",
    },
  ])
  const [input, setInput] = useState('')

	  const panelRef = useRef<HTMLDivElement | null>(null)
	  const bubbleRef = useRef<HTMLButtonElement | null>(null)
	  const messagesRef = useRef<HTMLDivElement | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1

    const userMessage: ChatMessage = {
      id: nextId,
      sender: 'user',
      text: trimmed,
    }

    const placeholderReply: ChatMessage = {
      id: nextId + 1,
      sender: 'assistant',
      text: "Thanks for your message. Our live KYNA assistant is coming soon. For now, you can also reach us via the Contact page form or phone.",
    }

    setMessages((prev) => [...prev, userMessage, placeholderReply])
    setInput('')
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
	    if (isOpen && panelRef.current) {
	      gsap.killTweensOf(panelRef.current)
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
	      gsap.killTweensOf(bubbleRef.current)
	      gsap.fromTo(
	        bubbleRef.current,
	        { autoAlpha: 0, y: 8 },
	        {
	          autoAlpha: 1,
	          y: 0,
	          duration: 0.3,
	          ease: 'power2.out',
	          delay: 0.05,
	        },
	      )
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
	            rounded-[2rem] border border-slate-200/90 bg-gradient-to-b from-slate-50
	            via-sky-50/70 to-slate-100/95 p-4 text-[0.78rem] text-slate-900 shadow-[0_30px_90px_rgba(15,23,42,0.8)]
	            backdrop-blur-xl dark:border-slate-800/80 dark:bg-gradient-to-b
	            dark:from-slate-900 dark:via-slate-950/95 dark:to-slate-950"
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
                border border-slate-200/80 bg-white/60 text-[0.7rem]
                text-slate-500 shadow-sm transition hover:bg-slate-100
                dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400
                dark:hover:bg-slate-800"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages area */}
          <div
	            ref={messagesRef}
	            className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded-[1.6rem]
	              bg-gradient-to-b from-white via-sky-50 to-white p-3 pr-2
	              text-[0.8rem] leading-relaxed text-slate-900 shadow-inner
	              dark:bg-slate-950/40 dark:text-slate-100"
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
	                      ? 'max-w-[82%] rounded-3xl bg-white px-4 py-2.5 text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-slate-100'
	                      : 'max-w-[82%] rounded-3xl bg-slate-900 px-4 py-2.5 text-slate-50 shadow-sm dark:bg-sky-500/90'
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
	              disabled={!input.trim()}
	            >
	              SEND
	            </button>
	          </form>

	          {/* Hint for future Groq integration */}
	          <p className="mt-2 text-[0.65rem] text-slate-400/90 dark:text-slate-500">
	            AI answers via Groq coming soon. This is a design preview.
	          </p>
        </div>
      )}
    </div>
  )
}
