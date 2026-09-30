/**
 * Direct browser → Cloudinary upload.
 *
 * The admin panel used to POST to our own backend (`/api/upload`), which meant
 * images could only be stored while the Render backend was alive. This module
 * uploads straight from the browser to Cloudinary's API instead, so image
 * storage keeps working even with no backend.
 *
 * Security note: an *unsigned* upload preset is public — anyone can push files
 * into this Cloudinary account. That is acceptable for an admin-only tool but
 * it does not protect your quota. See `SIGNED_UPLOAD_NOTE` below for the
 * hardened alternative.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

/* ── Config ───────────────────────────────────────────────────────────── */

/** True when both env vars are present and the upload route is reachable. */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET)
}

/** Human-readable reason the upload cannot run, or null when it can. */
export function cloudinaryConfigError(): string | null {
  if (!CLOUD_NAME) {
    return 'VITE_CLOUDINARY_CLOUD_NAME is missing from .env. Copy it from Cloudinary → Settings → Account Details → Cloud name.'
  }
  if (!UPLOAD_PRESET) {
    return 'VITE_CLOUDINARY_UPLOAD_PRESET is missing from .env. Create an unsigned preset in Cloudinary → Settings → Upload → Upload presets.'
  }
  return null
}

/* ── Limits ───────────────────────────────────────────────────────────── */

/** Cloudinary free plans cap uploads at 10 MB. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024

export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
] as const

/** Human labels for the accept attribute. */
export const ACCEPT_ATTR = 'image/jpeg,image/png,image/webp,image/avif,image/gif'

/* ── Delivery ─────────────────────────────────────────────────────────── */

/**
 * Transformation applied on delivery, not on the stored original.
 * `c_limit` caps the width but never crops or distorts, `q_auto` picks the
 * best quality per viewer, `f_auto` serves WebP/AVIF where supported.
 */
const DELIVERY_TRANSFORM = 'c_limit,w_1600,q_auto:good,f_auto'

/**
 * Returns the delivery URL with the delivery transformation injected after
 * `/upload/`. The original stays untouched in your library, so you can always
 * re-crop later without re-uploading.
 */
export function buildDeliveryUrl(secureUrl: string): string {
  return secureUrl.replace('/upload/', `/upload/${DELIVERY_TRANSFORM}/`)
}

/* ── Errors ───────────────────────────────────────────────────────────── */

export class UploadError extends Error {
  /** Machine-readable reason, handy for tests and analytics. */
  readonly code:
    | 'not_configured'
    | 'file_type'
    | 'file_size'
    | 'network'
    | 'cloudinary'
    | 'aborted'
    | 'unknown'

  constructor(code: UploadError['code'], message: string) {
    super(message)
    this.name = 'UploadError'
    this.code = code
  }
}

/* ── Validation ───────────────────────────────────────────────────────── */

/** Throws an {@link UploadError} if the file cannot be uploaded. */
export function validateFile(file: File): void {
  if (!(file instanceof File) || file.size === 0) {
    throw new UploadError('file_type', 'That file is empty or could not be read.')
  }
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    throw new UploadError(
      'file_type',
      `Unsupported file type "${file.type || 'unknown'}". Use JPG, PNG, WebP, AVIF or GIF.`,
    )
  }
  if (file.size > MAX_FILE_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    throw new UploadError(
      'file_size',
      `File is ${mb} MB. The limit is 10 MB — please compress it and try again.`,
    )
  }
}

/* ── Result ───────────────────────────────────────────────────────────── */

export type UploadResult = {
  /** Optimised delivery URL — store this in your database. */
  url: string
  /** Untransformed original URL. */
  originalUrl: string
  publicId: string
  width: number
  height: number
  bytes: number
  format: string
}

export type UploadOptions = {
  /** Cloudinary folder, e.g. `kyna/services`. */
  folder?: string
  /** 0–100. Fired as the file is sent. */
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}

/* ── Upload ───────────────────────────────────────────────────────────── */

type CloudinaryResponse = {
  secure_url?: string
  public_id?: string
  width?: number
  height?: number
  bytes?: number
  format?: string
  error?: { message?: string }
}

/**
 * Uploads a file straight to Cloudinary and resolves with its delivery URL.
 *
 * Uses XMLHttpRequest rather than fetch because fetch still cannot report
 * upload progress, and a 10 MB photo on a slow clinic connection needs a real
 * progress bar.
 */
export function uploadToCloudinary(
  file: File,
  { folder, onProgress, signal }: UploadOptions = {},
): Promise<UploadResult> {
  const configError = cloudinaryConfigError()
  if (configError) throw new UploadError('not_configured', configError)

  validateFile(file)

  const cloud = CLOUD_NAME as string
  const preset = UPLOAD_PRESET as string
  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`

  return new Promise<UploadResult>((resolve, reject) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', preset)
    // Only parameters an unsigned preset accepts. Cloudinary rejects the whole
    // request if you add anything outside this list (notably `colors`,
    // `transformation`, `eager` or `quality`).
    if (folder) form.append('folder', folder)

    const xhr = new XMLHttpRequest()

    const abort = () => xhr.abort()
    if (signal) {
      if (signal.aborted) {
        reject(new UploadError('aborted', 'Upload cancelled.'))
        return
      }
      signal.addEventListener('abort', abort, { once: true })
    }

    const cleanup = () => signal?.removeEventListener('abort', abort)

    xhr.upload.onprogress = (event) => {
      if (!onProgress) return
      // lengthComputable is false when the size is unknown
      const percent = event.lengthComputable
        ? Math.round((event.loaded / event.total) * 100)
        : 0
      onProgress(percent)
    }

    xhr.onload = () => {
      cleanup()
      let data: CloudinaryResponse = {}
      try {
        data = JSON.parse(xhr.responseText) as CloudinaryResponse
      } catch {
        // fall through to the status-based error below
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(
          new UploadError(
            'cloudinary',
            data.error?.message ||
              `Cloudinary rejected the upload (HTTP ${xhr.status}). Check that the unsigned preset "${preset}" exists on cloud "${cloud}".`,
          ),
        )
        return
      }

      if (!data.secure_url) {
        reject(
          new UploadError('unknown', 'Cloudinary returned no URL for the uploaded image.'),
        )
        return
      }

      onProgress?.(100)
      resolve({
        url: buildDeliveryUrl(data.secure_url),
        originalUrl: data.secure_url,
        publicId: data.public_id ?? '',
        width: data.width ?? 0,
        height: data.height ?? 0,
        bytes: data.bytes ?? file.size,
        format: data.format ?? '',
      })
    }

    xhr.onerror = () => {
      cleanup()
      reject(
        new UploadError(
          'network',
          'Could not reach Cloudinary. Check your internet connection, then try again.',
        ),
      )
    }

    xhr.ontimeout = () => {
      cleanup()
      reject(new UploadError('network', 'The upload timed out. Please try again.'))
    }

    xhr.onabort = () => {
      cleanup()
      reject(new UploadError('aborted', 'Upload cancelled.'))
    }

    xhr.open('POST', endpoint)
    xhr.timeout = 120_000
    xhr.send(form)
  })
}

/* ── Hardened alternative ──────────────────────────────────────────────── */

/**
 * An unsigned preset is a public write endpoint for your account. If you later
 * want to lock uploads down, switch to a **signed** preset and have your
 * backend return the signature:
 *
 *   signature = sha1(`folder=${folder}&timestamp=${ts}${API_SECRET}`)
 *
 * then POST with `api_key` and `signature` instead of `upload_preset`. The API
 * secret must stay on the server — never put it in a `VITE_` variable, those
 * ship to the browser.
 */
export const SIGNED_UPLOAD_NOTE =
  'Unsigned preset = public uploads. For a signed upload, add VITE_CLOUDINARY_API_KEY to the client and have your backend sign the request with the API secret.'
