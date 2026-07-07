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
    <section className="bg-outback-surface border-y border-outback-line">
      <div className="content-container grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              {item.icon}
            </span>
            <div className="flex flex-col">
              <strong className="text-sm font-semibold text-outback-cream">
                {item.title}
              </strong>
              <small className="text-xs text-outback-muted-light">
                {item.detail}
              </small>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBar
