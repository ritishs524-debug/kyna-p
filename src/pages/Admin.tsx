import { useState, useEffect, useCallback } from 'react'
import {
  getServices,
  addService,
  updateService,
  deleteService,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage,
  type ServiceData,
  type TeamMemberData,
} from '../lib/api'

const ADMIN_PASSWORD = 'kyna@admin2024'

type Tab = 'services' | 'team'

/* ──── shared input classes ──── */
const inputCls =
  'w-full rounded-lg border border-slate-600/60 bg-[#1a1f3a] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40'
const btnPrimary =
  'rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50'
const btnOutline =
  'rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white'

/* ──────────────────── Image Upload Helper ──────────────────── */
function ImageUpload({
  currentUrl,
  onUpload,
}: {
  currentUrl: string
  onUpload: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onUpload(url)
    } catch (err) {
      alert('Image upload failed: ' + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {currentUrl && (
        <img src={currentUrl} alt="preview" className="h-28 w-40 rounded-lg object-cover border border-slate-700" />
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500">
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Uploading…
          </span>
        ) : '📁 Choose Image'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  )
}

/* ──────────────────── Login Screen ──────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1')
      onLogin()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#111640] to-[#0d1130] p-4">
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-700/10 blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-slate-700/50 bg-[#12163a]/80 p-10 shadow-2xl shadow-purple-900/20 backdrop-blur-xl"
      >
        {/* Logo / Brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg shadow-purple-800/40">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">KYNA Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Enter credentials to access the dashboard</p>
        </div>

        {/* Password field */}
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="Enter admin password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false) }}
            className={`${inputCls} pr-10 ${error ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/40' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
          >
            {showPw ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
            )}
          </button>
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
            Incorrect password. Please try again.
          </div>
        )}
        <button type="submit" className={`${btnPrimary} w-full`}>
          Sign In →
        </button>
        <p className="text-center text-xs text-slate-500">Protected area · KYNA Intelligent Rehab</p>
      </form>
    </div>
  )
}

/* ──────────────────── SERVICE FORM ──────────────────── */
function ServiceForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ServiceData
  onSave: (data: Omit<ServiceData, 'id'>) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [badge, setBadge] = useState(initial?.badge ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? '')
  const [order, setOrder] = useState(initial?.order ?? 0)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({ title, badge, description, image, imageAlt, order })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/50 bg-[#12163a]/80 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-white">{initial ? '✏️ Edit Service' : '➕ Add Service'}</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputCls} />
      <input placeholder="Badge" value={badge} onChange={(e) => setBadge(e.target.value)} required className={inputCls} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className={inputCls} />
      <ImageUpload currentUrl={image} onUpload={setImage} />
      <input placeholder="Image Alt Text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className={inputCls} />
      <input type="number" placeholder="Order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={inputCls} />
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : '💾 Save'}</button>
        <button type="button" onClick={onCancel} className={btnOutline}>Cancel</button>
      </div>
    </form>
  )
}

/* ──────────────────── TEAM FORM ──────────────────── */
function TeamForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: TeamMemberData
  onSave: (data: Omit<TeamMemberData, 'id'>) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [primaryRole, setPrimaryRole] = useState(initial?.primaryRole ?? '')
  const [tagsStr, setTagsStr] = useState(initial?.tags?.join(', ') ?? '')
  const [focus, setFocus] = useState(initial?.focus ?? '')
  const [initials, setInitials] = useState(initial?.initials ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [order, setOrder] = useState(initial?.order ?? 0)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave({
        name,
        primaryRole,
        tags: tagsStr.split(',').map((t) => t.trim()).filter(Boolean),
        focus,
        initials,
        image,
        order,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700/50 bg-[#12163a]/80 p-6 backdrop-blur">
      <h3 className="text-lg font-semibold text-white">{initial ? '✏️ Edit Team Member' : '➕ Add Team Member'}</h3>
      <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} />
      <input placeholder="Primary Role" value={primaryRole} onChange={(e) => setPrimaryRole(e.target.value)} required className={inputCls} />
      <input placeholder="Tags (comma separated)" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className={inputCls} />
      <textarea placeholder="Focus / Short Bio" value={focus} onChange={(e) => setFocus(e.target.value)} required rows={3} className={inputCls} />
      <input placeholder="Initials (e.g. SS)" value={initials} onChange={(e) => setInitials(e.target.value)} required className={inputCls} />
      <ImageUpload currentUrl={image} onUpload={setImage} />
      <input type="number" placeholder="Order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={inputCls} />
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? 'Saving…' : '💾 Save'}</button>
        <button type="button" onClick={onCancel} className={btnOutline}>Cancel</button>
      </div>
    </form>
  )
}

/* ──────────────────── MAIN ADMIN COMPONENT ──────────────────── */
export function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')
  const [tab, setTab] = useState<Tab>('services')

  // Services state
  const [services, setServices] = useState<ServiceData[]>([])
  const [editingService, setEditingService] = useState<ServiceData | null>(null)
  const [showServiceForm, setShowServiceForm] = useState(false)

  // Team state
  const [team, setTeam] = useState<TeamMemberData[]>([])
  const [editingMember, setEditingMember] = useState<TeamMemberData | null>(null)
  const [showTeamForm, setShowTeamForm] = useState(false)

  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [s, t] = await Promise.all([getServices(), getTeamMembers()])
      setServices(s)
      setTeam(t)
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) fetchAll()
  }, [authed, fetchAll])

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const handleSaveService = async (data: Omit<ServiceData, 'id'>) => {
    if (editingService?.id) {
      await updateService(editingService.id, data)
    } else {
      await addService(data)
    }
    setShowServiceForm(false)
    setEditingService(null)
    await fetchAll()
  }

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await deleteService(id)
    await fetchAll()
  }

  const handleSaveMember = async (data: Omit<TeamMemberData, 'id'>) => {
    if (editingMember?.id) {
      await updateTeamMember(editingMember.id, data)
    } else {
      await addTeamMember(data)
    }
    setShowTeamForm(false)
    setEditingMember(null)
    await fetchAll()
  }

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    await deleteTeamMember(id)
    await fetchAll()
  }

  const handleToggleShowOnHome = async (member: TeamMemberData) => {
    if (!member.id) return
    const isCurrentlyOn = !!member.showOnHome
    if (!isCurrentlyOn) {
      const alreadyOn = team.filter((m) => m.showOnHome).length
      if (alreadyOn >= 3) {
        alert('Maximum 3 members can be shown on home page. Please remove one first.')
        return
      }
    }
    await updateTeamMember(member.id, { showOnHome: !isCurrentlyOn })
    await fetchAll()
  }

  const sidebarItems: { tab: Tab; icon: React.ReactNode; label: string }[] = [
    {
      tab: 'services',
      label: 'Services',
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
    },
    {
      tab: 'team',
      label: 'Team',
      icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
    },
  ]

  return (
    <div className="flex h-screen bg-[#0a0e27] text-slate-100">
      {/* ──── Sidebar ──── */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-700/40 bg-[#0d1130]">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-700/40 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-purple-900/40">
            K
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">KYNA</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Management</p>
          {sidebarItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                tab === item.tab
                  ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/10 text-purple-300 shadow-inner'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {item.icon}
              {item.label}
              {tab === item.tab && (
                <span className="ml-auto h-2 w-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-700/40 p-4">
          <button
            onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ──── Main Content ──── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-slate-700/40 bg-[#0d1130]/60 px-8 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{tab === 'services' ? '🏥 Services' : '👥 Team Members'}</h2>
            <p className="text-xs text-slate-400">Manage your {tab} from here</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {tab === 'services' ? `${services.length} Services` : `${team.length} Members`}
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <svg className="h-8 w-8 animate-spin text-purple-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                <p className="text-sm text-slate-400">Loading data…</p>
              </div>
            </div>
          ) : tab === 'services' ? (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-purple-600/20 to-purple-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Services</p>
                  <p className="mt-1 text-3xl font-bold text-white">{services.length}</p>
                </div>
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">With Images</p>
                  <p className="mt-1 text-3xl font-bold text-white">{services.filter(s => s.image).length}</p>
                </div>
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-sky-600/20 to-sky-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Categories</p>
                  <p className="mt-1 text-3xl font-bold text-white">{new Set(services.map(s => s.badge)).size}</p>
                </div>
              </div>

              {showServiceForm ? (
                <ServiceForm initial={editingService ?? undefined} onSave={handleSaveService} onCancel={() => { setShowServiceForm(false); setEditingService(null) }} />
              ) : (
                <button onClick={() => { setEditingService(null); setShowServiceForm(true) }} className={btnPrimary}>➕ Add Service</button>
              )}

              <div className="space-y-3">
                {services.map((s) => (
                  <div key={s.id} className="group flex items-center gap-4 rounded-xl border border-slate-700/40 bg-[#12163a]/60 p-4 transition hover:border-purple-500/30 hover:bg-[#14184a]/80">
                    {s.image && <img src={s.image} alt={s.imageAlt} className="h-16 w-24 rounded-lg object-cover ring-1 ring-slate-700/50" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{s.title}</h4>
                      <p className="text-xs text-slate-400">{s.badge} · Order: {s.order}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-70 transition group-hover:opacity-100">
                      <button onClick={() => { setEditingService(s); setShowServiceForm(true) }} className="rounded-lg bg-purple-500/15 px-3 py-1.5 text-xs font-medium text-purple-300 transition hover:bg-purple-500/25">✏️ Edit</button>
                      <button onClick={() => handleDeleteService(s.id!)} className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/25">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
                {services.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/60 py-16 text-center">
                    <p className="text-sm text-slate-500">No services yet. Click "Add Service" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-purple-600/20 to-purple-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Members</p>
                  <p className="mt-1 text-3xl font-bold text-white">{team.length}</p>
                </div>
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-emerald-600/20 to-emerald-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">On Home Page</p>
                  <p className="mt-1 text-3xl font-bold text-white">{team.filter(m => m.showOnHome).length}<span className="text-lg text-slate-500">/3</span></p>
                </div>
                <div className="rounded-xl border border-slate-700/40 bg-gradient-to-br from-sky-600/20 to-sky-900/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">With Photos</p>
                  <p className="mt-1 text-3xl font-bold text-white">{team.filter(m => m.image).length}</p>
                </div>
              </div>

              {showTeamForm ? (
                <TeamForm initial={editingMember ?? undefined} onSave={handleSaveMember} onCancel={() => { setShowTeamForm(false); setEditingMember(null) }} />
              ) : (
                <button onClick={() => { setEditingMember(null); setShowTeamForm(true) }} className={btnPrimary}>➕ Add Team Member</button>
              )}

              <div className="space-y-3">
                {team.map((m) => (
                  <div key={m.id} className="group flex items-center gap-4 rounded-xl border border-slate-700/40 bg-[#12163a]/60 p-4 transition hover:border-purple-500/30 hover:bg-[#14184a]/80">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-700/50" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-lg">{m.initials}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white truncate">{m.name}</h4>
                      <p className="text-xs text-slate-400">{m.primaryRole} · Order: {m.order}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-70 transition group-hover:opacity-100">
                      <button
                        onClick={() => handleToggleShowOnHome(m)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          m.showOnHome ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25' : 'bg-slate-600/20 text-slate-400 hover:bg-slate-600/30'
                        }`}
                      >
                        {m.showOnHome ? '✅ On Home' : '🏠 Show on Home'}
                      </button>
                      <button onClick={() => { setEditingMember(m); setShowTeamForm(true) }} className="rounded-lg bg-purple-500/15 px-3 py-1.5 text-xs font-medium text-purple-300 transition hover:bg-purple-500/25">✏️ Edit</button>
                      <button onClick={() => handleDeleteMember(m.id!)} className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/25">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/60 py-16 text-center">
                    <p className="text-sm text-slate-500">No team members yet. Click "Add Team Member" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

