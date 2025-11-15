import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Stripe checkout session creation
 * Placeholder for Task #4: Payments PR
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // TODO: Implement Stripe checkout session creation (KRW only)
  res.status(501).json({
    error: 'Not Implemented',
    message: 'Stripe checkout will be implemented in Task #4: Payments PR',
    message_ko: 'Stripe 체크아웃은 작업 #4: 결제 PR에서 구현될 예정입니다',
  });
}
