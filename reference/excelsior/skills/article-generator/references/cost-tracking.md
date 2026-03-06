# Cost Tracking

Generating AI content involves costs from both Google Gemini and Replicate. This document explains how to calculate and record these costs.

## Pricing Reference (Example)

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
| :--- | :--- | :--- |
| Gemini 3 Flash | $0.10 | $0.40 |
| Gemini 3 Pro | $1.25 | $10.00 |

| Image Model | Rate (per GPU second) |
| :--- | :--- |
| nano-banana-pro | $0.0023 |

## Calculation Formulas

### Gemini Cost
```typescript
const inputCost = (inputTokens / 1_000_000) * inputPerMillion;
const outputCost = (outputTokens / 1_000_000) * outputPerMillion;
const totalGeminiCost = inputCost + outputCost;
```

### Replicate Cost
```typescript
const totalReplicateCost = predictTimeSeconds * ratePerSecond;
```

## Tracking Schema
Store generation costs in the article record to monitor ROI and budget.

```typescript
generationCosts: {
  topicResearch: { inputTokens: number, outputTokens: number, cost: number },
  articleGeneration: { inputTokens: number, outputTokens: number, cost: number },
  infographicData: { inputTokens: number, outputTokens: number, cost: number },
  featuredImage: { model: string, predictTime: number, cost: number },
  infographicImage: { model: string, predictTime: number, cost: number },
  totalCost: number,
  generatedAt: string
}
```

## Cost Estimation (Backdating)
When generating many articles at once, estimate the total cost based on the average cost of recent successful generations:
`Estimated Total = Number of Articles * Average Cost Per Article`

