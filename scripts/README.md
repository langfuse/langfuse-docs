# Documentation Authors Feature

This feature shows the authors/contributors for each documentation page in the Nextra sidebar.

## How it works

1. **Authors Mapping**: The `lib/docs-authors.json` file contains a mapping of documentation page URLs to author usernames.

2. **Author Data**: The `components/Authors.tsx` file contains the author information (names, images, Twitter handles).

3. **Sidebar Component**: The `components/DocsAuthors.tsx` component displays the authors in the sidebar for the current page.

4. **Theme Integration**: The component is integrated into the Nextra theme via `toc.extraContent` in `theme.config.tsx`.

## Updating Authors

### Method 1: Static Update (Recommended)
Edit `lib/docs-authors.json` directly to add or modify author assignments for specific pages.

### Method 2: Git-based Extraction (Experimental)
Use the extract-authors script to attempt to extract authors from git history:

```bash
# Generate authors for all docs files
npm run generate-authors

# Generate authors for sample of files (for testing)
npm run generate-authors-sample
```

Note: The git-based approach may have issues in certain environments and should be used with caution.

## Adding New Authors

1. Add the author to `allAuthors` object in `components/Authors.tsx`
2. Add their profile image to `public/images/people/`
3. Update the mappings in `lib/docs-authors.json`

## File Structure

- `lib/docs-authors.json` - Page URL to authors mapping
- `components/Authors.tsx` - Author data and display component
- `components/DocsAuthors.tsx` - Sidebar integration component
- `scripts/extract-authors.js` - Git-based author extraction script
- `theme.config.tsx` - Nextra theme configuration