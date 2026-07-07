import { Metadata } from "next"
import LegalLayout from "@modules/legal/components/legal-layout"
import { BRAND_NAME } from "@lib/util/seo"

export const metadata: Metadata = {
  title: `Shipping Policy — ${BRAND_NAME}`,
  description: `Shipping Policy for ${BRAND_NAME}. Draft — pending legal review.`,
  robots: { index: false, follow: true },
}

export default function ShippingPage() {
  return (
    <LegalLayout
      title="Shipping Policy"
      updated={
        <>
          Last updated: <span className="ph">[INSERT DATE]</span> ·{" "}
          <strong>DRAFT — pending legal review</strong>
        </>
      }
      notice={
        <>
          <strong>Template only.</strong> Confirm your real carrier rates,
          dispatch cut-offs, cold-chain method and any domestic/international
          restrictions before publishing. Importantly, confirm with your adviser
          whether you may lawfully ship each product and to whom.
        </>
      }
    >
      <h2>1. Dispatch times</h2>
      <p>
        Orders placed before <strong>2:00 PM AEST</strong> on a business day are
        dispatched the same day. Orders placed after the cut-off, on weekends or
        public holidays are dispatched the next business day.
      </p>

      <h2>2. Carrier &amp; delivery estimates</h2>
      <ul>
        <li>
          We ship via{" "}
          <span className="ph">[Australia Post Express / courier]</span> with
          tracking.
        </li>
        <li>
          Metro: approximately <span className="ph">[1–2]</span> business days
          after dispatch.
        </li>
        <li>
          Regional/remote: approximately <span className="ph">[2–6]</span>{" "}
          business days after dispatch.
        </li>
      </ul>
      <p>
        Delivery timeframes are estimates provided by the carrier and are not
        guaranteed.
      </p>

      <h2>3. Shipping costs</h2>
      <ul>
        <li>
          Flat-rate express shipping: <span className="ph">[$X.XX]</span> AUD.
        </li>
        <li>
          <strong>Free express shipping</strong> on orders over{" "}
          <span className="ph">[$300]</span> AUD.
        </li>
        <li>Costs are calculated and shown at checkout.</li>
      </ul>

      <h2>4. Packaging &amp; cold chain</h2>
      <p>
        Temperature-sensitive items are packed{" "}
        <span className="ph">[with insulated packaging / ice packs]</span> to
        maintain integrity in transit.{" "}
        <span className="ph">[Describe your cold-chain method.]</span>
      </p>

      <h2>5. Delivery area</h2>
      <p>
        We currently ship{" "}
        <span className="ph">[within Australia only]</span>.{" "}
        <span className="ph">
          [State any regions or products you do not ship, and note any
          import/export restrictions.]
        </span>
      </p>

      <h2>6. Lost, delayed or undelivered orders</h2>
      <p>
        If tracking shows no movement for{" "}
        <span className="ph">[e.g. 5 business days]</span>, or your order is
        marked delivered but not received, contact{" "}
        <span className="ph">[support@outbackpeptidelabs.com.au]</span> and we
        will open an enquiry with the carrier.
      </p>

      <h2>7. Contact</h2>
      <p>
        <span className="ph">[support@outbackpeptidelabs.com.au]</span> ·{" "}
        <span className="ph">[phone]</span>
      </p>
    </LegalLayout>
  )
}
