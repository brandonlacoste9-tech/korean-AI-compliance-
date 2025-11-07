# Use official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy setup files
COPY setup.py .
COPY app ./app

# Install dependencies
RUN pip install --upgrade pip && \
    pip install .

# Expose port (Railway will set $PORT)
ENV PORT=8000

# Start command
CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT
