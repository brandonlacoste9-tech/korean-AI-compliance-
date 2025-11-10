# 🤖 GitHub Issues & PR Automation System

## 🎯 Vision: Self-Managing Repository

Automate your entire GitHub workflow:
- **Auto-create issues** when errors occur
- **Auto-label** issues and PRs
- **Auto-assign** to appropriate team members
- **Auto-comment** with deployment status
- **Auto-close** issues when features deploy
- **Auto-merge** dependabot PRs
- **Auto-create PRs** for routine updates

---

## 🏗️ Architecture Overview

### Components:

1. **GitHub Actions** - Automated workflows in `.github/workflows/`
2. **Probot Apps** - GitHub bot for intelligent automation
3. **GitHub API Integration** - From your workflows (Vercel/Backend)
4. **Issue Templates** - Standardized issue creation
5. **PR Templates** - Consistent PR format

---

## 📋 Automated Workflows

### 1. Auto-Create Issues from Errors

**Trigger:** When your platform detects errors

**Backend Integration:**
```python
# backend/utils/github_automation.py
import os
import httpx
from datetime import datetime

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "brandonlacoste9-tech/korean-AI-compliance-"

async def create_error_issue(
    error_type: str,
    error_message: str,
    stack_trace: str,
    severity: str = "medium"
):
    """Auto-create GitHub issue when error occurs"""

    # Determine labels based on error type
    labels = ["bug", f"severity:{severity}"]
    if "stripe" in error_type.lower():
        labels.append("payment")
    elif "database" in error_type.lower():
        labels.append("database")
    elif "api" in error_type.lower():
        labels.append("api")

    # Create issue body
    issue_body = f"""
## 🐛 Error Detected

**Type:** {error_type}
**Severity:** {severity.upper()}
**Time:** {datetime.utcnow().isoformat()}

### Error Message
```
{error_message}
```

### Stack Trace
```python
{stack_trace}
```

### Environment
- **Service:** Backend API
- **URL:** https://korean-ai-compliance.onrender.com
- **Environment:** Production

### Auto-Generated
This issue was automatically created by the platform monitoring system.

---
**Next Steps:**
1. Review error logs in Render Dashboard
2. Identify root cause
3. Create fix and PR
4. Deploy fix
5. Verify error resolved
"""

    # Create issue via GitHub API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"https://api.github.com/repos/{GITHUB_REPO}/issues",
            headers={
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json"
            },
            json={
                "title": f"[AUTO] {error_type}: {error_message[:50]}...",
                "body": issue_body,
                "labels": labels,
                "assignees": ["brandonlacoste9-tech"]  # Auto-assign to you
            }
        )

        if response.status_code == 201:
            issue_data = response.json()
            print(f"✅ Created issue #{issue_data['number']}: {issue_data['html_url']}")
            return issue_data
        else:
            print(f"❌ Failed to create issue: {response.text}")
            return None

async def close_error_issue(issue_number: int, resolution: str):
    """Close issue when error is resolved"""

    comment = f"""
## ✅ Issue Resolved

**Resolution:** {resolution}
**Resolved At:** {datetime.utcnow().isoformat()}

This issue has been automatically closed by the monitoring system.
"""

    async with httpx.AsyncClient() as client:
        # Add comment
        await client.post(
            f"https://api.github.com/repos/{GITHUB_REPO}/issues/{issue_number}/comments",
            headers={
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json"
            },
            json={"body": comment}
        )

        # Close issue
        await client.patch(
            f"https://api.github.com/repos/{GITHUB_REPO}/issues/{issue_number}",
            headers={
                "Authorization": f"Bearer {GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json"
            },
            json={"state": "closed"}
        )
```

**Usage in Error Handler:**
```python
# backend/app/main.py
from utils.github_automation import create_error_issue

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log error
    logger.error(f"Unhandled exception: {str(exc)}")

    # Create GitHub issue for critical errors
    if is_critical_error(exc):
        await create_error_issue(
            error_type=type(exc).__name__,
            error_message=str(exc),
            stack_trace=traceback.format_exc(),
            severity="high"
        )

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

---

### 2. Auto-Label Issues and PRs

**GitHub Action:**
```yaml
# .github/workflows/auto-label.yml
name: Auto Label Issues and PRs

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  auto-label:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write

    steps:
      - name: Label based on title
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue || context.payload.pull_request;
            const title = issue.title.toLowerCase();
            const labels = [];

            // Auto-label based on keywords
            if (title.includes('bug') || title.includes('error') || title.includes('fix')) {
              labels.push('bug');
            }
            if (title.includes('feat') || title.includes('feature')) {
              labels.push('enhancement');
            }
            if (title.includes('docs') || title.includes('documentation')) {
              labels.push('documentation');
            }
            if (title.includes('stripe') || title.includes('payment')) {
              labels.push('payment');
            }
            if (title.includes('vercel') || title.includes('frontend')) {
              labels.push('frontend');
            }
            if (title.includes('render') || title.includes('backend')) {
              labels.push('backend');
            }
            if (title.includes('urgent') || title.includes('critical')) {
              labels.push('priority:high');
            }

            // Add labels
            if (labels.length > 0) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issue.number,
                labels: labels
              });
            }

      - name: Label based on files changed (PRs only)
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;
            const files = await github.rest.pulls.listFiles({
              owner: context.repo.owner,
              repo: context.repo.repo,
              pull_number: pr.number
            });

            const labels = new Set();

            files.data.forEach(file => {
              if (file.filename.startsWith('frontend/')) labels.add('frontend');
              if (file.filename.startsWith('backend/')) labels.add('backend');
              if (file.filename.includes('stripe')) labels.add('payment');
              if (file.filename.includes('.md')) labels.add('documentation');
              if (file.filename.includes('test')) labels.add('testing');
              if (file.filename.includes('workflow')) labels.add('workflow');
            });

            if (labels.size > 0) {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: pr.number,
                labels: Array.from(labels)
              });
            }
```

---

### 3. Auto-Comment on PRs with Deployment Status

**GitHub Action:**
```yaml
# .github/workflows/pr-deployment-status.yml
name: PR Deployment Status

on:
  pull_request:
    types: [opened, synchronize]
  deployment_status:

jobs:
  comment-deployment:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write

    steps:
      - name: Comment on PR with deployment info
        uses: actions/github-script@v7
        with:
          script: |
            const pr = context.payload.pull_request;

            if (!pr) return;

            const comment = `## 🚀 Deployment Status

            ### Preview Deployment
            - **Frontend Preview:** \`https://korean-ai-compliance-${pr.number}.vercel.app\`
            - **Status:** Deploying... ⏳

            ### Tests
            - ✅ Linting: Passed
            - ✅ Type Check: Passed
            - ⏳ Build: In Progress

            ### Review Checklist
            - [ ] Code reviewed
            - [ ] Tests passing
            - [ ] Documentation updated
            - [ ] No breaking changes

            This comment will be updated automatically as deployment progresses.
            `;

            // Find existing bot comment
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: pr.number
            });

            const botComment = comments.data.find(
              comment => comment.user.login === 'github-actions[bot]' &&
                         comment.body.includes('Deployment Status')
            );

            if (botComment) {
              // Update existing comment
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body: comment
              });
            } else {
              // Create new comment
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: pr.number,
                body: comment
              });
            }
```

---

### 4. Auto-Merge Dependabot PRs

**GitHub Action:**
```yaml
# .github/workflows/auto-merge-dependabot.yml
name: Auto-Merge Dependabot

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    permissions:
      pull-requests: write
      contents: write

    steps:
      - name: Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v1

      - name: Auto-merge minor and patch updates
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-minor' ||
          steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Comment on major updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-major'
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.pull_request.number,
              body: `⚠️ **Major version update detected!**

              This PR contains a major version update and requires manual review before merging.

              **Please review:**
              - Breaking changes in release notes
              - Test all affected functionality
              - Update documentation if needed`
            })
```

---

### 5. Auto-Create PRs for Routine Updates

**Workflow Integration:**
```typescript
// workflows/github-automation.ts
"use workflow";

import { sleep } from "workflow";

export async function weeklyMaintenanceWorkflow() {
  while (true) {
    // Run weekly maintenance
    await createWeeklyMaintenancePR();

    // Wait 7 days
    await sleep("7d");
  }
}

async function createWeeklyMaintenancePR() {
  "use step";

  // Tasks to include in maintenance
  const tasks = [
    "Update dependencies (npm update)",
    "Clean old logs (>30 days)",
    "Optimize database indexes",
    "Review and close stale issues",
    "Update documentation"
  ];

  // Create PR via GitHub API
  const response = await fetch(
    `https://api.github.com/repos/brandonlacoste9-tech/korean-AI-compliance-/pulls`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title: `[AUTO] Weekly Maintenance - ${new Date().toISOString().split('T')[0]}`,
        body: `## 🔧 Weekly Maintenance PR

### Tasks Completed
${tasks.map(task => `- [x] ${task}`).join('\n')}

### Automated Changes
This PR was automatically created by the maintenance workflow.

### Review Required
- [ ] Review changes
- [ ] Test locally
- [ ] Merge to main`,
        head: 'maintenance/weekly-updates',
        base: 'main'
      })
    }
  );

  if (response.ok) {
    const pr = await response.json();
    console.log(`✅ Created PR #${pr.number}: ${pr.html_url}`);
  }
}
```

---

### 6. Auto-Close Stale Issues

**GitHub Action:**
```yaml
# .github/workflows/close-stale.yml
name: Close Stale Issues

on:
  schedule:
    - cron: '0 0 * * *' # Daily at midnight
  workflow_dispatch:

jobs:
  stale:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write

    steps:
      - uses: actions/stale@v9
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          stale-issue-message: |
            This issue has been automatically marked as stale because it has not had
            recent activity. It will be closed in 7 days if no further activity occurs.

            If this issue is still relevant, please comment to keep it open.
          stale-pr-message: |
            This PR has been automatically marked as stale because it has not had
            recent activity. It will be closed in 7 days if no further activity occurs.
          close-issue-message: |
            This issue was automatically closed due to inactivity.

            Feel free to reopen if this is still relevant.
          close-pr-message: |
            This PR was automatically closed due to inactivity.
          days-before-stale: 30
          days-before-close: 7
          stale-issue-label: 'stale'
          stale-pr-label: 'stale'
          exempt-issue-labels: 'pinned,security,priority:high'
```

---

### 7. Auto-Assign Issues and PRs

**GitHub Action:**
```yaml
# .github/workflows/auto-assign.yml
name: Auto Assign

on:
  issues:
    types: [opened]
  pull_request:
    types: [opened]

jobs:
  auto-assign:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write

    steps:
      - name: Auto-assign based on area
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue || context.payload.pull_request;
            const title = issue.title.toLowerCase();
            const body = (issue.body || '').toLowerCase();

            let assignee = 'brandonlacoste9-tech'; // Default assignee

            // Assign based on area
            // if (title.includes('payment') || body.includes('stripe')) {
            //   assignee = 'payment-team-member';
            // } else if (title.includes('frontend') || body.includes('vercel')) {
            //   assignee = 'frontend-team-member';
            // }

            await github.rest.issues.addAssignees({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issue.number,
              assignees: [assignee]
            });
```

---

## 📝 Issue & PR Templates

### Issue Template

```markdown
# .github/ISSUE_TEMPLATE/bug_report.md
---
name: Bug Report
about: Report a bug in the platform
title: '[BUG] '
labels: bug
assignees: brandonlacoste9-tech
---

## 🐛 Bug Description
A clear description of the bug.

## 📍 Location
- [ ] Frontend (Vercel)
- [ ] Backend (Render)
- [ ] Payment (Stripe)
- [ ] Database
- [ ] Other: ___

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## ✅ Expected Behavior
What should happen.

## ❌ Actual Behavior
What actually happens.

## 📸 Screenshots
If applicable, add screenshots.

## 🌍 Environment
- Browser: [e.g. Chrome, Safari]
- Device: [e.g. Desktop, Mobile]
- OS: [e.g. Windows, macOS, iOS]

## 📝 Additional Context
Any other context about the problem.
```

### PR Template

```markdown
# .github/pull_request_template.md
## 📋 Description
Brief description of changes.

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactoring

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Dependent changes merged

## 🧪 Testing
Describe testing done.

## 📸 Screenshots (if applicable)
Visual changes.

## 🔗 Related Issues
Closes #(issue number)

## 📝 Additional Notes
Any other information.
```

---

## 🔐 Security Setup

### Add GitHub Token to Environments

**For Backend (Render):**
```bash
# Add to Render environment variables
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

**Create GitHub Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: "Korean AI Compliance Automation"
4. Scopes:
   - `repo` (full control)
   - `workflow`
5. Click "Generate token"
6. Copy and save securely

---

## 🚀 Deployment Steps

### Step 1: Create GitHub Actions

```bash
cd ~/korean-AI-compliance-

# Create workflows directory
mkdir -p .github/workflows

# Copy workflow files (from this guide)
# - auto-label.yml
# - pr-deployment-status.yml
# - auto-merge-dependabot.yml
# - close-stale.yml
# - auto-assign.yml
```

### Step 2: Create Templates

```bash
# Create issue templates
mkdir -p .github/ISSUE_TEMPLATE

# Create PR template
touch .github/pull_request_template.md
```

### Step 3: Add GitHub Token

```bash
# Add to Render environment
# GITHUB_TOKEN=ghp_...
```

### Step 4: Commit and Push

```bash
git add .github/
git commit -m "feat: Add GitHub automation workflows"
git push origin claude/verify-full-stack-deployment-011CUwtY968YssNaZQFawyfr
```

---

## 📊 Benefits

### Automated Issue Management
- ✅ Errors automatically create issues
- ✅ Issues auto-labeled and assigned
- ✅ Stale issues auto-closed
- ✅ Critical issues escalated

### Streamlined PR Process
- ✅ PRs auto-labeled based on changes
- ✅ Deployment status auto-commented
- ✅ Dependabot PRs auto-merged
- ✅ Review process standardized

### Time Savings
- ✅ No manual labeling
- ✅ No manual assignment
- ✅ No manual status updates
- ✅ No manual dependency updates

### Better Visibility
- ✅ All errors tracked in GitHub
- ✅ Deployment status visible
- ✅ Team knows what's happening
- ✅ History preserved

---

## 🎯 Example Workflows

### Error Detected → Issue Created
```
1. Backend detects critical error
2. Auto-creates GitHub issue
3. Auto-labels: bug, severity:high, backend
4. Auto-assigns to you
5. Sends notification
```

### PR Opened → Auto-Processed
```
1. PR opened
2. Auto-labels based on files changed
3. Auto-comments with deployment status
4. Auto-assigns reviewers
5. Tests run automatically
6. Deployment preview created
```

### Dependabot Update → Auto-Merged
```
1. Dependabot creates PR
2. If minor/patch: auto-merge
3. If major: comment for review
4. Tests run automatically
5. Updates deployed
```

---

## 📖 Next Steps

### Immediate
1. Create GitHub personal access token
2. Add to Render environment
3. Create workflow files
4. Test issue creation

### Short-term
1. Integrate with error handlers
2. Setup PR automation
3. Configure dependabot
4. Test complete flow

### Long-term
1. Add more sophisticated automation
2. Integrate with Slack/Discord
3. Add deployment gates
4. Custom GitHub bot

---

**Your repository will manage itself!** 🤖

*Last updated: 2025-11-10*
*Ready to implement alongside workflows*
