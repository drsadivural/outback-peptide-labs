import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email", "total", "currency_code"],
    filters: { id: event.data.id },
  })

  if (!order?.email) {
    return
  }

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    data: {
      subject: `Order #${order.display_id} confirmed — Outback Peptide Labs`,
      html: `<p>Thanks for your research supply order #${order.display_id}.</p><p>Total: ${order.total} ${String(order.currency_code).toUpperCase()}.</p>`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
