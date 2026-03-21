const API_BASE = '/api'

// ── Service types ──
export interface ServiceData {
  id?: string
  title: string
  badge: string
  description: string
  image: string
  imageAlt: string
  order: number
}

// ── Team types ──
export interface TeamMemberData {
  id?: string
  name: string
  primaryRole: string
  tags: string[]
  focus: string
  initials: string
  image: string
  order: number
  showOnHome?: boolean
}

// ── Helper ──
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

// ── Services CRUD ──
export async function getServices(): Promise<ServiceData[]> {
  return request<ServiceData[]>('/services')
}

export async function addService(data: Omit<ServiceData, 'id'>): Promise<ServiceData> {
  return request<ServiceData>('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateService(id: string, data: Partial<ServiceData>): Promise<ServiceData> {
  return request<ServiceData>(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteService(id: string): Promise<void> {
  await request(`/services/${id}`, { method: 'DELETE' })
}

// ── Team CRUD ──
export async function getTeamMembers(): Promise<TeamMemberData[]> {
  return request<TeamMemberData[]>('/team')
}

export async function addTeamMember(data: Omit<TeamMemberData, 'id'>): Promise<TeamMemberData> {
  return request<TeamMemberData>('/team', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTeamMember(id: string, data: Partial<TeamMemberData>): Promise<TeamMemberData> {
  return request<TeamMemberData>(`/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTeamMember(id: string): Promise<void> {
  await request(`/team/${id}`, { method: 'DELETE' })
}

// ── Image Upload ──
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(err.error || 'Upload failed')
  }

  const data = await res.json()
  return data.url
}

