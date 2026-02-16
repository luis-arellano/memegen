# Memegen - Product Requirements Document

## 1. Overview

### Problem Statement
People love creating and sharing memes, but existing platforms either focus solely on creation (meme generators) or bury memes in generic social feeds. There's a need for a dedicated social platform where meme creators can share their work, get feedback from the community, and discover the best memes of the day.

### Vision
Build a thriving meme community where users create, share, vote on, and discuss memes daily. Inspired by Google's internal Memegen, we aim to create the ultimate social platform for meme culture - think Reddit meets meme generator.

---

## 2. Goals and Non-Goals

### Goals
- Build an engaged daily community of meme creators and consumers
- Enable users to create and post memes with their username
- Provide upvote/downvote system for community curation
- Allow users to comment and discuss memes
- Surface the best memes of the day through voting
- Make it easy to search and discover memes by user or content
- Create personal profile pages showing user's meme history
- Deliver a responsive experience on desktop and mobile

### Non-Goals (V1)
- Video meme creation
- Advanced photo editing tools (filters, effects, beyond basic text)
- Private messaging between users
- Follower/following relationships
- Monetization or advertising
- AI-generated meme suggestions
- Cross-posting to external social media (users can download/share manually)

---

## 3. Target Users

### Primary Personas
1. **The Daily Creator**: Enjoys making memes regularly and getting recognition from the community. Checks to see how their memes are performing (upvotes/comments).
2. **The Curator/Voter**: Browses daily to see what's popular, upvotes favorites, downvotes misses. Contributes to surfacing the best content.
3. **The Commenter**: Loves engaging in discussions, adding witty replies, and building on others' jokes.
4. **The Lurker/Consumer**: Checks the popular feed daily to see the best memes, rarely posts but appreciates the curated content.
5. **The Searcher**: Looking for specific memes or exploring what a particular user has created.

---

## 4. Core Features

### 4.1 User Authentication & Profiles
**Priority: P0 (Must Have)**

- **Account Creation**
  - Sign up with email or OAuth (Google, etc.)
  - Unique username selection
  - Basic profile setup

- **User Profile Pages**
  - Display username and join date
  - Show all memes created by user (chronological)
  - Display user stats: total memes, total upvotes received
  - Public profile accessible via /u/{username}

- **Authentication**
  - Login/logout functionality
  - Session management
  - Password reset flow

### 4.2 Meme Creation & Posting
**Priority: P0 (Must Have)**

- **Template Selection**
  - Browse curated library of popular meme templates
  - Search templates by name or keywords
  - Quick access to recently used templates
  - Template preview with example text

- **Text Editor**
  - Top text field (traditional meme format)
  - Bottom text field
  - Support for middle text (for certain templates)
  - Font size adjustment
  - Text color customization (default: white with black outline)
  - Real-time preview as user types

- **Image Upload (Optional Custom Images)**
  - Upload custom images (JPG, PNG)
  - Drag-and-drop support
  - Max file size limit (e.g., 10MB)

- **Post Meme**
  - Create button saves meme to user's profile
  - Meme appears in main feed
  - Posted with username and timestamp
  - Optional: Add title/caption to meme

### 4.3 Feed & Discovery
**Priority: P0 (Must Have)**

- **Main Feed Views**
  - **Popular/Hot**: Top upvoted memes of the day (default view)
  - **Recent/New**: Chronological feed of all new memes
  - **Top of All Time**: Highest voted memes ever (optional)

- **Popular Feed Logic**
  - Shows memes from the current day ranked by net upvotes
  - Resets daily (new day = new popular feed)
  - Minimum vote threshold to appear (e.g., 5+ upvotes)

- **Feed Display**
  - Infinite scroll or pagination
  - Each meme shows:
    - Meme image
    - Username and timestamp
    - Upvote/downvote count
    - Comment count
    - Quick action buttons (vote, comment, share)

### 4.4 Voting System
**Priority: P0 (Must Have)**

- **Upvote/Downvote**
  - Large upvote and downvote buttons on each meme
  - Net vote count displayed (upvotes - downvotes)
  - Users can change their vote or remove it
  - Visual indicator of user's current vote state
  - Cannot vote on your own memes

- **Vote Tracking**
  - Track which users voted on which memes
  - Prevent duplicate votes from same user
  - Update vote counts in real-time (or near real-time)

### 4.5 Comments & Discussion
**Priority: P0 (Must Have)**

- **Comment Thread**
  - Click meme to view detail page with comments
  - Text input for adding comments
  - Display username and timestamp for each comment
  - Chronological or threaded comment display
  - Delete own comments

- **Comment Voting (P1 - Optional for V1)**
  - Upvote/downvote individual comments
  - Sort comments by vote count or time

### 4.6 Search & Filtering
**Priority: P1 (Should Have)**

- **Search Functionality**
  - Search by username (find all memes by a user)
  - Search by meme text content
  - Search by template name
  - Search results page showing matching memes

- **Filter Options**
  - Filter by date range
  - Filter by template type
  - Filter by minimum vote count

### 4.7 Sharing & Downloading
**Priority: P1 (Should Have)**

- Direct link to individual meme page
- Download meme as image (PNG/JPG)
- Copy link to clipboard
- Social share preview (Open Graph tags)

### 4.8 Template Management (Admin)
**Priority: P1 (Should Have)**

- Admin panel to add/remove templates
- Template metadata (name, tags, description)
- Upload new templates
- Mark templates as featured
- Template usage statistics

---

## 5. User Flows

### Flow 1: New User Onboarding
1. User discovers site and lands on homepage (shows popular feed)
2. Can browse memes as guest but sees "Sign up to create and vote"
3. Clicks sign up button
4. Creates account (email/OAuth)
5. Chooses unique username
6. Redirected to main feed, now can vote and create

### Flow 2: Daily Creator Flow
1. User logs in and lands on popular feed
2. Clicks "Create Meme" button in navigation
3. Browses or searches template library
4. Selects template
5. Enters top/bottom text with real-time preview
6. Clicks "Post" button
7. Meme appears in their profile and the "New" feed
8. User can share link or wait for upvotes

### Flow 3: Daily Consumer Flow (The Main Experience)
1. User logs in or visits site
2. Sees "Popular" feed (default view) - best memes of today
3. Scrolls through memes
4. Upvotes favorites, downvotes ones they don't like
5. Clicks on interesting meme to see comments
6. Reads comments, adds their own witty reply
7. Returns to feed to continue browsing
8. Checks back later in day to see new popular memes

### Flow 4: Search & Discovery
1. User wants to find memes by specific creator
2. Uses search bar to enter username
3. Results show all memes by that user
4. User browses their profile
5. Upvotes good ones, comments on favorites

### Flow 5: Meme Detail & Discussion
1. User clicks on a meme in feed
2. Lands on meme detail page
3. Sees larger version of meme
4. Views username, timestamp, vote count
5. Scrolls down to read comment thread
6. Adds their own comment
7. Upvotes meme if they haven't already
8. Shares link with friends

---

## 6. User Experience Requirements

### Performance
- Template library loads in < 1 second
- Real-time text preview with < 100ms latency
- Meme generation/download in < 2 seconds
- Mobile-responsive on screens 375px and up


### Design Principles
- Clean, minimal interface
- Fun but not overwhelming
- Mobile-first design
- Clear call-to-action buttons
- Instant feedback for user actions

---

## 7. Technical Considerations

### Scale & Performance
- Expected load: Start with 100-1000 daily users, scale to 10K+
- Template library: Start with 50-100 templates
- Gallery: Store and display up to 10,000 recent memes

### Data Storage
- Template images (source files)
- User-generated memes
- Meme metadata (text, template used, timestamp)
- Analytics data (optional)

### Security & Privacy
- No user accounts required initially (anonymous creation)
- Rate limiting on meme generation (prevent abuse)
- Image upload validation (file type, size, content scanning)
- GDPR compliance if storing any user data

### Technical Constraints
- Must work on modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support (iOS Safari, Chrome Mobile)
- Image processing capabilities (server-side or client-side)

---

## 8. Success Metrics

### Key Performance Indicators (KPIs)

- **Community Engagement**
  - Daily Active Users (DAU)
  - Returning user rate (% who come back daily/weekly)
  - Average session duration
  - Comments per meme (engagement depth)
  - Votes per user per session
  - Time spent on site per visit

- **Content Creation**
  - Number of memes created per day
  - Memes per active creator
  - % of users who create vs. only consume
  - Average time to create and post a meme

- **Social Interaction**
  - Total votes per day (upvotes + downvotes)
  - Comment count per day
  - Average comments per meme
  - Vote-to-view ratio
  - Distribution of votes (are votes concentrated or spread?)

- **Content Quality**
  - % of memes reaching "popular" threshold
  - Average votes per meme
  - Ratio of upvotes to downvotes
  - Top memes of the day vs. total posted

- **Growth**
  - New user signups per day/week
  - User retention (7-day, 30-day)
  - Viral coefficient (sharing rate)

- **Technical Quality**
  - Page load time (< 2 seconds)
  - Error rate (< 2%)
  - Uptime (99.5%+)

### Launch Success Criteria (V1 - First Month)
- 50+ registered users
- 200+ memes created
- 30% Daily Active User return rate (users come back next day)
- Average 5+ votes per user per session
- 20% of memes get at least 5 upvotes (popular threshold)
- Average 2+ comments per meme in popular feed
- 60%+ mobile traffic handled smoothly

---

### User Experience
- [ ] **Guest browsing allowed?**
  - Can non-logged-in users see popular feed?
  - Or require login to view anything?

- [ ] **Notifications?**
  - Notify when someone comments on your meme?
  - Notify when your meme hits certain upvote thresholds?

### Comments
- [ ] **Comment threading?**
  - Simple flat list?

- [ ] **Edit/delete comments?**
  - Users can edit their own comments? Yes
  - Show edit history? No
  - Time limit on edits?

### Authentication
- [ ] **Auth providers?**
  - OAuth (Google, GitHub, Facebook)?
  - Social login only or give email option?

### Technical Architecture
- [ ] **Image storage strategy**
  - Store original templates + user memes separately?
  - Image CDN for performance?
  - Compression strategy for user-uploaded images?

- [ ] **Meme generation approach**
  - Client-side (HTML Canvas API) or server-side?
  - If server-side, what happens under high load?

- [ ] **Database schema decisions**
  - How to store votes efficiently for fast ranking?
  - Cache popular feed or calculate on-demand?
  - Store vote history for analytics?

### Technology Stack
- [ ] Frontend framework: React
- [ ] Backend: Next.js
- [ ] Database: Supabase
- [ ] Image processing: Canvas API (client), Sharp (server), ImageMagick?
- [ ] Hosting: Vercel
- [ ] Image storage: Google Cloud Storage
- [ ] Authentication: Supabase


## 10. Future Enhancements (Post-V1)

### Phase 2 Features (Enhance Social Experience)
- **User Profiles Enhanced**
  - Profile pictures/avatars
  - Bio/description
  - Badges or achievements (e.g., "10K upvotes", "100 memes created")
  - User stats dashboard

- **Advanced Voting & Ranking**
  - "Top of the Week" and "Top of the Month" feeds
  - "Trending" algorithm (upvotes + time + comments)
  - Vote history for users (see what you've upvoted)

- **Notifications**
  - Push notifications or email alerts
  - Comment replies
  - Milestone achievements (your meme hit 100 upvotes!)

- **Favorites/Bookmarks**
  - Save favorite memes to personal collection
  - Private bookmark list

### Phase 3 Features (Community Building)
- **Following System**
  - Follow your favorite creators
  - Feed filtered to show followed users' memes
  - Follower/following counts on profile

- **User-Submitted Templates**
  - Allow users to upload and share custom templates
  - Community voting on templates
  - Template library grows organically

- **Meme Collections/Series**
  - Users can create collections of related memes
  - "Best of" compilations
  - Themed collections

- **Advanced Moderation**
  - Community moderators (trusted users)
  - Reporting system with categories
  - Mod queue and actions log

- **Leaderboards**
  - Top creators of the week/month
  - Hall of fame
  - Friendly competition

### Phase 4 Features (Platform Growth)
- **Mobile Apps**
  - Native iOS and Android apps
  - Push notifications
  - Mobile-optimized creation flow

- **Advanced Content**
  - GIF meme support
  - Video meme creation (short clips)
  - Multi-panel memes (easier comic-style creation)

- **API & Integrations**
  - Public API for developers
  - Slack/Discord bots to share daily top memes
  - Browser extensions
  - Embeddable memes for other sites

- **Contests & Events**
  - Weekly meme contests with themes
  - Community-voted winners
  - Special events (holidays, trending topics)

- **Analytics for Creators**
  - Personal dashboard showing meme performance
  - Best time to post
  - Audience insights

- **Monetization (If Needed)**
  - Tipping/donations to top creators
  - Premium features (no ads, advanced stats)
  - Sponsored meme challenges

---

## 11. Dependencies & Risks

### Dependencies
- Authentication provider (OAuth or custom)
- Database for users, memes, votes, comments
- Image hosting/storage solution
- Domain registration and DNS setup
- SSL certificate
- Image processing library/service
- Email service (for password resets, notifications)

### Risks & Mitigation
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **Offensive/toxic content posted** | High | High | Clear community guidelines, reporting system, active moderation, word filters |
| **Vote manipulation/brigading** | Medium | Medium | Rate limiting, anomaly detection, minimum account age for voting |
| **Low user adoption (ghost town)** | High | Medium | Seed with quality content, invite beta users, marketing strategy |
| **Storage costs scale unexpectedly** | Medium | Medium | Image compression, retention policy, CDN caching, monitor usage |
| **Spam accounts/bots** | Medium | High | Email verification, rate limiting, CAPTCHA on signup, suspicious pattern detection |
| **Copyright issues with templates or user uploads** | High | Medium | Use public domain memes, DMCA takedown process, user guidelines |
| **Database performance under load (votes, comments)** | High | Low | Proper indexing, caching layer (Redis), database optimization from start |
| **Moderation bandwidth** | Medium | Medium | Start small/invite-only, community moderation tools, automated filters |
| **Poor mobile experience** | High | Medium | Mobile-first design, performance testing, progressive web app approach |
| **Harassment between users** | Medium | Medium | Blocking features, reporting system, clear ToS, quick moderator response |
| **Low engagement (people create but don't return)** | High | Medium | Daily popular feed, notifications, gamification (badges), email reminders |

---

## 12. Development Phases

### MVP (V1) - Core Social Platform
**Goal: Functional meme community with daily engagement loop**

Must-Have Features:
- User authentication (signup/login)
- Basic user profiles (username, meme history)
- Meme creation (template library + text editor)
- Post memes to community feed
- Popular feed (top memes of the day)
- Recent feed (chronological)
- Upvote/downvote system
- Comment threads on memes
- Basic search (by username, meme text)
- Responsive design (mobile + desktop)
- Basic moderation tools (delete/ban)

### Post-MVP Priorities
**Priority 1: Content Moderation & Safety**
1. User reporting system
2. Mod queue for reported content
3. Automated content filtering (profanity, etc.)
4. User blocking feature

**Priority 2: Enhanced Discovery**
5. Advanced search and filters
6. "Top of Week/Month" feeds
7. Template categories/tags
8. User search and profile discovery

**Priority 3: Engagement Features**
9. Notifications (comments, milestones)
10. User favorites/bookmarks
11. Comment voting and sorting
12. Profile enhancements (bio, avatar, stats)

**Priority 4: Growth & Retention**
13. Email verification and password reset
14. Shareable links with Open Graph previews
15. Analytics dashboard for creators
16. Mobile app or PWA

---

## 13. Data Model Considerations

### Core Entities
This section outlines the key data entities and their relationships to guide technical implementation.

**Users**
- user_id (primary key)
- username (unique)
- email
- password_hash
- created_at
- profile_data (bio, avatar_url, etc.)

**Memes**
- meme_id (primary key)
- user_id (foreign key - creator)
- template_id (foreign key - which template used)
- image_url (generated meme image)
- top_text
- bottom_text
- middle_text (optional)
- created_at
- vote_count (cached for performance)
- comment_count (cached for performance)

**Templates**
- template_id (primary key)
- name
- image_url (blank template)
- category/tags
- usage_count
- is_active
- created_at

**Votes**
- vote_id (primary key)
- user_id (foreign key)
- meme_id (foreign key)
- vote_type (upvote = 1, downvote = -1)
- created_at
- Unique constraint on (user_id, meme_id) - one vote per user per meme

**Comments**
- comment_id (primary key)
- meme_id (foreign key)
- user_id (foreign key - commenter)
- comment_text
- created_at
- updated_at (if edits allowed)
- parent_comment_id (for threading, nullable)

### Key Queries to Optimize
These are critical database queries that need to be fast:

1. **Popular Feed**: Get top N memes from today ordered by vote_count
2. **Recent Feed**: Get latest N memes ordered by created_at
3. **User Profile**: Get all memes by user_id ordered by created_at
4. **Meme Detail**: Get meme + comments + user's vote status
5. **Vote Status**: Check if user has voted on specific meme
6. **Search**: Find memes by text content or username

### Caching Strategy
- Cache popular feed (regenerate every 5-15 minutes)
- Cache user profiles for active creators
- Cache vote counts on memes (update periodically or on vote)
- Use CDN for all images (templates and generated memes)

---

## Appendix

### Inspiration & References
- **Google Memegen** (internal tool) - Primary inspiration for social meme platform
- **Reddit** (r/memes, r/dankmemes) - Voting and community dynamics
- **9GAG** - Meme social network with voting and comments
- **Imgur** - Image sharing community with upvotes and discussion
- **Imgflip.com** - Meme generator with some social features
- **Know Your Meme** - Meme documentation and history

### Competitive Analysis

| Platform | Strengths | Weaknesses | Our Differentiation |
|----------|-----------|------------|---------------------|
| **Reddit (r/memes)** | Massive community, strong voting system | Not meme-creation focused, generic UI | Built-in meme creator, meme-specific platform |
| **9GAG** | Large user base, mobile apps | Cluttered UI, ad-heavy | Cleaner experience, focus on creation not just sharing |
| **Imgur** | Established community, comments | Not meme-specific, image hosting focus | Dedicated meme platform with templates |
| **Imgflip** | Good meme generator | Weak social features, dated UI | Stronger community and engagement features |
| **Memedroid** | Mobile-first, decent community | Limited creation tools | Better creation tools + web experience |

### Key Differentiators
1. **Integrated creation + social**: Not just sharing, but creating within the platform
2. **Daily popular feed**: Curated best-of-the-day experience (like Google Memegen)
3. **Template library**: Easy access to trending templates
4. **Clean, fast UX**: Focus on speed and simplicity
5. **Community-first**: Built for meme creators and enthusiasts, not casual image sharing

---

## Document History
- **2026-02-14**: Initial draft created
