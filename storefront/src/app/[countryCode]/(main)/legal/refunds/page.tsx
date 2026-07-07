import { Metadata } from "next"
import LegalLayout from "@modules/legal/components/legal-layout"
import { BRAND_NAME } from "@lib/util/seo"

export const metadata: Metadata = {
  title: `Refund & Returns Policy — ${BRAND_NAME}`,
  description: `Refund & Returns Policy for ${BRAND_NAME}. Draft — pending legal review.`,
  robots: { index: false, follow: true },
}

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund & Returns Policy"
      updated={
        <>
          Last updated: <span className="ph">[INSERT DATE]</span> ·{" "}
          <strong>DRAFT — pending legal review</strong>
        </>
      }
      notice={
        <>
          <strong>Template only — not legal advice.</strong> Your policy must
          comply with the Australian Consumer Law (ACL). You cannot contract out
          of the consumer guarantees. A lawyer should confirm the wording,
          especially the &quot;non-returnable for safety/sterility&quot; position
          for opened vials.
        </>
      }
    >
      <h2>1. Your rights under the Australian Consumer Law</h2>
      <p>
        Our goods come with guarantees that cannot be excluded under the
        Australian Consumer Law. You are entitled to a replacement or refund for
        a major failure, and to compensation for other reasonably foreseeable
        loss or damage. You are also entitled to have goods repaired or replaced
        if they fail to be of acceptable quality and the failure does not amount
        to a major failure.
      </p>

      <h2>2. Damaged, incorrect or faulty items</h2>
      <p>
        If your order arrives damaged, incorrect, or is faulty, contact us
        within <span className="ph">[e.g. 7 days]</span> of delivery at{" "}
        <span className="ph">[support@outbackpeptidelabs.com.au]</span> with your
        order number and photos. We will arrange a replacement or refund in line
        with the ACL.
      </p>

      <h2>3. Change of mind</h2>
      <p>
        For change-of-mind returns,{" "}
        <span className="ph">
          [state your policy — e.g. accepted within X days for unopened,
          undamaged items in original packaging, with the buyer paying return
          postage]
        </span>
        . Change-of-mind returns are offered at our discretion and are separate
        from your ACL rights.
      </p>

      <h2>4. Items we cannot accept back</h2>
      <p>
        For safety, sterility and integrity reasons we{" "}
        <span className="ph">
          [cannot accept the return of opened or tamper-seal-broken vials, or
          temperature-sensitive items once dispatched]
        </span>
        , except where the item is faulty or there has been a failure of a
        consumer guarantee. This does not limit your ACL rights.
      </p>

      <h2>5. How to request a return or refund</h2>
      <ol>
        <li>
          Email{" "}
          <span className="ph">[support@outbackpeptidelabs.com.au]</span> with
          your order number and reason.
        </li>
        <li>
          We will respond with return instructions (if applicable) within{" "}
          <span className="ph">[e.g. 2 business days]</span>.
        </li>
        <li>
          Approved refunds are processed to your original payment method within{" "}
          <span className="ph">[e.g. 5–10 business days]</span>.
        </li>
      </ol>

      <h2>6. Contact</h2>
      <p>
        <span className="ph">[support@outbackpeptidelabs.com.au]</span> ·{" "}
        <span className="ph">[phone]</span> ·{" "}
        <span className="ph">[postal address]</span>
      </p>
    </LegalLayout>
  )
}
