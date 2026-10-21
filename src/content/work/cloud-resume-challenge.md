---
title: "Cloud Resume Challenge"
kicker: "Cloud · AWS · Serverless"
summary: "A resume rebuilt as a cloud-hosted website through the AWS Cloud Resume Challenge: a React frontend with routed project pages is done; S3 and CloudFront hosting, a serverless visitor counter, infrastructure as code and CI/CD are the stages ahead."
category: cloud
status: active
statusLabel: "Frontend done · AWS next"
order: 45
period: "2025 to present"
role: "Build and document"
repo: https://github.com/noble-antwi/cloud-resume-challenge
stack: ["React 19", "Vite", "React Router", "Amazon S3", "CloudFront", "API Gateway", "AWS Lambda (Python)", "DynamoDB", "GitHub Actions"]
relatedTags: ["aws", "cloud", "serverless"]
hero: ../../assets/work/cloud-resume-challenge/architecture.svg
heroAlt: "Architecture: a React app built today; S3, CloudFront, API Gateway, a Python Lambda and DynamoDB planned, all defined as code and deployed by GitHub Actions"
heroCaption: "Where the build stands. Solid is built, dashed is planned. The frontend runs today; everything on AWS comes next, stage by stage."
stats:
  - { value: "4 / 16", label: "Challenge steps done" }
  - { value: "3", label: "Routed pages" }
  - { value: "0", label: "AWS resources yet" }
---

## The challenge

The [Cloud Resume Challenge](https://cloudresumechallenge.dev/docs/the-challenge/aws/) asks you to put your resume on the internet the way a cloud engineer would: a static frontend, a serverless API, a database, infrastructure as code and CI/CD, in sixteen steps. It is small enough to finish and wide enough to touch most of what the job involves day to day. This build follows the AWS version, with the frontend layout taken from Andrew Brown's course build.

## What is built today

- **Home, Resume and Projects pages** with client-side routing, and a detail page for every project opened from its card.
- **The resume itself**, styled as a printed page with one shared layout for every entry, readable on a phone and in print.
- **Content kept apart from code.** Everything the site says lives in two data files, so updating the resume never touches layout code.
- **A clean build.** Lint and production build both pass, and dependencies are pinned with a lockfile so a fresh install gets exactly the tested versions.

## How it will run on AWS

The diagram above is the target. The built site goes into an **S3** bucket, served over HTTPS by **CloudFront**. The page calls one **API Gateway** endpoint, which runs a **Lambda** function written in Python, with its own tests, that keeps the visitor count in **DynamoDB**. Every one of those resources will be defined as code and deployed by **GitHub Actions** on each push, so the whole stack can be rebuilt from the repository.

## Progress against the sixteen steps

| Stage | Steps | Status |
|---|---|---|
| Certification | 1 | Done |
| Resume in HTML, styled with CSS | 2, 3 | Done |
| Source control | 13 | Done |
| Static site on S3, HTTPS with CloudFront, custom domain | 4 to 6 | Next |
| Visitor counter: JavaScript, DynamoDB, API Gateway, Lambda in Python, tests | 7 to 11 | Planned |
| Infrastructure as code, CI/CD for backend and frontend | 12, 14, 15 | Planned |
| A write-up of the build | 16 | Planned |

The repository README is updated with every change, so it always shows the current step, a screenshot and the diagram.
