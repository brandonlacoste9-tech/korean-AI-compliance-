# Backend Logging & Monitoring

Comprehensive logging and monitoring system for the AI Compliance Guardian API.

## Overview

The backend implements structured logging with:
- ✅ JSON-formatted logs in production
- ✅ Human-readable logs in development
- ✅ Request/response logging middleware
- ✅ Error handling with stack traces
- ✅ Performance metrics (request duration)
- ✅ Enhanced health check endpoint

## Architecture

```
app/
├── logging_config.py   # Logging configuration & JSON formatter
├── middleware.py       # Request logging & error handling middleware
└── main.py            # FastAPI app with integrated logging
```

## Configuration

### Environment Variables

Set these in your `.env` file or deployment environment:

```bash
# Logging level: DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_LEVEL=INFO

# Environment: development or production
# (affects log format - JSON in production, readable in development)
ENVIRONMENT=production
```

### Log Levels

- **DEBUG**: Detailed diagnostic information (e.g., risk detection triggers)
- **INFO**: General informational messages (requests, responses, business events)
- **WARNING**: Warning messages for potential issues
- **ERROR**: Error messages for failures
- **CRITICAL**: Critical failures requiring immediate attention

## Log Format

### Production (JSON)

```json
{
  "timestamp": "2025-11-08T05:30:15.123456Z",
  "level": "INFO",
  "logger": "app.main",
  "message": "Risk assessment completed",
  "module": "main",
  "function": "create_risk_assessment",
  "line": 131,
  "extra_fields": {
    "company": "Example Corp",
    "risk_score": 70,
    "recommendation": "professional"
  }
}
```

### Development (Human-Readable)

```
2025-11-08 05:30:15 - app.main - INFO - Risk assessment completed
```

## Logged Events

### 1. Application Startup
```python
logger.info(f"Starting AI Compliance Guardian API (Python {sys.version})")
```

### 2. HTTP Requests
```python
# Incoming request
logger.info("Incoming request", extra={
    "request_id": "1699417815123",
    "method": "POST",
    "path": "/v1/assessments",
    "client_host": "192.168.1.1",
    "user_agent": "Mozilla/5.0..."
})

# Request completed
logger.info("Request completed", extra={
    "request_id": "1699417815123",
    "status_code": 200,
    "duration_ms": 45.32
})
```

### 3. Risk Assessments
```python
# Assessment started
logger.info("Risk assessment requested", extra={
    "company": "Example Corp",
    "ai_usage": "Facial recognition for employee attendance",
    "processes_personal_data": True
})

# Risk factors detected (DEBUG level)
logger.debug("Facial recognition detected", extra={"company": "Example Corp"})

# Assessment completed
logger.info("Risk assessment completed", extra={
    "company": "Example Corp",
    "risk_score": 70,
    "recommendation": "professional"
})
```

### 4. Errors
```python
logger.error("Risk assessment failed: Invalid data", extra={
    "company": "Example Corp",
    "error": "ValueError: Invalid input",
    "traceback": "..."
})
```

### 5. Checkout Events
```python
logger.info("Checkout requested", extra={
    "plan": "professional",
    "currency": "krw",
    "client_ip": "192.168.1.1"
})
```

## Middleware

### RequestLoggingMiddleware

Logs all HTTP requests and responses with:
- Request ID (timestamp-based)
- Method, path, query parameters
- Client IP and User-Agent
- Response status code
- Request duration in milliseconds

Headers added to responses:
```
X-Request-ID: 1699417815123
```

### ErrorHandlingMiddleware

Catches unhandled exceptions and:
- Logs the full stack trace
- Returns a clean JSON error response
- Prevents sensitive error details from leaking to clients

## Health Check Endpoint

Enhanced `/health` endpoint returns:

```json
{
  "status": "healthy",
  "service": "AI Compliance Guardian API",
  "version": "1.0.0",
  "timestamp": "2025-11-08T05:30:15.123456Z",
  "uptime_seconds": 3600.45,
  "environment": "production",
  "python_version": "3.11.5",
  "endpoints": {
    "risk_assessment": "/v1/assessments",
    "health": "/health",
    "docs": "/docs"
  }
}
```

## Monitoring in Production (Render)

### View Logs

1. Go to https://dashboard.render.com
2. Select your service
3. Click "Logs" tab
4. View real-time JSON logs

### Search Logs

Use Render's log filtering:
```
# Find all errors
level:"ERROR"

# Find requests to specific endpoint
path:"/v1/assessments"

# Find slow requests (>1 second)
duration_ms:>1000

# Find requests from specific company
company:"Example Corp"
```

### Set Up Alerts

In Render Dashboard:
1. Go to service settings
2. Set up alerts for:
   - Error rate thresholds
   - Response time degradation
   - Service downtime

## Local Development

### Run with readable logs

```bash
# Set environment to development
export ENVIRONMENT=development
export LOG_LEVEL=DEBUG

# Start server
uvicorn app.main:app --reload
```

### Run with JSON logs (production-like)

```bash
export ENVIRONMENT=production
export LOG_LEVEL=INFO
uvicorn app.main:app --reload
```

## Log Analysis

### Find Errors

```bash
# Filter ERROR logs
cat logs.json | grep '"level":"ERROR"'

# Pretty print with jq
cat logs.json | grep ERROR | jq .
```

### Calculate Average Response Time

```bash
# Extract duration_ms fields
cat logs.json | jq -r '.extra_fields.duration_ms' | awk '{sum+=$1; count+=1} END {print sum/count}'
```

### Most Common Endpoints

```bash
cat logs.json | jq -r '.extra_fields.path' | sort | uniq -c | sort -nr
```

## Best Practices

1. **Use appropriate log levels**
   - DEBUG: Development diagnostics only
   - INFO: Business events, successful operations
   - ERROR: Failures that need investigation

2. **Include context in extra_fields**
   - Always add relevant identifiers (company, user_ip, etc.)
   - Include error details for debugging

3. **Don't log sensitive data**
   - Never log passwords, API keys, or PII
   - Truncate long strings (e.g., `ai_usage[:50]`)

4. **Monitor performance**
   - Watch `duration_ms` for slow requests
   - Set alerts for requests >1000ms

5. **Set up log retention**
   - Configure Render to retain logs for 7-30 days
   - Export critical logs to external storage

## Troubleshooting

### Logs not appearing

Check:
1. `LOG_LEVEL` environment variable is set correctly
2. Uvicorn is outputting to stdout (default)
3. Render service is running

### Too much noise

1. Set `LOG_LEVEL=WARNING` or `LOG_LEVEL=ERROR`
2. Reduce third-party logger levels in `logging_config.py`

### Missing context

Add more fields to `extra_fields` in log statements:
```python
logger.info("Event", extra={"extra_fields": {"key": "value"}})
```

## Future Enhancements

- [ ] Log aggregation (e.g., Datadog, CloudWatch)
- [ ] Performance metrics dashboard
- [ ] Automated error alerting
- [ ] Request tracing across services
- [ ] Log sampling for high-volume endpoints
