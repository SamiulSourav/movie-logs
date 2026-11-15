import { ApiError } from '@/api/client'

export function messageOf(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return 'Can’t reach the server. Check your connection and try again.'
    if (error.status === 429) return 'Too many requests. Wait a moment and try again.'
    return error.message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}
