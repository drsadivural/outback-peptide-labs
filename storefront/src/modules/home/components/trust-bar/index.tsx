const trustItems = [
  {
    icon: "🚚",
    title: "Express Shipping",
    detail: "Free over $300 AUD",
  },
  {
    icon: "⏱️",
    title: "Same Day Dispatch",
    detail: "Order before 2PM AEST",
  },
  {
    icon: "🔬",
    title: "Third-Party Tested",
    detail: "COA for every batch",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    detail: "Encrypted payments",
  },
]

const TrustBar = () => {
  return (
    <section className="skeuo-brushed border-b border-skeuo-line">
      <div className="content-container grid grid-cols-1 gap-x-6 gap-y-5 divide-skeuo-line/60 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
        {trustItems.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3.5 lg:justify-center lg:px-4"
          >
            <span
              className="skeuo-pin flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-skeuo-cream to-skeuo-parchment2 text-xl"
              aria-hidden="true"
            >
              {item.icon}
            </span>
            <div className="flex flex-col">
              <strong className="text-sm font-bold text-skeuo-ink skeuo-emboss">
                {item.title}
              </strong>
              <small className="text-xs text-skeuo-muted">{item.detail}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBar
