import React from "react"

/**
 * Renders a JSON-LD structured-data script tag.
 *
 * The payload is serialised server-side and injected via
 * `dangerouslySetInnerHTML` (the standard, safe pattern for JSON-LD — the
 * content is our own trusted, JSON-encoded data, not user input). We escape
 * `<` to avoid any chance of the script tag being terminated early.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c")

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
