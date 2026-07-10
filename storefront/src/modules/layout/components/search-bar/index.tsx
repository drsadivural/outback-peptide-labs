"use client"

import { clx } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

/**
 * Global product search: a skeuomorphic magnifying-glass button in the header
 * that expands into an inset search field. Submitting routes to the search
 * results page (`/<countryCode>/search?q=…`), which queries the Medusa Store
 * API's built-in `q` product search.
 */
const SearchBar = () => {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "au"

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const runSearch = () => {
    const query = q.trim()
    if (!query) return
    router.push(`/${countryCode}/search?q=${encodeURIComponent(query)}`)
    setOpen(false)
    setQ("")
  }

  return (
    <div className="flex items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          runSearch()
        }}
        className={clx(
          "overflow-hidden transition-all duration-300 ease-out",
          open ? "w-36 sm:w-56 mr-2 opacity-100" : "w-0 opacity-0"
        )}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onBlur={() => {
            if (!q.trim()) setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false)
          }}
          placeholder="Search peptides…"
          aria-label="Search products"
          data-testid="search-input"
          className="skeuo-inset w-full rounded-lg bg-transparent px-3 py-1.5 text-sm text-skeuo-ink placeholder:text-skeuo-muted focus:outline-none"
        />
      </form>
      <button
        type="button"
        onClick={() => (open ? runSearch() : setOpen(true))}
        aria-label="Search"
        title="Search"
        data-testid="search-button"
        className="skeuo-btn skeuo-btn-neutral inline-flex h-9 w-9 items-center justify-center rounded-full !border-0 !p-0"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  )
}

export default SearchBar
