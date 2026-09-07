---
title: "IAM Job Scout"
kicker: "Identity · Tooling"
summary: "A FastAPI job board that pulls IAM roles from three job APIs, de-duplicates them with fuzzy matching, filters out senior titles, and ships with Prometheus metrics, a Grafana dashboard and Docker Compose deployment."
category: identity
status: complete
statusLabel: "Completed"
order: 40
period: "2025"
repo: https://github.com/noble-antwi/iam-job-scout
docs: https://github.com/noble-antwi/iam-job-scout/blob/main/docs/MONITORING.md
docsLabel: "Monitoring guide"
stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "Prometheus", "Grafana"]
relatedTags: ["okta", "iam"]
stats:
  - { value: "12+", label: "API endpoints" }
  - { value: "30+", label: "Metrics tracked" }
  - { value: "3", label: "Job sources" }
  - { value: "3", label: "Deployment targets" }
hero: ../../assets/work/iam-job-scout/diagram.svg
heroAlt: "Architecture diagram: three job APIs feeding a FastAPI service with PostgreSQL, a Jinja UI, and Prometheus and Grafana for monitoring"
heroCaption: "Three sources in, one de-duplicated board out, with the service reporting on itself through Prometheus and Grafana."
gallery:
  - src: ../../assets/work/iam-job-scout/architecture.png
    alt: "Component diagram from the repository: scheduler and web client into FastAPI route handlers, service layer, API manager calling JSearch, Adzuna and RemoteOK, job filter and deduplicator, SQLAlchemy into SQLite or PostgreSQL"
    caption: "The component diagram from the repository: scheduler and browser into FastAPI, the service layer, search orchestration across three APIs, filtering and de-duplication, then SQLAlchemy into SQLite or PostgreSQL."
---

Build an automated, production-grade web application that helps junior to mid-level Identity & Access Management (IAM) professionals discover relevant job opportunities across the USA. The application automatically searches for IAM job postings using multiple job APIs (JSearch, Adzuna, and RemoteOK) with intelligent deduplication, filters out senior positions, and presents them in a clean, searchable interface with smart filtering and monitoring capabilities.

## Core Technologies & Stack

Python · FastAPI · Jinja2 Templates · TailwindCSS · SQLite · PostgreSQL · APScheduler · Prometheus · Grafana · Docker · Docker Compose · JSearch API · Adzuna API · RemoteOK API

## Key Features

- **Multi-API Integration:** Searches JSearch (Indeed, LinkedIn, Glassdoor), Adzuna, and RemoteOK concurrently for comprehensive job coverage across multiple platforms
- **Smart Deduplication:** Uses fuzzy matching algorithms to automatically eliminate duplicate job listings from different sources
- **Smart Job Filtering:** Automatically excludes senior/advanced roles while focusing on junior to mid-level positions (0-5 years experience)
- **Full-Text Search:** Search across job title, company name, and description with real-time results
- **Location Filtering:** Geographic filtering to find jobs in specific regions
- **Multiple Sorting Options:** Sort by newest, oldest, relevance, or company name
- **Job Status Tracking:** Mark jobs as saved, applied, or hidden to manage your application process
- **Auto-Cleanup:** Jobs older than 30 days are automatically removed to keep listings fresh
- **Scheduled Scanning:** Configurable automatic job searches (default: Monday/Wednesday/Saturday)
- **Similar Job Suggestions:** View related opportunities when viewing job details
- **Admin Panel:** Secure, password-protected admin interface for manual job scanning
- **Demo Mode:** Works without API keys using sample data for testing
- **API Token Protection:** Secure endpoints for cron-triggered operations
- **Production Monitoring:** Built-in Prometheus metrics and Grafana dashboard support

## Intelligent Filtering Logic

> **Excluded Keywords (Senior Roles):** senior, sr, principal, architect, lead, manager, director, head, vp, staff, distinguished, chief
>
> **Included Keywords (Junior/Mid Roles):** analyst, associate, administrator, engineer, specialist, iam, identity, okta, entra, azure ad, sso, saml, oidc, scim, iga, pam, sailpoint, saviynt, ping, cyberark
>
> **Experience Filters:** Include 0-5, 1-3, 2-4, 3-5 years | Exclude 7+, 10+, 12+ years

## Production-Grade Monitoring & Observability

> #### **Application Performance Metrics**
>
> HTTP request duration histograms (p50, p95, p99), request rate by endpoint, error rate tracking, and concurrent request monitoring

> #### **Business Metrics**
>
> Total jobs in database, new jobs this week, saved/applied job tracking, scan success rate, and last successful scan timestamp

> #### **Database & System Metrics**
>
> Query duration tracking, active connection pool utilization, database operations by type, memory usage, and Python garbage collection metrics

## API Endpoints & Architecture

> **Public Endpoints:** Main job board with search/filters, individual job details, admin login, JSON API for jobs/stats, health check, Prometheus metrics
>
> **Protected Endpoints (Session Auth or API Token):** Manual job scan trigger, automatic cleanup of old jobs (30+ days)

## Deployment Options

> #### Render (Recommended)
>
> Easiest deployment with built-in cron job support, automatic HTTPS, and zero-config environment

> #### Fly.io
>
> Docker-based deployment with generous free tier and global edge network support

> #### VPS
>
> Full control deployment on DigitalOcean, AWS Lightsail, or Ubuntu Server with Docker Compose

## Security Features

- **Password-Protected Admin Panel:** Secure authentication for manual job scanning operations
- **API Token Authentication:** X-ADMIN-TOKEN header validation for cron job endpoints
- **Session Secret Encryption:** Secure session management with cryptographic session keys
- **Environment Variable Configuration:** Sensitive credentials stored outside codebase
- **Production Security Recommendations:** Documented best practices for secure deployment

## Technical Highlights & Best Practices

FastAPI Modern Python Backend

Production Monitoring Stack

Automated Job Scheduling

Containerized Architecture

Flexible Database Support

## Comprehensive Documentation

> Quick Start Guide - Get monitoring running in 10 minutes
>
> Complete Monitoring Guide - Comprehensive documentation with examples
>
> Architecture Diagram - Visual guide to monitoring setup
>
> Docker Networking Guide - Tips for container deployments
>
> Prometheus Configuration Examples - Ready-to-use configs
>
> Alert Rules - Production-ready alerting setup
