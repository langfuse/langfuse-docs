# Authors Management System

## Overview

Maps Git commit emails to rich author profiles (names, photos, social handles) for better documentation attribution. Contributors often use multiple emails, so this system maintains the mapping between Git emails and curated author profiles.

## Why This Script Is Necessary

**Problem:** Git commits show raw emails, but we want rich author information with photos and names.

**Solution:** The `update-authors.js` script manages email-to-author mappings by:

- Analyzing Git history for contributor emails
- Identifying unmapped emails
- Mapping emails to existing author profiles

## System Components

- **`Authors.tsx`** - Author profiles with email mappings (`githubEmail`, `githubEmailAlt`)
- **`DocsContributors.tsx`** - Displays contributors on doc pages (shows first 3, then "... and n more")
- **`contributors.json`** - Maps pages to contributor lists (auto-generated)
- **`update-authors.js`** - Email mapping management tool
- **`generate-contributors.js`** - Auto-generates contributors.json from git history

## Usage

### Check for unmapped emails

```bash
node scripts/update-authors.js analyze
```

### Map emails to authors

```bash
# Add primary email
node scripts/update-authors.js add-email <authorKey> <email>

# Add alternative email
node scripts/update-authors.js add-email <authorKey> <email> --alt
```

### Example

```bash
node scripts/update-authors.js add-email marcklingen "marc@langfuse.com"
```

### Generate contributors.json manually

```bash
node scripts/generate-contributors.js
```

## Automated Process

The `contributors.json` file is **automatically generated** during the build process by:

1. Scanning current documentation files in the file system
2. Running a single optimized git command for all historical data (~0.2s)
3. Filtering to only include pages that currently exist
4. Mapping commit emails to author keys using `Authors.tsx`
5. Ordering contributors by most recent contribution (descending)
6. Creating the page-to-contributors mapping

## Workflow

1. **Check for new contributors:** `node scripts/update-authors.js analyze`
2. **For existing team members:** Map new email to existing author
3. **For new contributors:** Add author profile to `Authors.tsx` first
4. **Contributors.json updates automatically** on next build

## Author Profile Format

```typescript
authorkey: {
  firstName: "John",
  name: "John Doe",
  image: "/images/people/johndoe.jpg",
  githubEmail: "primary@email.com",
  githubEmailAlt: ["alt1@email.com", "alt2@email.com"],
}
```

## Troubleshooting

- **"Could not find allAuthors object"** - Check `Authors.tsx` structure
- **"Email is already mapped"** - Run `analyze` to see existing mappings
- **"Author not found"** - Verify author key exists in `Authors.tsx`
