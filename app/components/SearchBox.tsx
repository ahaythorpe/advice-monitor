'use client'

import { useState } from 'react'

export default function SearchBox({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setLoading(true)
      await onSearch(query)
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title, source, or content..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  )
}
