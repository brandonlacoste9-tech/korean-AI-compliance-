import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    frontend: 'Next.js',
    compliance: {
      msit: true,
      pipc: true,
      data_residency: 'Seoul',
    },
  });
}
