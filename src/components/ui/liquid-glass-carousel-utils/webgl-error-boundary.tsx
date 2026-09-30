'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = { failed: boolean }

/**
 * Catches anything thrown while the WebGL scene initialises — a lost context,
 * a shader compile failure, a driver crash. Without this, a single WebGL
 * failure takes down the whole React tree and the visitor sees a white page.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[WebGL] carousel failed to initialise', error, info.componentStack)
    }
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}

/**
 * Shown when WebGL is unavailable (old browser, hardware acceleration off,
 * blocked driver). Explains the problem instead of leaving a blank area.
 */
export function WebGLFallback({
  message = 'This carousel needs WebGL, which is unavailable in this browser.',
  className = '',
}: {
  message?: string
  className?: string
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 p-8 text-center ${className}`}
      role="status"
    >
      <svg
        className="h-7 w-7 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="14" rx="2.5" />
        <path d="M3 15l4.5-4a2 2 0 012.7 0L15 15.5M14 14l1.6-1.5a2 2 0 012.7 0L21 15" />
        <circle cx="15.5" cy="8.5" r="1.4" />
        <path d="M4 21h16" />
      </svg>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  )
}
