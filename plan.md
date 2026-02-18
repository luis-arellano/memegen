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

## UI/UX Design Overview

### Create Meme Page Layout
The meme creation experience uses a **two-column layout** on desktop:

**Right Column - Template Library:**
- Displays a grid of meme template cards
- Each template card includes:
  - Template thumbnail image
  - Template name
  - **"Use Template" button** - Loads template into the left-side editor
  - **"View Details" button** - Navigates to template detail page

**Left Column - Meme Editor:**
- Initially empty/placeholder until user clicks "Use Template"
- Once a template is selected:
  - **Meme preview** at the top (shows template with text overlays)
  - **"Text" label** below the preview
  - **Three text input boxes:**
    - Top Text
    - Middle Text
    - Bottom Text
  - **Text editing options** (appear when any input is focused):
    - Left align button
    - Center align button
    - Right align button
    - Autowrap toggle/checkbox
    - Font dropdown selector

**Mobile Responsive Behavior:**
- Layout stacks into single column
- User navigates between template selection and editor views
- "Back to Templates" navigation available in editor view

### Template Detail Page
Clicking "View Details" navigates to a dedicated template page showing:
- Template image displayed prominently
- **Tag chips** below the image (e.g., "Popular", "Animals", "Reaction")
- **Memes created with this template** section showing a gallery of all user-generated memes using this template
- "Use This Template" button to return to creation flow with template pre-selected

---

## Task List

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
  "description": "Application deploys successfully to Vercel with automatic GitHub deployments",
  "steps": [
    "Connect GitHub repository to Vercel project in dashboard",
    "Configure environment variables in Vercel dashboard",
    "Trigger automatic deployment by pushing to main branch",
    "Wait for build to complete automatically",
    "Visit production URL",
    "Verify application loads without errors",
    "Check Vercel logs for any runtime errors",
    "Verify subsequent pushes trigger automatic deployments"
  ],
  "passes": true,
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
  "description": "User can browse template library in right column",
  "steps": [
    "Navigate to /create page",
    "Verify grid of template thumbnails loads in right column",
    "Count that at least 10 templates are visible",
    "Check that each template shows an image",
    "Verify template names are displayed on each card",
    "Scroll through templates in the right column",
    "Confirm responsive grid layout (2-3 columns on desktop, 1-2 on mobile)"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can select a template using 'Use Template' button",
  "steps": [
    "Navigate to /create page with two-column layout",
    "Locate 'Use Template' button on any template card",
    "Click 'Use Template' button",
    "Verify left column populates with meme editor (no page navigation)",
    "Confirm selected template image displays in editor preview",
    "Check that template loads without errors",
    "Verify template metadata (name) is shown in editor",
    "Test clicking 'Use Template' on different templates updates the left editor"
  ],
  "passes": false
}

### Meme Creation Flow

{
  "category": "functional",
  "description": "User can access meme creation page with two-column layout",
  "steps": [
    "Navigate to homepage",
    "Click 'Create Meme' button",
    "Verify navigation to /create page",
    "Verify two-column layout is visible",
    "Confirm right column shows template list",
    "Confirm left column is empty/placeholder initially",
    "Test responsive behavior on mobile (stacks vertically)"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Template list displays with 'Use Template' and 'View Details' buttons",
  "steps": [
    "Navigate to /create page",
    "Verify template list displays on right column",
    "Check each template card shows thumbnail image",
    "Verify 'Use Template' button exists on each card",
    "Verify 'View Details' button exists on each card",
    "Test both buttons are clickable",
    "Verify hover states for both buttons"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Clicking 'Use Template' populates the left-side meme editor",
  "steps": [
    "Navigate to /create page with two-column layout",
    "Click 'Use Template' on any template card",
    "Verify left column populates with meme editor",
    "Confirm selected template image appears at top of left column",
    "Verify 'Text' label appears below the image",
    "Check three text input boxes appear: Top Text, Middle Text, Bottom Text",
    "Verify all inputs are empty and ready for user input"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can add top text to meme template",
  "steps": [
    "Navigate to meme editor (left column) with selected template",
    "Locate 'Top Text' input field",
    "Type 'TEST TOP TEXT' into input",
    "Verify text appears overlaid on template image preview",
    "Check text has white fill with black stroke (default)",
    "Verify text updates in real-time (< 200ms)",
    "Test with long text to verify rendering"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can add middle text to meme template",
  "steps": [
    "Navigate to meme editor with selected template",
    "Locate 'Middle Text' input field",
    "Type 'TEST MIDDLE TEXT' into input",
    "Verify text appears in middle of template image",
    "Check text has white fill with black stroke",
    "Verify text updates in real-time (< 200ms)",
    "Test clearing the field removes middle text from preview"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can add bottom text to meme template",
  "steps": [
    "Navigate to meme editor with selected template",
    "Locate 'Bottom Text' input field",
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
  "description": "Text editing options appear when text input is focused",
  "steps": [
    "Navigate to meme editor with template selected",
    "Click on 'Top Text' input box to focus",
    "Verify text editing options appear below the input",
    "Check for left align button",
    "Check for center align button",
    "Check for right align button",
    "Check for autowrap toggle/checkbox",
    "Check for font dropdown selector",
    "Verify options hide when input loses focus (optional)",
    "Repeat for Middle Text and Bottom Text inputs"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can change text alignment (left, center, right)",
  "steps": [
    "Navigate to meme editor with text in Top Text field",
    "Focus on Top Text input",
    "Click 'Left Align' button",
    "Verify text aligns to left in preview",
    "Click 'Center Align' button",
    "Verify text centers in preview",
    "Click 'Right Align' button",
    "Verify text aligns to right in preview",
    "Test alignment changes apply immediately to preview"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can toggle autowrap for text",
  "steps": [
    "Navigate to meme editor",
    "Enter very long text in Top Text field",
    "Focus on Top Text input",
    "Verify autowrap toggle/checkbox is available",
    "Enable autowrap",
    "Verify long text wraps to multiple lines in preview",
    "Disable autowrap",
    "Verify text stays on single line (may overflow or scale)",
    "Test autowrap with different text lengths"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can select different fonts from dropdown",
  "steps": [
    "Navigate to meme editor with text in any field",
    "Focus on text input",
    "Locate font dropdown selector",
    "Click to open font dropdown",
    "Verify at least 3 font options are available (e.g., Impact, Arial, Comic Sans)",
    "Select a different font from dropdown",
    "Verify preview updates with new font immediately",
    "Test multiple font changes to confirm they all work"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can preview meme with all three text fields",
  "steps": [
    "Navigate to meme editor",
    "Enter 'TOP TEXT' in top text field",
    "Enter 'MIDDLE TEXT' in middle text field",
    "Enter 'BOTTOM TEXT' in bottom text field",
    "Verify all three texts render correctly on image",
    "Check text positioning (top at top, middle in middle, bottom at bottom)",
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
  "passes": true
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
    "Verify top_text, middle_text, and bottom_text fields are populated",
    "Confirm image_url points to GCS location",
    "Verify text styling metadata (alignment, font) is saved"
  ],
  "passes": false
}

### Template Details Page

{
  "category": "functional",
  "description": "Clicking 'View Details' navigates to template detail page",
  "steps": [
    "Navigate to /create page",
    "Click 'View Details' button on any template card",
    "Verify navigation to /templates/{template_id} or similar route",
    "Verify template image is displayed prominently",
    "Check template name/title is shown",
    "Confirm page loads without errors"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Template detail page displays tag chips",
  "steps": [
    "Navigate to template detail page",
    "Scroll to section below template image",
    "Verify tags/categories are displayed as chips/badges",
    "Check at least one tag is visible (e.g., 'Popular', 'Animals', 'Reaction')",
    "Verify chip styling is consistent (rounded, colored background)",
    "Test that chips are responsive on mobile"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Template detail page shows all memes created with this template",
  "steps": [
    "Navigate to template detail page",
    "Scroll to section below tag chips",
    "Verify heading like 'Memes using this template' is shown",
    "Check grid/list of meme thumbnails appears",
    "Verify each meme shows the generated image",
    "If no memes exist yet, verify appropriate empty state message",
    "Click on a meme thumbnail to view full meme (if applicable)",
    "Test pagination or infinite scroll if many memes exist"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "User can return to meme creation from template details",
  "steps": [
    "Navigate to template detail page",
    "Locate 'Use This Template' or 'Create Meme' button",
    "Click the button",
    "Verify navigation back to /create page",
    "Confirm the template is pre-selected in the meme editor",
    "Verify left column shows meme editor with this template loaded"
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
  "description": "Create meme page displays two-column layout on desktop",
  "steps": [
    "Navigate to /create page on desktop viewport (>768px)",
    "Verify two-column layout is visible",
    "Check left column takes approximately 50% width",
    "Check right column takes approximately 50% width",
    "Verify right column shows template library grid",
    "Verify left column shows editor area (or placeholder when no template selected)",
    "Confirm both columns are scrollable independently if needed"
  ],
  "passes": false
}

{
  "category": "functional",
  "description": "Create meme page is responsive on mobile (single column)",
  "steps": [
    "Navigate to /create page on mobile viewport (<768px)",
    "Verify layout stacks into single column",
    "Check template library appears first (or as primary view)",
    "Select a template using 'Use Template' button",
    "Verify smooth transition/navigation to editor view",
    "Check editor takes full width on mobile",
    "Verify 'Back to Templates' or similar navigation exists on mobile"
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

### Database Schema Updates for Enhanced Text Editing

**Memes Table Additional Fields:**
- `middle_text` (text, nullable) - For three-field text support
- `top_text_align` (text, default: 'center') - Stores 'left', 'center', or 'right'
- `middle_text_align` (text, default: 'center')
- `bottom_text_align` (text, default: 'center')
- `top_text_font` (text, default: 'Impact') - Font family name
- `middle_text_font` (text, default: 'Impact')
- `bottom_text_font` (text, default: 'Impact')
- `top_text_autowrap` (boolean, default: false)
- `middle_text_autowrap` (boolean, default: false)
- `bottom_text_autowrap` (boolean, default: false)

**Templates Table Additional Fields:**
- `tags` (text[] or jsonb) - Array of tag strings for categorization
- `description` (text, nullable) - Optional template description for detail page

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
