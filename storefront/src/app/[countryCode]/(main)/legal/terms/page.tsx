import { Metadata } from "next"
import LegalLayout from "@modules/legal/components/legal-layout"
import { BRAND_NAME } from "@lib/util/seo"

export const metadata: Metadata = {
  title: `Terms & Conditions — ${BRAND_NAME}`,
  description: `Terms & Conditions for ${BRAND_NAME}. Draft — pending legal review.`,
  robots: { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated={
        <>
          Last updated: <span className="ph">[INSERT DATE]</span> ·{" "}
          <strong>DRAFT — pending legal review</strong>
        </>
      }
      notice={
        <>
          <strong>Template only — not legal advice.</strong> This document was
          drafted as a starting point and contains placeholders shown in{" "}
          <span className="ph">[square brackets]</span>. It must be reviewed and
          adapted by a qualified Australian lawyer before publication,
          particularly given the regulated nature of the products.
        </>
      }
    >
      <h2>1. About these terms</h2>
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to
        and use of the website at <span className="ph">[domain]</span> and any
        purchase you make from {BRAND_NAME} (
        <span className="ph">[legal entity name]</span>, ABN{" "}
        <span className="ph">[ABN]</span>) (&quot;we&quot;, &quot;us&quot;,
        &quot;our&quot;). By accessing the site or placing an order you agree to
        these Terms. If you do not agree, do not use the site.
      </p>

      <h2>2. Eligibility &amp; age restriction</h2>
      <ul>
        <li>
          You must be at least <strong>18 years of age</strong> to access this
          site or place an order.
        </li>
        <li>
          You confirm you are a qualified researcher or an authorised purchaser
          acquiring products for lawful purposes.
        </li>
        <li>
          We may require verification of your age, identity or purpose at any
          time and may refuse or cancel any order at our discretion.
        </li>
      </ul>

      <h2>3. Research use only — not for human consumption</h2>
      <p>
        All products are supplied strictly for{" "}
        <strong>in-vitro laboratory research use only</strong>. They are{" "}
        <strong>
          not for human or veterinary use, consumption, ingestion or
          administration
        </strong>
        , are not therapeutic goods, and are not intended to diagnose, treat,
        cure or prevent any condition. Nothing on the site is medical advice.
        You are solely responsible for handling, storing and using the products
        lawfully and safely, and for complying with all laws that apply to you.
      </p>

      <h2>4. Products, pricing &amp; availability</h2>
      <ul>
        <li>
          All prices are in Australian dollars (AUD) and{" "}
          <span className="ph">[include / exclude]</span> GST as marked.
        </li>
        <li>
          We may change prices, product descriptions and availability at any
          time without notice.
        </li>
        <li>
          We try to describe products accurately but do not warrant that
          descriptions are error-free.
        </li>
        <li>
          Product images may be illustrative and may not depict the exact item
          supplied.
        </li>
      </ul>

      <h2>5. Orders &amp; acceptance</h2>
      <p>
        Your order is an offer to purchase. A contract is formed only when we
        send an order-confirmation or dispatch notice. We may decline or cancel
        an order (including after confirmation) — for example, where stock is
        unavailable, pricing was listed in error, we cannot verify you, or
        supply would be unlawful — and will refund any amount already paid for
        cancelled items.
      </p>

      <h2>6. Payment</h2>
      <p>
        Payment is processed by our third-party payment provider(s) (
        <span className="ph">[e.g. Stripe / Square / PayPal]</span>). You warrant
        you are authorised to use the payment method. We do not store full card
        details.
      </p>

      <h2>7. Shipping &amp; delivery</h2>
      <p>
        Delivery is governed by our{" "}
        <a href="/au/legal/shipping">Shipping Policy</a>. Risk in the products
        passes to you on delivery to the address you provide. Delivery estimates
        are not guarantees.
      </p>

      <h2>8. Returns &amp; refunds</h2>
      <p>
        Returns and refunds are governed by our{" "}
        <a href="/au/legal/refunds">Refund &amp; Returns Policy</a> and your
        rights under the Australian Consumer Law.
      </p>

      <h2>9. Prohibited conduct</h2>
      <ul>
        <li>
          You must not on-sell, supply or represent the products for human or
          animal use.
        </li>
        <li>
          You must not use the site unlawfully, misrepresent your age, identity
          or purpose, or breach any applicable regulation.
        </li>
        <li>
          You must not interfere with, scrape or attempt to disrupt the site.
        </li>
      </ul>

      <h2>10. Limitation of liability</h2>
      <p>
        Nothing in these Terms excludes rights or guarantees you have under the
        Australian Consumer Law that cannot lawfully be excluded. Subject to
        that, to the maximum extent permitted by law our liability is limited to{" "}
        <span className="ph">
          [re-supplying the goods or refunding the price paid]
        </span>
        , and we are not liable for any loss arising from misuse of the products
        or use contrary to their research-only purpose.
      </p>

      <h2>11. Indemnity</h2>
      <p>
        You indemnify us against any loss, claim or liability arising from your
        breach of these Terms or your unlawful or unsafe use, handling or supply
        of the products.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These Terms are governed by the laws of{" "}
        <span className="ph">[State/Territory, e.g. New South Wales]</span>,
        Australia, and you submit to the non-exclusive jurisdiction of its
        courts.
      </p>

      <h2>13. Changes &amp; contact</h2>
      <p>
        We may update these Terms from time to time; the current version is
        always the one published here. Questions:{" "}
        <span className="ph">[support@outbackpeptidelabs.com.au]</span>.
      </p>
    </LegalLayout>
  )
}
