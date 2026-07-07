# Outback Peptide Labs — Website

An Australian research-peptide storefront (demo). Static HTML/CSS/JavaScript — no build step, no framework, no database. Opens in any browser.

> **Status:** front-end demo. The cart works but there is **no real checkout or payment processing**, and the 18+ age gate is browser-side only. Do not treat this as a launched, compliant store — see [Before going live](#before-going-live).

---

## Quick start

**Option A — just open it**
Double-click `index.html`. Everything runs client-side.

**Option B — local server** (needed if a browser blocks local file access)
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
# then visit http://localhost:8737
```
`serve.ps1` is a tiny PowerShell static-file server used because this machine has no Node or Python. It is **only for local preview** and is not deployed.

---

## File structure

```
peptide-store-au/
├── index.html               Main shop page (hero, catalogue, bulk kits, FAQ, footer)
├── styles.css               All styling + the Outback brand theme
├── app.js                   Catalogue data + all interactivity (see below)
├── serve.ps1                Local preview server (dev only)
├── README.md                This file
├── compliance-checklist.html  Internal — questions for a regulatory adviser (not linked publicly)
├── images/
│   ├── logo-kangaroo.png    Hero badge (kangaroo sunset)
│   ├── logo-badge.png       Tree badge (age gate, favicon)
│   ├── logo-badge-dark.png  Footer badge
│   ├── logo-horizontal.png  Horizontal lockup (unused on site; grey background baked in)
│   └── retatrutide.avif     Retatrutide product photo
└── legal/
    ├── terms.html           Terms & Conditions (DRAFT)
    ├── privacy.html         Privacy Policy (DRAFT)
    ├── refunds.html         Refund & Returns Policy (DRAFT)
    └── shipping.html        Shipping Policy (DRAFT)
```

---

## Editing the catalogue

All products live in the **`PRODUCTS`** array at the top of `app.js`. Each entry:

```js
{
  id: "bpc-157",                                  // unique slug
  name: "BPC-157",
  category: "Tissue Repair & Regenerative Support", // becomes a filter tab automatically
  desc: "A synthetic peptide fragment ...",
  badge: "Popular",                                // or null (small pill on the card)
  color: "#a84e1c",                                // tint for the drawn vial (if no image)
  image: "images/retatrutide.avif",                // optional; overrides the drawn vial
  optionLabel: "Size",                             // optional; renames the "Dosage" selector
  noCoa: true,                                      // optional; hides the "Lab Report" link
  variants: [
    { dose: "5mg", price: 59.95 },                 // price in AUD
    { dose: "10mg", price: 94.99 },
  ],
}
```

- **Add a product:** copy a block, change the fields. Done.
- **Add a category/tab:** just give a product a new `category` value — the filter tabs build themselves from whatever categories exist, in the order products first appear.
- **Change a price:** edit the `price` in its variant.
- **Bulk kits** are a separate `KITS` array lower in `app.js`, rendered in the "Bulk Kits" section.

### Current categories
1. Tissue Repair & Regenerative Support
2. Hormonal Balance & Metabolic Regulation
3. Resilience & Healthy Aging
4. Neuro-Enhancement & Specialty Protocols
5. Lab Supplies

### Pricing note
Prices were set on **6 Jul 2026** to the cheapest of Outback vs aussiepeptides.au (per the *Best Price List* workbook). They mix `.95` and `.99` endings depending on which source was cheaper. All prices are AUD.

---

## Features

- **18+ age gate** — modal on first visit; "Enter" sets a `localStorage` flag, "Exit" redirects away. Client-side only (not enforced verification).
- **Category filter tabs** — filter the grid by category; built from product data.
- **Dosage/size selector** — per-variant pricing updates live on the card.
- **Cart** — slide-out drawer, quantity controls, AUD subtotal, persists via `localStorage`. Checkout is a demo stub.
- **Bulk Kits** section — bundled multi-vial kits with tiered pricing.
- **Responsive** — works down to mobile widths.
- **Legal pages** — Terms, Privacy, Refunds, Shipping (all drafts with `[placeholders]`).

---

## Brand / design

Palette drawn from the Outback logo (defined as CSS variables at the top of `styles.css`):

| Token | Hex | Use |
|-------|-----|-----|
| Black | `#0e0b08` | page background, footer |
| Burnt rust | `#a84e1c` | primary buttons, accents |
| Amber | `#e0954c` | highlights, labels |
| Cream | `#f7eeda` | logo text, headings on dark |

Fonts: **Oswald** (headings) + **Inter** (body), loaded from Google Fonts.

---

## Deployment

The site is plain static files, so any static host works — **Netlify, Cloudflare Pages, or Vercel** (free tiers, drag-and-drop, automatic HTTPS). Upload `index.html`, `styles.css`, `app.js`, and the `images/` and `legal/` folders. **Do not** upload `serve.ps1` (dev only) or `compliance-checklist.html` (internal). Point your domain at the host.

---

## Before going live

This is a demo front end. A real store still needs:

1. **A real checkout + payments** (e.g. Shopify, or Stripe/Square + a backend). The current cart cannot take money.
2. **Server-side age/ID verification** if selling age-restricted products.
3. **Real business details** — replace the placeholder ABN, email, and the `[placeholders]` throughout the legal pages; have a lawyer finalise them.
4. **Regulatory advice.** Many items in this catalogue (Retatrutide, Tirzepatide, the GH secretagogues, Melanotan, PT-141, etc.) are **Schedule 4 prescription-only substances** in Australia. Selling them to the public is restricted regardless of "research use only" wording, and payment processors commonly ban the category. Work through `compliance-checklist.html` with a regulatory adviser **before** launch.

Nothing in this repository is legal advice.
