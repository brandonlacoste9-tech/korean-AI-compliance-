# Security Updates - February 2026

## Summary of Changes

### 1. API Key Authentication ✅
- **File:** `app/security.py` (new)
- **Protected endpoints:**
  - `GET /api/v1/consent` - Read consent logs
  - `GET /api/v1/audit-logs` - Read audit logs
  - `GET /api/v1/audit-logs/export` - Export CSV
  - `GET /api/v1/user-data/{user_id}` - Data portability
  - `DELETE /api/v1/retention/purge` - 3-year purge
- **Usage:** Add header `X-API-Key: your-key` to requests
- **Env var:** `INTERNAL_API_KEY`

### 2. Rate Limiting ✅
- **File:** `app/rate_limit.py` (new)
- **Limits:** 100 requests per minute per IP
- **Applied to:** All endpoints except `/health`, `/`, `/docs`
- **Note:** For production, consider Redis for distributed rate limiting

### 3. Field-Level Encryption (PII) ✅
- **File:** `app/encryption.py` (new)
- **Algorithm:** AES-256-GCM (Fernet)
- **Env var:** `ENCRYPTION_SECRET`
- **Usage:** Import and use `encrypt_pii()`, `decrypt_pii()` functions

### 4. Stripe Webhook Signature Verification ✅
- **Status:** Already implemented in `main.py`
- **Enforced in production** when `ENVIRONMENT=production`
- **Env var:** `STRIPE_WEBHOOK_SECRET`

### 5. Data Portability Endpoint ✅
- **Endpoint:** `GET /api/v1/user-data/{user_identifier}`
- **Returns:** All consent, audit, and AI processing logs for user
- **Auth:** Requires API key

### 6. 3-Year Retention Policy ✅
- **Endpoint:** `DELETE /api/v1/retention/purge?dry_run=true`
- **Purpose:** Delete records older than 3 years per PIPC
- **Auth:** Requires API key

## New Environment Variables

```bash
# Required in production
INTERNAL_API_KEY=your-secure-random-key
ENCRYPTION_SECRET=<fernet-key>  # Generate with: python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key())"
STRIPE_WEBHOOK_SECRET=whsec_...
ENVIRONMENT=production
```

## Dependencies Added

```
cryptography==44.0.0
slowapi==0.1.9
```

## Testing

```bash
# Test rate limiting
for i in {1..110}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/health; done

# Test API key auth (should fail without key)
curl http://localhost:8000/api/v1/consent
# Expected: 401 API key required

# Test with API key
curl -H "X-API-Key: your-key" http://localhost:8000/api/v1/consent

# Test data portability
curl -H "X-API-Key: your-key" http://localhost:8000/api/v1/user-data/user@example.com
```

## Migration Checklist

- [ ] Set `INTERNAL_API_KEY` in production environment
- [ ] Generate and set `ENCRYPTION_SECRET`
- [ ] Configure `STRIPE_WEBHOOK_SECRET` for Stripe
- [ ] Set `ENVIRONMENT=production`
- [ ] Update client applications to include `X-API-Key` header
- [ ] Test all protected endpoints
- [ ] Enable encryption on existing PII fields (migration script needed)
