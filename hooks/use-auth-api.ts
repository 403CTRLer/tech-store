"use client"

import { useState } from "react"

interface ApiOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeRequest = async <T>(\
    url: string,\
    options: RequestInit & ApiOptions = {}\
  )
  : Promise<
  data: T | null
  error: string | null
  > =>
  setIsLoading(true)
  setError(null)

  try {
    const { requireAuth, requireAdmin, ...fetchOptions } = options

    // Get token from localStorage or cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1]

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    if (token && (requireAuth || requireAdmin)) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Request failed" }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return { data, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An error occurred"
    setError(errorMessage)
    return { data: null, error: errorMessage }
  } finally {
    setIsLoading(false)
  }

  return {
    makeRequest,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
