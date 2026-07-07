import { Metadata } from "next"
import LegalLayout from "@modules/legal/components/legal-layout"
import { BRAND_NAME } from "@lib/util/seo"

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `Privacy Policy for ${BRAND_NAME}. Draft — pending legal review.`,
  robots: { index: false, follow: true },
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated={
        <>
          Last updated: <span className="ph">[INSERT DATE]</span> ·{" "}
          <strong>DRAFT — pending legal review</strong>
        </>
      }
      notice={
        <>
          <strong>Template only — not legal advice.</strong> This draft is
          written to align with the Privacy Act 1988 (Cth) and the Australian
          Privacy Principles (APPs), but must be reviewed by a qualified adviser
          and tailored to how you actually collect and use data (payment
          provider, analytics, email tools, shipping carrier, etc.).
        </>
      }
    >
      <h2>1. Who we are</h2>
      <p>
        This policy explains how {BRAND_NAME} (
        <span className="ph">[legal entity name]</span>, ABN{" "}
        <span className="ph">[ABN]</span>) handles your personal information. We
        are committed to protecting your privacy in accordance with the Privacy
        Act 1988 (Cth) and the APPs.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Identity &amp; contact:</strong> name, email, phone, billing
          and shipping address.
        </li>
        <li>
          <strong>Age/eligibility confirmation:</strong> your confirmation that
          you are 18+{" "}
          <span className="ph">
            [and any ID verification you decide to require]
          </span>
          .
        </li>
        <li>
          <strong>Order &amp; transaction data:</strong> products ordered, order
          history, amounts. Card details are processed by our payment provider —
          we do not store full card numbers.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, device/browser
          information, and cookies (see section 6).
        </li>
      </ul>

      <h2>3. How we collect it</h2>
      <p>
        We collect information directly from you when you browse, create an
        account, place an order or contact us, and automatically through cookies
        and similar technologies.
      </p>

      <h2>4. Why we use it</h2>
      <ul>
        <li>
          To process, fulfil and deliver your orders and provide support.
        </li>
        <li>
          To verify eligibility (age/identity) and prevent fraud or unlawful
          supply.
        </li>
        <li>To meet legal and record-keeping obligations.</li>
        <li>
          With your consent, to send marketing you can opt out of at any time.
        </li>
      </ul>

      <h2>5. Who we share it with</h2>
      <p>
        We disclose personal information only as needed to run the business,
        including to:
      </p>
      <ul>
        <li>
          Payment providers (
          <span className="ph">[Stripe / Square / PayPal]</span>);
        </li>
        <li>
          Shipping carriers (
          <span className="ph">[Australia Post / courier]</span>);
        </li>
        <li>IT, hosting, analytics and email service providers;</li>
        <li>Regulators or law enforcement where required by law.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>6. Cookies</h2>
      <p>
        We use cookies/local storage for essential functions — remembering your
        18+ age verification and the contents of your cart — and{" "}
        <span className="ph">[optionally, for analytics]</span>. You can control
        cookies through your browser, but disabling essential cookies may
        prevent the site from working.
      </p>

      <h2>7. Overseas disclosure</h2>
      <p>
        Some of our service providers may store data outside Australia (for
        example <span className="ph">[country/region]</span>). Where they do, we
        take reasonable steps to ensure your information is handled consistently
        with the APPs.
      </p>

      <h2>8. Security &amp; retention</h2>
      <p>
        We take reasonable steps to protect personal information from misuse,
        loss and unauthorised access, and we retain it only as long as needed
        for the purposes above or as required by law, after which it is securely
        destroyed or de-identified.
      </p>

      <h2>9. Access, correction &amp; complaints</h2>
      <p>
        You may request access to, or correction of, your personal information
        by contacting our Privacy Officer at{" "}
        <span className="ph">[privacy@outbackpeptidelabs.com.au]</span>. If you
        are not satisfied with our response, you may contact the Office of the
        Australian Information Commissioner (OAIC) at{" "}
        <a
          href="https://www.oaic.gov.au"
          target="_blank"
          rel="noopener noreferrer"
        >
          oaic.gov.au
        </a>
        .
      </p>

      <h2>10. Contact</h2>
      <p>
        Privacy Officer —{" "}
        <span className="ph">[privacy@outbackpeptidelabs.com.au]</span> ·{" "}
        <span className="ph">[postal address]</span>.
      </p>
    </LegalLayout>
  )
}
