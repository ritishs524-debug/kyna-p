import React from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  name: string
  rating: number
  text: string
}

function getStars(rating: number): string {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: {
  className?: string
  testimonials: Testimonial[]
  duration?: number
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-4 pb-4"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-full max-w-xs rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                    {t.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-amber-400">{getStars(t.rating)}</span>
                  </div>
                </div>
                <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.text}
                </p>
                <p className="mt-3 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                  {t.name}
                </p>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
