import type { RecommendationBatch, RecommendationRequest } from '@/types'
import { ApiError, request, USE_MOCKS } from './client'
import { mockApi } from './mock'

export function generateRecommendations(input: RecommendationRequest = {}) {
  if (USE_MOCKS) return mockApi.generateRecommendations(input)
  return request<RecommendationBatch>('/recommendations', { method: 'POST', body: input })
}

// Returns null when the user has never generated a batch.
export async function getLatestRecommendations(): Promise<RecommendationBatch | null> {
  if (USE_MOCKS) return mockApi.latestRecommendations()
  try {
    return await request<RecommendationBatch>('/recommendations/latest')
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}
