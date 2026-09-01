'use client'

import { useState, useEffect } from 'react'

export default function FilterBar({
  onFilterChange,
  sources = [],
}: {
  onFilterChange: (filters: { flag?: string; source?: string; after?: string }) => void
  sources?: string[]
}) {
  const [flag, setFlag] = useState<string>('')
  const [source, setSource] = useState<string>('')
  const [dateRange, setDateRange] = useState<string>('all')

  useEffect(() => {
    let after: string | undefined
    const now = new Date()

    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      after = weekAgo.toISOString()
    } else if (dateRange === '2weeks') {
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      after = twoWeeksAgo.toISOString()
    }

    onFilterChange({
      flag: flag || undefined,
      source: source || undefined,
      after,
    })
  }, [flag, source, dateRange, onFilterChange])

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flag Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flag</label>
          <select
            value={flag}
            onChange={e => setFlag(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Flags</option>
            <option value="ACT">🔴 ACT (Action Required)</option>
            <option value="KNOW">🟠 KNOW (Should Know)</option>
            <option value="NOTE">🟢 NOTE (Background)</option>
          </select>
        </div>

        {/* Source Filter */}
        {sources.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sources</option>
              {sources.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="2weeks">Last 2 Weeks</option>
          </select>
        </div>
      </div>
    </div>
  )
}
