import { z } from 'zod'

export const paymentProofSchema = z.object({
  adId: z.coerce.number().int().positive('Select an ad.'),
  amount: z.coerce.number().positive('Amount must be greater than zero.'),
  method: z.string().trim().min(2, 'Payment method is required.'),
  transactionRef: z.string().trim().min(4, 'Transaction reference is required.'),
  senderName: z.string().trim().min(2, 'Sender name is required.'),
  screenshotUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^https?:\/\//i.test(value), 'Screenshot URL must start with http or https.'),
})
