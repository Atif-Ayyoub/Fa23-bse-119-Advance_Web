import { z } from 'zod'

export const adDraftSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(30).max(5000),
  categoryId: z.coerce.number().int().positive(),
  cityId: z.coerce.number().int().positive(),
  packageId: z.coerce.number().int().positive(),
  mediaUrls: z.array(z.string().trim()).default([]),
})

export const adSubmitSchema = adDraftSchema.superRefine((payload, ctx) => {
  const hasMedia = payload.mediaUrls.some((item) => item.length > 0)

  if (!hasMedia) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['mediaUrls'],
      message: 'At least one media URL is recommended before submit.',
    })
  }
})
