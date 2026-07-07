import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60 * 1000)

/**
 * Proves the 18+ DOB gate is enforced server-side at cart completion.
 *
 * The `completeCartWorkflow` runs `validateCartItemsStep` and
 * `validateCartPaymentsStep` BEFORE our `validate` age hook. To reach the age
 * hook we therefore create carts that:
 *   - have at least one line item (passes item validation), and
 *   - have a zero total (a single line item priced at 0), which triggers the
 *     `canSkipPayment` branch in `validateCartPaymentsStep` so no payment
 *     session is required.
 *
 * Line items are created directly through the Cart Module with an explicit
 * `unit_price` and `title` (no variant / pricing / inventory seeding needed),
 * which keeps the test focused on the age gate rather than catalogue setup.
 *
 * We assert on the thrown error's `message` (via try/catch) rather than
 * `rejects.toThrow`, because `completeCartWorkflow.run()` throws a serialized
 * `MedusaError`-shaped object and message matching is the reliable signal.
 */
medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    const createCart = async (metadata?: Record<string, unknown>) => {
      const container = getContainer()
      const cartModule = container.resolve(Modules.CART)

      const cart = await cartModule.createCarts({
        currency_code: "usd",
        email: "buyer@example.com",
        metadata,
        items: [
          {
            title: "Age-gate test item",
            quantity: 1,
            // Zero unit price => cart total 0 => payment validation skipped,
            // so the workflow reaches the age validate hook.
            unit_price: 0,
          },
        ],
      })

      return cart.id
    }

    // Runs completion and returns the thrown error (or undefined on success).
    const completeAndCatch = async (
      cartId: string
    ): Promise<Error | undefined> => {
      try {
        await completeCartWorkflow(getContainer()).run({
          input: { id: cartId },
        })
        return undefined
      } catch (e) {
        return e as Error
      }
    }

    describe("18+ DOB gate at cart completion", () => {
      it("rejects an under-18 cart via the validate hook", async () => {
        const cartId = await createCart({
          date_of_birth: "2010-01-01", // ~14 years old
          age_attested: true,
        })

        const err = await completeAndCatch(cartId)

        expect(err).toBeDefined()
        expect(err!.message).toMatch(/18 years/i)
      })

      it("rejects a cart with no date-of-birth metadata", async () => {
        const cartId = await createCart({})

        const err = await completeAndCatch(cartId)

        expect(err).toBeDefined()
        expect(err!.message).toMatch(/date of birth/i)
      })

      it("rejects a cart that is present but not attested", async () => {
        const cartId = await createCart({ date_of_birth: "1990-01-01" })

        const err = await completeAndCatch(cartId)

        expect(err).toBeDefined()
        expect(err!.message).toMatch(/18\+|authorised/i)
      })

      it("does not reject an attested adult on age grounds", async () => {
        const cartId = await createCart({
          date_of_birth: "1990-01-01",
          age_attested: true,
        })

        // Completion may still fail for unrelated reasons (fulfilment, order
        // creation, etc.) in this minimal harness, but it must NOT fail on any
        // of the age-gate assertions.
        const err = await completeAndCatch(cartId)

        if (err) {
          expect(err.message).not.toMatch(/date of birth|18 years|authorised/i)
        }
      })
    })
  },
})
