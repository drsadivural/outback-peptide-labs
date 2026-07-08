import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type LegalLayoutProps = {
  title: string
  /** Short "Last updated" / status line shown under the title. */
  updated?: React.ReactNode
  /** Highlighted draft/template notice box. */
  notice?: React.ReactNode
  children: React.ReactNode
}

/**
 * Shared wrapper for the legal pages. Provides consistent Outback-themed
 * typography (Oswald headings, Inter body) for the ported policy content.
 *
 * The body uses Tailwind's `prose`-like manual styling via `[&_...]` selectors
 * so the raw ported markup (h2/p/ul/ol/li/a/strong) renders on-brand without a
 * plugin dependency.
 */
export default function LegalLayout({
  title,
  updated,
  notice,
  children,
}: LegalLayoutProps) {
  return (
    <div className="bg-white">
      <div className="content-container py-12 small:py-16">
        <nav className="mb-8 text-sm">
          <LocalizedClientLink
            href="/"
            className="text-brand-blue hover:text-brand-ink transition-colors"
          >
            ← Back to store
          </LocalizedClientLink>
        </nav>

        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl small:text-4xl font-semibold uppercase tracking-[0.02em] text-brand-ink">
            {title}
          </h1>

          {updated ? (
            <p className="mt-3 text-sm text-brand-body">{updated}</p>
          ) : null}

          {notice ? (
            <div className="mt-6 rounded-[10px] border border-brand-line bg-brand-surface2 p-4 text-sm leading-relaxed text-brand-body">
              {notice}
            </div>
          ) : null}

          <div
            className={[
              "mt-8 flex flex-col gap-y-5 text-brand-body",
              "[&_h2]:font-display [&_h2]:text-lg [&_h2]:small:text-xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-[0.03em] [&_h2]:text-brand-ink [&_h2]:mt-6",
              "[&_p]:text-sm [&_p]:leading-relaxed",
              "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-y-2 [&_ul]:text-sm [&_ul]:leading-relaxed",
              "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-y-2 [&_ol]:text-sm [&_ol]:leading-relaxed",
              "[&_strong]:text-brand-ink",
              "[&_a]:text-brand-blue [&_a]:underline hover:[&_a]:text-brand-ink",
              // Placeholder tokens ([bracketed]) get a subtle highlight.
              "[&_.ph]:text-brand-blue",
            ].join(" ")}
          >
            {children}
          </div>
        </article>
      </div>
    </div>
  )
}
