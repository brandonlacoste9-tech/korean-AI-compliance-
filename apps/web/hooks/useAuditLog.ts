import { useEffect } from 'react';
import { logAuditEvent } from '@/lib/supabaseClient';

interface AuditLogOptions {
  userId?: string;
  action: string;
  details?: Record<string, any>;
}

/**
 * Hook for PIPC-compliant audit logging
 * Automatically logs actions with user context and IP address
 */
export function useAuditLog({ userId, action, details }: AuditLogOptions) {
  useEffect(() => {
    if (userId && action) {
      // Get client IP (would need to be passed from API in production)
      const clientIP = 'client'; // Placeholder
      
      logAuditEvent(userId, action, details || {}, clientIP);
    }
  }, [userId, action, details]);
}

/**
 * Manual audit logging function
 * For use in event handlers or API routes
 */
export async function logUserAction(
  userId: string,
  action: string,
  details?: Record<string, any>
) {
  try {
    await logAuditEvent(userId, action, details || {});
  } catch (error) {
    console.error('Audit log error:', error);
  }
}
