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
        <img src={currentUrl} alt="preview" className="h-28 w-40 rounded-lg object-cover" />
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
        {uploading ? 'Uploading…' : 'Choose Image'}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  )
}

/* ──────────────────── Login Screen ──────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

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
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900"
      >
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value)
            setError(false)
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        {error && <p className="text-sm text-red-500">Wrong password</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          Login
        </button>
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">{initial ? 'Edit Service' : 'Add Service'}</h3>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <input placeholder="Badge" value={badge} onChange={(e) => setBadge(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <ImageUpload currentUrl={image} onUpload={setImage} />
      <input placeholder="Image Alt Text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <input type="number" placeholder="Order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-6 py-2 text-sm dark:border-slate-600">Cancel</button>
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
      <h3 className="text-lg font-semibold">{initial ? 'Edit Team Member' : 'Add Team Member'}</h3>
      <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <input placeholder="Primary Role" value={primaryRole} onChange={(e) => setPrimaryRole(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <input placeholder="Tags (comma separated)" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <textarea placeholder="Focus / Short Bio" value={focus} onChange={(e) => setFocus(e.target.value)} required rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <input placeholder="Initials (e.g. SS)" value={initials} onChange={(e) => setInitials(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <ImageUpload currentUrl={image} onUpload={setImage} />
      <input type="number" placeholder="Order" value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800" />
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-sky-600 px-6 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-6 py-2 text-sm dark:border-slate-600">Cancel</button>
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

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">KYNA Admin Panel</h1>
        <button
          onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        {(['services', 'team'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize ${
              tab === t ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : tab === 'services' ? (
        <div className="space-y-6">
          {showServiceForm ? (
            <ServiceForm
              initial={editingService ?? undefined}
              onSave={handleSaveService}
              onCancel={() => { setShowServiceForm(false); setEditingService(null) }}
            />
          ) : (
            <button
              onClick={() => { setEditingService(null); setShowServiceForm(true) }}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              + Add Service
            </button>
          )}

          <div className="space-y-3">
            {services.map((s) => (
              <div key={s.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                {s.image && <img src={s.image} alt={s.imageAlt} className="h-16 w-24 rounded-lg object-cover" />}
                <div className="flex-1">
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-xs text-slate-500">{s.badge} · Order: {s.order}</p>
                </div>
                <button onClick={() => { setEditingService(s); setShowServiceForm(true) }} className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Edit</button>
                <button onClick={() => handleDeleteService(s.id!)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">Delete</button>
              </div>
            ))}
            {services.length === 0 && <p className="text-sm text-slate-500">No services yet. Add one above.</p>}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {showTeamForm ? (
            <TeamForm
              initial={editingMember ?? undefined}
              onSave={handleSaveMember}
              onCancel={() => { setShowTeamForm(false); setEditingMember(null) }}
            />
          ) : (
            <button
              onClick={() => { setEditingMember(null); setShowTeamForm(true) }}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              + Add Team Member
            </button>
          )}

          <div className="space-y-3">
            {team.map((m) => (
              <div key={m.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">{m.initials}</div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{m.name}</h4>
                  <p className="text-xs text-slate-500">{m.primaryRole} · Order: {m.order}</p>
                </div>
                <button
                  onClick={() => handleToggleShowOnHome(m)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    m.showOnHome
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {m.showOnHome ? '✓ On Home' : 'Show on Home'}
                </button>
                <button onClick={() => { setEditingMember(m); setShowTeamForm(true) }} className="rounded-lg bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Edit</button>
                <button onClick={() => handleDeleteMember(m.id!)} className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">Delete</button>
              </div>
            ))}
            {team.length === 0 && <p className="text-sm text-slate-500">No team members yet. Add one above.</p>}
          </div>
        </div>
      )}
    </section>
  )
}

