import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import { Resend } from "resend"

type InjectedDependencies = {
  logger: Logger
}

type Options = {
  api_key: string
  from: string
}

export default class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"

  protected logger_: Logger
  protected client_: Resend
  protected from_: string

  constructor({ logger }: InjectedDependencies, options: Options) {
    super()

    this.logger_ = logger
    this.client_ = new Resend(options.api_key)
    this.from_ = options.from
  }

  static validateOptions(options: Record<string, unknown>): void {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend notification provider requires an `api_key` option."
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend notification provider requires a `from` option."
      )
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const data = (notification.data ?? {}) as Record<string, unknown>

    const { data: sent, error } = await this.client_.emails.send({
      from: this.from_,
      to: [notification.to],
      subject: (data.subject as string) ?? "Your Outback Peptide Labs order",
      html: (data.html as string) ?? "<p>Thank you for your order.</p>",
    })

    if (error) {
      this.logger_?.error(`Resend failed to send email: ${error.message}`)
      throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, error.message)
    }

    return { id: sent?.id }
  }
}
