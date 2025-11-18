# DevOps Pipeline Inventory Management System

This repository contains the codebase for our Inventory Management System project.

---

## Branching Strategy

This project follows a structured Git branching model to ensure clean collaboration, stable releases, and predictable CI/CD workflows.

---

## Main Branches

### main
Production-ready code. This branch is protected and only accepts merges from approved Pull Requests.

### develop
The integration branch where all features, bug fixes, and configuration work are merged before release.

---

## Support Branches

### feature/*
Used for developing new features.
Base branch: develop
Example: feature/user-authentication

### bugfix/*
Used for fixing bugs found during development.
Base branch: develop
Example: bugfix/login-error

### hotfix/*
Used for urgent fixes required in production.
Base branch: main
Example: hotfix/critical-api-fix

### release/*
Used to prepare a new production release.
Base branch: develop
After testing, merged into both main and develop to keep history aligned.
Example: release/v1.0.0

---

## Workflow

### Create a feature branch from develop
```
git checkout -b feature/<name> develop
```

### Develop and commit your changes locally

### Push the feature branch to GitHub
```
git push origin feature/<name>
```

### Create a Pull Request targeting develop
PR must pass all CI checks
PR must link to related issue(s)
Obtain at least 2 peer reviews

### Merge the PR into develop

---

## Release Process

When ready for production:

Create a release/* branch from develop

Test and finalize

Merge into main

Merge back into develop to sync changes
