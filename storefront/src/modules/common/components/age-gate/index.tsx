"use client"

import { useEffect, useState } from "react"

const AGE_KEY = "apl_age_verified"
const EXIT_URL = "https://www.google.com.au"

/**
 * Entry 18+ age gate.
 *
 * Cosmetic, localStorage-backed gate that overlays a blocking modal on first
 * visit. Real order-completion enforcement lives in the checkout DOB +
 * attestation flow and the backend `completeCartWorkflow` hook.
 *
 * Behaviour mirrors reference/app.js: localStorage key `apl_age_verified`,
 * "Enter" sets it to "true" and reveals the site, "Exit" redirects away.
 */
const AgeGate = () => {
  // Render nothing until mounted to avoid SSR/CSR hydration mismatch. We
  // gate-by-default (verified=false) so the modal never flashes for an
  // already-verified visitor once the effect has read localStorage.
  const [ready, setReady] = useState(false)
  const [verified, setVerified] = useState(false)
  const [denied, setDenied] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(AGE_KEY)
    } catch {
      // localStorage may be unavailable (private mode, disabled). Fall back to
      // showing the gate rather than crashing.
      stored = null
    }
    setVerified(stored === "true")
    setReady(true)
  }, [])

  const handleEnter = () => {
    try {
      window.localStorage.setItem(AGE_KEY, "true")
    } catch {
      // Non-fatal: still let the visitor through for this session.
    }
    setVerified(true)
  }

  const handleExit = () => {
    try {
      window.localStorage.removeItem(AGE_KEY)
    } catch {
      // ignore
    }
    setDenied(true)
    // Redirect away after a short beat so the "Access Denied" message shows.
    window.setTimeout(() => {
      window.location.replace(EXIT_URL)
    }, 2000)
  }

  // Not mounted yet, or the visitor has already verified: render nothing.
  if (!ready || verified) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-outback-black/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
    >
      <div className="w-full max-w-lg rounded-large border border-outback-line bg-outback-surface p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="font-display text-2xl font-bold uppercase tracking-wide text-outback-cream">
            Outback <span className="text-outback-rust">Peptide Labs</span>
          </div>
        </div>

        {denied ? (
          <div className="text-center">
            <h1 className="mb-4 font-display text-3xl font-bold uppercase text-outback-cream">
              Access Denied
            </h1>
            <p className="text-outback-ink-light">
              You must be 18 years of age or older to access this website.
              <br />
              You are being redirected away from this site.
            </p>
          </div>
        ) : (
          <>
            <h1
              id="age-gate-title"
              className="mb-4 text-center font-display text-3xl font-bold uppercase text-outback-cream"
            >
              Age Verification Required
            </h1>
            <p className="mb-4 text-center text-outback-ink-light">
              This website contains products intended for{" "}
              <strong className="text-outback-cream">
                laboratory research use only
              </strong>{" "}
              and is restricted to persons{" "}
              <strong className="text-outback-cream">
                18&nbsp;years of age or older
              </strong>
              .
            </p>
            <p className="mb-2 font-semibold text-outback-cream">
              By entering, you confirm that:
            </p>
            <ul className="mb-6 list-disc space-y-1 pl-6 text-outback-ink-light">
              <li>You are at least 18 years of age</li>
              <li>You are a qualified researcher or authorised purchaser</li>
              <li>You understand these products are not for human consumption</li>
            </ul>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleEnter}
                className="w-full rounded-base bg-outback-rust px-6 py-3 font-semibold uppercase tracking-wide text-outback-cream transition-colors hover:bg-outback-rust-hover"
                data-testid="age-gate-enter"
              >
                I am 18 or older — Enter Site
              </button>
              <button
                type="button"
                onClick={handleExit}
                className="w-full rounded-base border border-outback-line bg-transparent px-6 py-3 font-semibold uppercase tracking-wide text-outback-ink-light transition-colors hover:bg-outback-raised"
                data-testid="age-gate-exit"
              >
                I am under 18 — Exit
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-outback-muted-light">
              We use browser storage to remember your verification. Providing
              false information to access this site is a breach of our Terms
              &amp; Conditions.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AgeGate
