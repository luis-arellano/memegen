# Project Plan

We are building a website called Memegen, similar to the internal site at Google. it's a social page for users to create, share, and upvote memes.

**Reference** 'prd.md'

**Important Rules for Agent:**
- Work on only ONE story at a time
- It is UNACCEPTABLE to remove or edit test specifications
- Mark `passes: true` only when ALL steps are verified
- Test as a human user would (use browser automation when applicable)
- Document progress in `claude-progress.txt` with git commits

---

## Tast List

### Infrastructure Setup

{
  "category": "infrastructure",
  "description": "Next.js project initializes and runs locally",
  "steps": [
    "Clone/create project repository",
    "Run npm install to install dependencies",
    "Execute npm run dev",
    "Navigate to localhost:3000 in browser",
    "Verify page loads without console errors",
    "Verify Tailwind CSS styles are rendering",
    "Run eslint to check for linting errors"
  ],
  "passes": true
}

{
  "category": "infrastructure",
  "description": "Supabase database connects and tables are created",
  "steps": [
    "Create Supabase project in dashboard",
    "Configure environment variables in .env.local",
    "Run database migration/seed script",
    "Verify 'templates' table exists in Supabase dashboard",
    "Verify 'memes' table exists in Supabase dashboard",
    "Test database connection from Next.js app",
    "Confirm no connection errors in console"
  ],
  "passes": true
}

{
  "category": "infrastructure",
  "description": "Google Cloud Storage bucket accepts image uploads",
  "steps": [
    "Create GCS bucket with public read access",
    "Configure service account credentials",
    "Add GCS environment variables to .env.local",
    "Run test upload script with sample image",
    "Verify image appears in GCS bucket console",
    "Verify public URL returns the image",
    "Check no authentication errors occur"
  ],
  "passes": true
}

{
  "category": "infrastructure",
  "description": "Application deploys successfully to Vercel",
  "steps": [
    "Connect GitHub repository to Vercel project",
    "Configure environment variables in Vercel dashboard",
    "Trigger deployment from main branch",
    "Wait for build to complete",
    "Visit production URL",
    "Verify application loads without errors",
    "Check Vercel logs for any runtime errors"
  ],
  "passes": true
}

### Template Library

{
  "category": "functional",
  "description": "Database contains seed meme templates",
  "steps": [
    "Run template seed script",
    "Open Supabase dashboard",
    "Navigate to 'templates' table",
    "Verify at least 10 templates exist",
    "Verify each template has name, image_url, and category",
    "Check template images are accessible via URLs",
    "Confirm all template IDs are unique"
  ],
  "passes": true
}

{
  "category": "functional",
  "description": "User can browse template library",
  "steps": [
    "Navigate to /templates or / page",
    "Verify grid of template thumbnails loads",
    "Count that at least 10 templates are visible",
    "Check that each template shows an image",
    "Verify template names are displayed",
    "Scroll through templates on mobile viewport",
    "Confirm responsive layout works on desktop"
  ],
  "passes": true
}

{
  "category": "functional",
  "description": "User can select a template to edit",
  "steps": [
    "Navigate to template library page",
    "Click on any template card",
    "Verify navigation to /create or editor page",
    "Confirm selected template image displays in editor",
    "Check that template loads without errors",
    "Verify template metadata (name) is shown",
    "Test clicking different templates updates editor"
  ],
  "passes": true
}

### Meme Creation Flow

{
  "category": "functional",
  "description": "User can add top text to meme template",
  "steps": [
    "Navigate to meme editor with selected template",
    "Locate top text input field",
    "Type 'TEST TOP TEXT' into input",
    "Verify text appears overlaid on template image",
    "Check text has white fill with black stroke",
    "Verify text updates in real-time (< 200ms)",
    "Test with long text to verify auto-sizing"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can add bottom text to meme template",
  "steps": [
    "Navigate to meme editor with selected template",
    "Locate bottom text input field",
    "Type 'TEST BOTTOM TEXT' into input",
    "Verify text appears at bottom of template image",
    "Check text has white fill with black stroke",
    "Verify text updates in real-time (< 200ms)",
    "Test with special characters (!@#$%^&*)"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can preview meme with both text fields",
  "steps": [
    "Navigate to meme editor",
    "Enter 'TOP TEXT' in top text field",
    "Enter 'BOTTOM TEXT' in bottom text field",
    "Verify both texts render correctly on image",
    "Check text positioning (top at top, bottom at bottom)",
    "Verify texts don't overlap with each other",
    "Test on mobile viewport for responsive text sizing"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can generate and download completed meme",
  "steps": [
    "Navigate to meme editor with text added",
    "Click 'Generate Meme' or 'Download' button",
    "Wait for generation process to complete",
    "Verify download prompt appears",
    "Save file to disk",
    "Open downloaded image file",
    "Confirm meme image matches preview with text overlays"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Generated meme is saved to cloud storage",
  "steps": [
    "Create a meme with text in editor",
    "Click generate/download button",
    "Wait for success confirmation message",
    "Open GCS bucket in console",
    "Verify new meme image appears in bucket",
    "Check image has unique filename/ID",
    "Verify public URL returns the generated meme"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Meme metadata is saved to database",
  "steps": [
    "Create and generate a meme",
    "Open Supabase dashboard",
    "Navigate to 'memes' table",
    "Verify new row exists for generated meme",
    "Check template_id references correct template",
    "Verify top_text and bottom_text fields are populated",
    "Confirm image_url points to GCS location"
  ],
  "passes": false
}

### User Interface & Navigation

{
  "category": "functional",
  "description": "Homepage displays with hero section and CTA",
  "steps": [
    "Navigate to root URL /",
    "Verify hero section loads",
    "Check for tagline/heading text",
    "Locate 'Create a Meme' CTA button",
    "Verify page is responsive on mobile",
    "Check footer is visible at bottom",
    "Confirm no layout shifting occurs"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Navigation header appears on all pages",
  "steps": [
    "Navigate to homepage",
    "Verify header with logo/title is visible",
    "Check navigation links (Home, Create Meme) exist",
    "Click 'Create Meme' link",
    "Verify navigation to /create page",
    "Click 'Home' link from /create",
    "Verify return to homepage"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Mobile menu works on small screens",
  "steps": [
    "Navigate to any page on mobile viewport (< 768px)",
    "Verify hamburger menu icon is visible",
    "Click hamburger menu",
    "Verify navigation menu opens",
    "Check all navigation links are accessible",
    "Click a navigation link",
    "Verify navigation works and menu closes"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Create meme flow progresses from selection to editor",
  "steps": [
    "Navigate to /create page",
    "Verify step 1 shows template library",
    "Select any template",
    "Verify navigation to step 2 (editor)",
    "Check selected template loads in editor",
    "Verify 'Start Over' button exists",
    "Click 'Start Over' and confirm return to step 1"
  ],
  "passes": false
}

### Performance & Quality

{
  "category": "performance",
  "description": "Template library loads within 3 seconds",
  "steps": [
    "Clear browser cache",
    "Navigate to template library page",
    "Start timer when navigation begins",
    "Wait for all template thumbnails to load",
    "Stop timer when last image visible",
    "Verify load time is under 3 seconds",
    "Check network tab for failed requests"
  ],
  "passes": false
}

{
  "category": "performance",
  "description": "Meme preview updates with minimal latency",
  "steps": [
    "Navigate to meme editor",
    "Open browser developer tools performance tab",
    "Start typing in text input field",
    "Type 10 characters rapidly",
    "Observe preview update timing",
    "Verify each update occurs within 200ms",
    "Check for frame drops or stuttering"
  ],
  "passes": false
}

{
  "category": "quality",
  "description": "Application has no console errors on any page",
  "steps": [
    "Open browser developer console",
    "Navigate to homepage",
    "Check console has no errors (red text)",
    "Navigate to /create page",
    "Verify no new errors appear",
    "Complete full meme creation flow",
    "Confirm console remains error-free"
  ],
  "passes": false
}

{
  "category": "quality",
  "description": "All pages are responsive on mobile and desktop",
  "steps": [
    "Navigate to homepage on desktop viewport (1920x1080)",
    "Verify layout looks correct",
    "Switch to mobile viewport (375x667)",
    "Verify layout adapts without horizontal scroll",
    "Test template library on both viewports",
    "Test meme editor on both viewports",
    "Confirm no UI elements are cut off"
  ],
  "passes": false
}

---

## How to Use This Plan

### For Human Developers
- Review each JSON story line
- Implement features one at a time
- Manually test each step
- Update `passes: false` to `passes: true` when verified
- Commit with message referencing the story description

### For Agent (Claude Code)
- Parse JSONL format (one JSON object per line)
- Select ONE story where `passes: false`
- Implement the feature to satisfy all steps
- Test as a human user would (use Playwright/Puppeteer for browser tests)
- Update `passes: true` only when ALL steps verified
- Document progress in `claude-progress.txt`
- Move to next story with `passes: false`

### Example Progress File (claude-progress.txt)
```
2026-02-14 14:30 - Started: "Next.js project initializes and runs locally"
2026-02-14 15:15 - Completed: Installed dependencies, configured Tailwind, ESLint
2026-02-14 15:16 - Verified: localhost:3000 loads, no console errors
2026-02-14 15:16 - Marked passes: true, committed: "Initialize Next.js with Tailwind and ESLint"
2026-02-14 15:20 - Started: "Supabase database connects and tables are created"
```

---

## Out of Scope for Sprint 1

These features are NOT included in the test plan above:
- User authentication/login
- User profiles
- Voting system
- Comments
- Feed/gallery view
- Search functionality
- Social sharing beyond download
- Custom image uploads

---

## Technical Stack Reference

- **Frontend**: React + Next.js 15+
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Google Cloud Storage
- **Auth**: Supabase Auth (Sprint 2+)
- **Hosting**: Vercel
- **Image Processing**: Canvas API (client) + Sharp (server backup)

---

## Definition of Done

A story is marked `passes: true` only when:
1. ✅ All steps in the story can be executed successfully
2. ✅ Feature works on both mobile and desktop viewports
3. ✅ No console errors or warnings appear
4. ✅ Code is committed with clear message
5. ✅ Deployed to Vercel staging and verified in production
6. ✅ Progress documented in claude-progress.txt

**Agent Rule**: It is UNACCEPTABLE to mark `passes: true` without completing ALL verification steps.

---

**Plan Created**: 2026-02-14
**Format**: JSONL (JSON Lines) per Anthropic harness guidelines
**Target**: Long-running agent development with Ralph loop compatibility
