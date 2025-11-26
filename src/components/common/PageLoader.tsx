import kynaLogo from '../../assets/logo/kyna_withoutbg-04.PNG'

export type KynaSpinnerProps = {
  size?: number
}

export function KynaSpinner({ size = 52 }: KynaSpinnerProps) {
  const dimension = `${size}px`

  return (
    <div className="inline-flex items-center justify-center rounded-full bg-slate-950/95 p-2 shadow-[0_18px_55px_rgba(15,23,42,0.85)] ring-1 ring-slate-800/90 dark:bg-slate-950/95">
      <div className="flex items-center justify-center rounded-full bg-gradient-to-tr from-sky-500/90 via-sky-400/80 to-emerald-300/80 p-1.5 shadow-[0_12px_40px_rgba(56,189,248,0.65)]">
        <img
          src={kynaLogo}
          alt="KYNA Physiotherapy logo"
          style={{ width: dimension, height: dimension }}
          className="kyna-spinner-logo"
        />
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <KynaSpinner />
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Loading experience
        </p>
      </div>
    </div>
  )
}

