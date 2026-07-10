"use client"

import { getSearchSuggestions, SearchSuggestion } from "@lib/data/search"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type SearchBarProps = {
  /**
   * "icon" (default): a magnifying-glass button that expands into a field —
   * used in the header. "expanded": an always-visible field — used inside the
   * mobile slide-out menu.
   */
  variant?: "icon" | "expanded"
  /** Called after navigating (submit or suggestion click); used to close the mobile menu. */
  onNavigate?: () => void
  className?: string
}

/**
 * Global product search with live suggestions. A skeuomorphic magnifying-glass
 * button (icon variant) expands into an inset field; as the user types we call
 * the `getSearchSuggestions` server action (debounced) and show a dropdown of
 * matching products (thumbnail, name, price) that link straight to the product.
 * Pressing Enter routes to the full `/search?q=…` results page.
 */
const SearchBar = ({
  variant = "icon",
  onNavigate,
  className,
}: SearchBarProps) => {
  const expanded = variant === "expanded"
  const [open, setOpen] = useState(expanded)
  const [q, setQ] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "au"

  useEffect(() => {
    if (open && !expanded) inputRef.current?.focus()
  }, [open, expanded])

  // Debounced live suggestions.
  useEffect(() => {
    const query = q.trim()
    if (query.length < 2) {
      setSuggestions([])
      setLoading(false)
      setDropdownOpen(false)
      return
    }

    setLoading(true)
    setDropdownOpen(true)
    let active = true
    const handle = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(query, countryCode)
        if (active) setSuggestions(results)
      } catch {
        if (active) setSuggestions([])
      } finally {
        if (active) setLoading(false)
      }
    }, 250)

    return () => {
      active = false
      clearTimeout(handle)
    }
  }, [q, countryCode])

  // Close dropdown on outside click.
  useEffect(() => {
    if (!dropdownOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [dropdownOpen])

  const reset = () => {
    setQ("")
    setSuggestions([])
    setDropdownOpen(false)
    if (!expanded) setOpen(false)
  }

  const runSearch = () => {
    const query = q.trim()
    if (!query) return
    router.push(`/${countryCode}/search?q=${encodeURIComponent(query)}`)
    reset()
    onNavigate?.()
  }

  const showDropdown = dropdownOpen && q.trim().length >= 2

  const dropdown = showDropdown ? (
    <div
      className={clx(
        "skeuo-panel absolute top-full z-[60] mt-2 max-h-[70vh] overflow-y-auto rounded-2xl p-1.5",
        expanded
          ? "left-0 right-0"
          : "right-0 left-auto w-[min(20rem,calc(100vw-2rem))]"
      )}
      role="listbox"
      aria-label="Search suggestions"
      data-testid="search-suggestions"
    >
      {loading && suggestions.length === 0 ? (
        <div className="px-3 py-3 text-sm text-skeuo-muted">Searching…</div>
      ) : suggestions.length === 0 ? (
        <div className="px-3 py-3 text-sm text-skeuo-muted">
          No matches for “{q.trim()}”.
        </div>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {suggestions.map((s) => (
            <li key={s.id} role="option" aria-selected="false">
              <LocalizedClientLink
                href={`/products/${s.handle}`}
                onClick={() => {
                  reset()
                  onNavigate?.()
                }}
                className="skeuo-card flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:brightness-[1.03]"
                data-testid="search-suggestion"
              >
                <span className="skeuo-inset relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  {s.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="h-2.5 w-2.5 rounded-full bg-skeuo-brass" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-skeuo-ink">
                    {s.title}
                  </span>
                  {s.price && (
                    <span className="block text-xs text-skeuo-body">
                      {s.price}
                    </span>
                  )}
                </span>
              </LocalizedClientLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={runSearch}
              className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold text-skeuo-brass transition-colors hover:text-skeuo-amber"
            >
              See all results for “{q.trim()}” →
            </button>
          </li>
        </ul>
      )}
    </div>
  ) : null

  // Always-open field (mobile menu).
  if (expanded) {
    return (
      <div ref={containerRef} className={clx("relative w-full", className)}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            runSearch()
          }}
          role="search"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => {
              if (q.trim().length >= 2) setDropdownOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setDropdownOpen(false)
            }}
            placeholder="Search peptides…"
            aria-label="Search products"
            data-testid="mobile-search"
            className="skeuo-inset w-full rounded-lg bg-transparent px-3 py-2.5 text-sm text-skeuo-ink placeholder:text-skeuo-muted focus:outline-none"
          />
        </form>
        {dropdown}
      </div>
    )
  }

  // Icon → expanding field (header).
  return (
    <div ref={containerRef} className={clx("relative flex items-center", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          runSearch()
        }}
        role="search"
        className={clx(
          "overflow-hidden transition-all duration-300 ease-out",
          open ? "w-36 sm:w-56 mr-2 opacity-100" : "w-0 opacity-0"
        )}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => {
            if (q.trim().length >= 2) setDropdownOpen(true)
          }}
          onBlur={() => {
            // Keep field open while a suggestion is being clicked / query present.
            if (!q.trim() && !dropdownOpen) setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDropdownOpen(false)
              setOpen(false)
            }
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
      {open && dropdown}
    </div>
  )
}

export default SearchBar
