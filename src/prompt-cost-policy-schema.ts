/** Advertised JSON Schema preserves executable cost-policy validation across MCP clients. */
export const promptCostPolicyJsonSchema = {
  oneOf: [
    {
      properties: {
        cost_policy: {
          enum: ["hard_cap"],
        },
        max_cost_cents: {
          description: "Maximum guaranteed cost in cents for hard-cap mode.",
        },
      },
      required: ["max_cost_cents"],
      not: {
        anyOf: [
          {
            required: ["actual_cost_acknowledgement"],
          },
          {
            required: ["estimated_cost_limit_cents"],
          },
          {
            required: ["estimate_credentials_ref"],
          },
        ],
      },
    },
    {
      properties: {
        cost_policy: {
          const: "provider_actual_cost",
          description: "Hard cap or explicitly consented provider actual cost.",
        },
        idempotency_key: {
          type: "string",
          format: "uuid",
        },
        actual_cost_acknowledgement: {
          description: "Explicit consent that actual cost has no guaranteed maximum.",
        },
        estimated_cost_limit_cents: {
          description: "Advisory estimate limit in cents.",
        },
      },
      required: ["cost_policy", "actual_cost_acknowledgement", "estimated_cost_limit_cents"],
      not: {
        required: ["max_cost_cents"],
      },
      allOf: [
        {
          if: {
            not: {
              properties: {
                estimate_only: {
                  const: true,
                },
              },
              required: ["estimate_only"],
            },
          },
          // biome-ignore lint/suspicious/noThenProperty: JSON Schema uses then for conditional validation.
          then: {
            required: ["idempotency_key", "estimate_credentials_ref"],
          },
        },
      ],
    },
  ],
} as const;
