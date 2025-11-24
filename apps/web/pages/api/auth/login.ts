import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Authentication login endpoint
 * Placeholder for Task #3: Auth and Data PR
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Implement Supabase Auth login
  res.status(501).json({
    error: 'Not Implemented',
    message: 'Authentication will be implemented in Task #3: Auth and Data PR',
    message_ko: '인증은 작업 #3: 인증 및 데이터 PR에서 구현될 예정입니다',
  });
}
