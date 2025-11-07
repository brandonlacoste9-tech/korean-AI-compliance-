# Deployment Guide

## Prerequisites
- Docker
- Kubernetes

## Steps to Deploy
1. Build your Docker image:
   ```bash
   docker build -t korean-ai-compliance .
   ```
2. Push the image to your container registry:
   ```bash
   docker push korean-ai-compliance
   ```
3. Deploy to your Kubernetes cluster:
   ```bash
   kubectl apply -f k8s/Deployment.yaml
   ```