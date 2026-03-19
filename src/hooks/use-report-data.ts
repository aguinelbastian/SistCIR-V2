import { useState, useEffect, useCallback, useRef } from 'react'

export function useReportData<T>(fetchFn: () => Promise<any>, pollInterval: number = 30000) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadData = useCallback(async () => {
    // Only set loading true on first load or manual refresh
    if (!lastUpdated && !error) setLoading(true)
    setError(null)

    try {
      const res = await fetchFn()
      if (res.error) throw new Error(res.error.message || 'Erro ao carregar dados')

      // Assume edge function returns JSON stringified inside res.data or direct obj
      const payload = typeof res.data === 'string' ? JSON.parse(res.data) : res.data

      if (payload && payload.success) {
        setData(payload.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(payload?.error || 'Erro na resposta do servidor')
      }
    } catch (err: any) {
      setError(err.message)
      // Auto-retry on error after 5s
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        loadData()
      }, 5000)
    } finally {
      setLoading(false)
    }
  }, [fetchFn, lastUpdated, error])

  useEffect(() => {
    loadData()
    intervalRef.current = setInterval(loadData, pollInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [loadData, pollInterval])

  return { data, loading, error, lastUpdated, refresh: loadData }
}
