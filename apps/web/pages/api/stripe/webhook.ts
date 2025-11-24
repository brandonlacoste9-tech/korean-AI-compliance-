import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Stripe webhook handler
 * Placeholder for Task #4: Payments PR
 * Handles: checkout.session.completed, invoice.paid, etc.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Implement Stripe webhook verification and handling
  // Must verify signature and process events
  res.status(501).json({
    error: 'Not Implemented',
    message: 'Stripe webhook will be implemented in Task #4: Payments PR',
  });
}
