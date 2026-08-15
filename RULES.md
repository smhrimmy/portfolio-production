# Portfolio OS — New Frontend Build Master Prompt

Use this as the **initial prompt for a completely new Portfolio OS frontend project**. It assumes nothing from the previous codebase and instructs the coding AI to build the system from zero while preserving the architecture and requirements we established.

```text
# PORTFOLIO OS
# NEW FRONTEND — MASTER BUILD PROMPT
# VERSION 1.0

You are building a completely NEW frontend project called:

PORTFOLIO OS

Do NOT assume an existing codebase.

Do NOT reuse broken architecture from previous projects.

Build the frontend as a production-grade system from the ground up.

This is not a simple portfolio template.

Portfolio OS is an interactive personal operating system combining:

- Developer Portfolio
- Software Engineering Showcase
- UI/UX Design Portfolio
- Case Study Platform
- Technical Writing Platform
- Developer Lab
- GitHub Showcase
- Resume Platform
- Personal CMS-ready frontend
- Theme Engine
- Design System
- Motion System
- Optional 3D/WebGL experience

The website itself must demonstrate excellent:

DESIGN
ENGINEERING
UX
ARCHITECTURE
PERFORMANCE
ACCESSIBILITY
RESPONSIVENESS
MOTION
3D
CONTENT STRUCTURE

============================================================
01 — CORE PRINCIPLE
============================================================

Build Portfolio OS as a PRODUCT, not as a collection of portfolio pages.

The architecture must be:

CONTENT
↓
CONTENT MODELS
↓
DESIGN SYSTEM
↓
COMPONENT SYSTEM
↓
LAYOUT SYSTEM
↓
THEME ENGINE
↓
MOTION ENGINE
↓
3D ENGINE
↓
PAGES
↓
DEPLOYMENT

The system must be modular.

Every major feature must be independently replaceable.

Avoid tightly coupled components.

============================================================
02 — TECHNOLOGY STACK
============================================================

Use:

React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Framer Motion
React Router
Three.js
React Three Fiber
@react-three/drei
Zustand
TanStack Query
Zod
Lucide React

Use additional libraries only when they solve a real problem.

Do NOT add unnecessary dependencies.

Use strict TypeScript.

No:

any
implicit any
duplicated types
dead dependencies
unused imports

============================================================
03 — PROJECT STRUCTURE
============================================================

Create:

src/

  app/
    App.tsx
    router.tsx
    providers.tsx

  components/
    ui/
    navigation/
    layout/
    portfolio/
    projects/
    experience/
    writing/
    design/
    lab/
    github/
    resume/
    contact/
    3d/

  features/
    projects/
    experience/
    writing/
    github/
    search/
    themes/
    analytics/

  layouts/
    PublicLayout.tsx
    ArticleLayout.tsx
    CaseStudyLayout.tsx

  pages/
    Home.tsx
    About.tsx
    Projects.tsx
    ProjectDetail.tsx
    Experience.tsx
    Skills.tsx
    Design.tsx
    Certifications.tsx
    Writing.tsx
    ArticleDetail.tsx
    Lab.tsx
    LabDetail.tsx
    GitHub.tsx
    Resume.tsx
    Contact.tsx
    NotFound.tsx
    ServerError.tsx
    Offline.tsx

  data/
    profile.ts
    projects.ts
    experience.ts
    skills.ts
    articles.ts
    certifications.ts
    lab.ts

  types/
    profile.ts
    project.ts
    experience.ts
    article.ts
    skill.ts
    certification.ts
    lab.ts
    theme.ts

  themes/
    registry.ts
    classic.ts
    minimal.ts
    bento.ts
    cyberpunk.ts
    glassOS.ts
    terminalIDE.ts

  design-system/
    tokens.ts
    typography.ts
    spacing.ts
    motion.ts

  hooks/

  lib/
    utils.ts
    constants.ts
    seo.ts
    performance.ts
    device.ts

  store/
    appStore.ts
    themeStore.ts
    settingsStore.ts

  3d/
    PortfolioCore.tsx
    SceneManager.tsx
    PerformanceManager.ts
    DeviceCapabilities.ts
    FallbackVisual.tsx

  styles/
    globals.css

Keep the structure logical.

Do not create enormous files.

============================================================
04 — DESIGN DIRECTION
============================================================

The visual identity must combine:

PREMIUM
EDITORIAL
TECHNICAL
FUTURISTIC
MINIMAL
INTERACTIVE

Avoid generic developer portfolio aesthetics.

Do NOT make it look like:

- a SaaS dashboard
- a gaming website
- a generic Tailwind template
- a résumé PDF
- an overdone cyberpunk site
- a neon landing page
- excessive glassmorphism

The site should feel like a personal digital product.

============================================================
05 — VISUAL LANGUAGE
============================================================

Use:

- strong typography
- large negative space
- precise grid alignment
- subtle borders
- controlled gradients
- restrained glass
- technical metadata
- elegant cards
- layered depth
- sophisticated motion
- occasional 3D

The design should feel expensive without relying on visual noise.

============================================================
06 — COLOR SYSTEM
============================================================

Create semantic design tokens.

Example:

background
background-secondary
surface
surface-elevated
foreground
foreground-secondary
muted
border
accent
accent-secondary
success
warning
error

Do not hardcode colors throughout components.

Themes must consume semantic tokens.

Default theme:

Dark premium editorial.

Also support:

Light
Dark
System

============================================================
07 — TYPOGRAPHY
============================================================

Use:

Sora or similar for display typography.

Inter Tight / Manrope for interface and body text.

JetBrains Mono for:

- code
- technical metadata
- labels
- system information

Typography must have a clear hierarchy:

Display
H1
H2
H3
Body Large
Body
Small
Caption
Mono

============================================================
08 — GRID SYSTEM
============================================================

Desktop:

12-column grid.

Maximum content width:

1440px.

Use consistent:

container
gutter
section spacing
vertical rhythm

Breakpoints must be deliberate.

Support:

320
360
375
390
430
768
834
1024
1280
1440
1920
2560

Mobile must be designed intentionally.

============================================================
09 — GLOBAL NAVIGATION
============================================================

Desktop navigation:

LOGO / NAME

WORK
EXPERIENCE
DESIGN
LAB
WRITING
ABOUT

Actions:

RESUME
CONTACT

Additional controls:

Theme
Search
Settings

Use a compact premium navigation.

Do not create a huge navbar.

Navigation must remain accessible.

============================================================
10 — COMMAND PALETTE
============================================================

Implement:

Ctrl + K
Cmd + K

Command palette commands:

Go Home
Projects
Experience
Design
Lab
Writing
About
GitHub
Resume
Contact
Search Projects
Search Articles
Change Theme
Toggle 3D
Reduce Motion

Support:

keyboard navigation
search
categories
recent commands

============================================================
11 — HOMEPAGE
============================================================

Create:

/

Structure:

1. Navigation

2. Hero

3. Selected Work

4. Design × Engineering

5. Capabilities

6. Experience

7. Featured Case Study

8. Developer Lab

9. Writing

10. GitHub

11. Contact CTA

12. Footer

Do not make every section oversized.

The homepage is an overview.

============================================================
12 — HERO
============================================================

Hero must communicate within seconds:

WHO
WHAT
WHAT THEY BUILD

Structure:

EYEBROW

NAME

ROLE

VALUE PROPOSITION

PRIMARY CTA
VIEW WORK

SECONDARY CTA
VIEW RESUME

3D VISUAL

Use actual content from:

src/data/profile.ts

Do not fabricate achievements.

============================================================
13 — HERO VISUAL
============================================================

Create a distinctive Portfolio Core.

Concept:

A digital system representing:

Projects
Experience
Design
Code
Writing
Technology

Visual:

- central core
- orbiting nodes
- subtle connections
- particles
- depth
- controlled lighting
- cursor interaction

Do NOT create a random rotating cube.

The 3D visual should communicate information architecture.

============================================================
14 — 3D ARCHITECTURE
============================================================

Create:

PortfolioCore
SceneManager
PerformanceManager
DeviceCapabilities
FallbackVisual

3D must be isolated from normal UI.

Never put complex Three.js logic directly into pages.

============================================================
15 — 3D PERFORMANCE
============================================================

Detect:

WebGL
device capability
screen size
DPR
reduced motion

Create:

HIGH
MEDIUM
LOW

performance tiers.

High:

full visual quality

Medium:

reduced particles
reduced shadows

Low:

minimal animation

Very low / unsupported:

static fallback

============================================================
16 — 3D FALLBACK
============================================================

The entire site must work without WebGL.

If WebGL fails:

render a sophisticated static Portfolio Core visual.

If reduced motion is enabled:

disable animated 3D.

If device performance is poor:

use simplified rendering.

============================================================
17 — MOTION SYSTEM
============================================================

Use Framer Motion.

Create centralized variants:

fadeIn
fadeInUp
fadeInDown
slideIn
scaleIn
stagger
pageTransition
modalTransition
drawerTransition

Do not define random animation variants in every component.

============================================================
18 — MOTION PHILOSOPHY
============================================================

Animation should communicate:

hierarchy
direction
state
relationship
feedback

Do NOT animate everything.

Avoid:

long transitions
constant floating
excessive parallax
scroll-jacking
unnecessary loaders

Navigation should feel fast.

============================================================
19 — REDUCED MOTION
============================================================

Support:

prefers-reduced-motion

Also create a user setting:

Reduce Motion

This must affect:

Framer Motion
3D
parallax
cursor effects
video
scroll animations

============================================================
20 — DESIGN SYSTEM
============================================================

Build reusable primitives:

Button
IconButton
Badge
Tag
Card
Tooltip
Popover
Dialog
Drawer
Tabs
Accordion
Dropdown
Input
Textarea
Select
Checkbox
Switch
Toast
Skeleton
Separator
Breadcrumb
Pagination

Every component must support appropriate:

hover
focus
active
disabled
loading
error

============================================================
21 — PORTFOLIO COMPONENTS
============================================================

Create:

ProjectCard
ProjectGrid
ProjectHero
ProjectMeta
TechnologyList
CaseStudy
ExperienceTimeline
ExperienceCard
SkillGroup
SkillCard
CertificationCard
ArticleCard
ArticleHeader
ArticleContent
ArticleTOC
ReadingProgress
GitHubActivity
GitHubRepository
LabCard
ContactForm
ResumePreview
SocialLinks

============================================================
22 — ACCESSIBILITY
============================================================

Target:

WCAG 2.2 AA

Requirements:

semantic HTML
keyboard navigation
visible focus
ARIA
screen-reader support
contrast
form labels
touch-friendly controls
reduced motion

Nothing important may depend only on:

hover
mouse
3D
animation

============================================================
23 — PROJECTS
============================================================

Route:

/projects

Features:

Featured
All
Frontend
Backend
Full Stack
AI
Mobile
UI/UX
Tools
Experiments

Filters must be:

keyboard accessible
URL-aware
shareable

Example:

/projects?category=frontend

============================================================
24 — PROJECT CARD
============================================================

Each card:

image/visual
number
title
description
category
technologies
status

Actions:

View Case Study
Live Demo
GitHub

Keep cards clean.

============================================================
25 — PROJECT DETAIL
============================================================

Route:

/projects/:slug

Structure:

Hero
Overview
Role
Timeline
Problem
Goals
Research
Design
Architecture
Implementation
Features
Challenges
Solutions
Testing
Performance
Results
Lessons
Future
Links
Related Projects

============================================================
26 — ENGINEERING CASE STUDY
============================================================

Support:

Architecture
Data Flow
Frontend
Backend
Database
Authentication
State
Caching
Security
Testing
Performance
Deployment
Trade-offs

Use diagrams where useful.

============================================================
27 — UX CASE STUDY
============================================================

Support:

Problem
Users
Research
Insights
User Flow
Information Architecture
Wireframes
Iterations
Design System
Accessibility
Final Design
Prototype
Outcome

Do not make the case study a screenshot dump.

============================================================
28 — EXPERIENCE
============================================================

Route:

/experience

Create a refined timeline.

Each entry:

Company
Role
Location
Start
End
Description
Responsibilities
Technologies
Achievements if actually available

Support:

desktop timeline
mobile timeline
filtering
expanded details

============================================================
29 — SKILLS
============================================================

Route:

/skills

Categories:

Frontend
Backend
Database
Mobile
Cloud
DevOps
AI
UI/UX
Design
Tools

Do not create a giant wall of logos.

Connect skills to projects where useful.

============================================================
30 — DESIGN
============================================================

Route:

/design

Create a serious UI/UX portfolio section.

Include:

Design Systems
UI
UX
Wireframes
Prototypes
Interaction Design
Motion
Accessibility

The page itself must demonstrate good design.

============================================================
31 — DESIGN SYSTEM SHOWCASE
============================================================

Include:

Colors
Typography
Spacing
Buttons
Inputs
Cards
Forms
Navigation
States
Motion
Accessibility

This demonstrates the quality of Portfolio OS's own design system.

============================================================
32 — LAB
============================================================

Route:

/lab

The Lab is an experimental environment.

Categories:

WebGL
AI
Motion
UI
Developer Tools
Automation
Prototypes

Each item:

title
description
technology
preview
demo
source
status

============================================================
33 — LAB EXPERIENCE
============================================================

The Lab may include an interactive 3D environment.

But ALWAYS provide:

Grid View

as the standard fallback.

3D is enhancement.

It must never be the only navigation method.

============================================================
34 — WRITING
============================================================

Route:

/writing

Support:

categories
tags
search
reading time
reading progress
table of contents
code blocks
copy code
related articles

Visual direction:

technical editorial publication.

Not a generic blog template.

============================================================
35 — ARTICLE
============================================================

Route:

/writing/:slug

Structure:

Title
Subtitle
Author
Date
Reading Time
Hero
TOC
Article
Code
Images
Related Articles

Support syntax highlighting.

============================================================
36 — GITHUB
============================================================

Route:

/github

Display:

Contribution activity
Featured repositories
Languages
Stars
Forks
Recent repositories

GitHub must be optional.

If API fails:

show cached/static data.

Never allow GitHub failure to break the site.

============================================================
37 — CERTIFICATIONS
============================================================

Route:

/certifications

Card:

Name
Issuer
Date
Credential ID
Credential URL
Image
Skills

Only display actual certifications.

============================================================
38 — ABOUT
============================================================

Route:

/about

Sections:

Identity
Story
Engineering Philosophy
Design Philosophy
How I Work
Current Focus

Process:

Discover
Define
Design
Prototype
Engineer
Test
Deploy
Iterate

============================================================
39 — RESUME
============================================================

Route:

/resume

Provide:

View Resume
Download PDF

Resume should be clean and printable.

============================================================
40 — CONTACT
============================================================

Route:

/contact

Fields:

Name
Email
Subject
Message

Actions:

Send Message
Email
LinkedIn
GitHub

Provide validation.

Show:

loading
success
error

============================================================
41 — ERROR STATES
============================================================

Create:

404
500
Offline
Network Error
Content Error
GitHub Error
Search Empty
Filter Empty

Each must provide recovery actions.

============================================================
42 — LOADING STATES
============================================================

Use skeletons.

Avoid unnecessary full-screen loading screens.

The initial application may have a short initialization sequence if needed.

Returning users should not repeatedly wait through it.

============================================================
43 — SEARCH
============================================================

Global search indexes:

Projects
Articles
Experience
Skills
Lab

Display:

title
type
description

Keyboard navigation required.

============================================================
44 — THEME ENGINE
============================================================

Create a theme registry.

Themes:

Classic
Minimal
Bento
Cyberpunk
Glass OS
Terminal IDE

Default:

Premium Editorial

Themes change:

colors
spacing
radius
typography
surface treatment
component styling
motion intensity

Content does NOT change.

============================================================
45 — TEMPLATE CONTRACT
============================================================

Every theme must support the same content model.

The same project must render correctly in:

Classic
Minimal
Bento
Cyberpunk
Glass OS
Terminal IDE

No theme may invent its own project schema.

============================================================
46 — CONTENT MODELS
============================================================

Create strongly typed models.

Profile:

id
name
headline
roles
bio
location
avatar
socials
email
resume

Project:

id
slug
title
description
longDescription
category
technologies
image
gallery
featured
status
links
caseStudy

Experience:

id
company
role
location
startDate
endDate
description
responsibilities
technologies

Article:

id
slug
title
excerpt
content
date
tags
category
readingTime
cover

Skill:

id
name
category
icon
projects

Certification:

id
name
issuer
date
credentialUrl
image

Lab:

id
slug
title
description
category
technologies
status
demoUrl
sourceUrl
visual

============================================================
47 — CMS READY
============================================================

Initially use local typed data.

However:

all content access must happen through a data abstraction.

Example:

getProjects()
getProjectBySlug()
getExperience()
getArticles()
getArticleBySlug()
getSkills()

Later these functions can connect to:

Supabase
REST API
GraphQL
CMS

without rewriting UI components.

============================================================
48 — DATA VALIDATION
============================================================

Use Zod schemas.

Validate:

projects
articles
experience
skills
certifications
profile
lab

Invalid content must not silently break rendering.

============================================================
49 — PROJECT RELATIONSHIPS
============================================================

Projects can connect to:

Skills
Experience
Articles
GitHub
Technologies
Lab experiments

Use relationships to create contextual navigation.

============================================================
50 — RELATED CONTENT
============================================================

At the bottom of:

Projects
Articles
Experience

show relevant related content.

Avoid random recommendations.

============================================================
51 — MEDIA SYSTEM
============================================================

Centralize media definitions.

Support:

images
videos
posters
3D assets
PDF
project galleries

Use optimized loading.

============================================================
52 — VIDEO
============================================================

Support optional cinematic video.

Requirements:

lazy loading
poster
mobile fallback
no sound autoplay
compressed assets

Video must never be required for understanding content.

============================================================
53 — CUSTOM CURSOR
============================================================

Optional desktop enhancement.

States:

Default
Link
Project
External
Explore

Disable on:

touch
mobile
reduced motion
low-performance devices

Never make it interfere with usability.

============================================================
54 — SCROLL INTERACTION
============================================================

Use scroll interactions selectively.

Good:

hero transitions
case-study storytelling
process visualization
major visual transitions

Bad:

every card
every paragraph
every section

============================================================
55 — PERFORMANCE
============================================================

Target:

LCP < 2.5s
CLS < 0.1
INP < 200ms

Optimize:

images
fonts
JavaScript
CSS
3D
video

Lazy-load:

Three.js
3D assets
large images
video
GitHub data

============================================================
56 — 3D PERFORMANCE
============================================================

3D must:

pause when invisible
reduce DPR where appropriate
limit particles
dispose resources
avoid unnecessary rerenders
use instancing where useful

Never run expensive animation continuously in hidden sections.

============================================================
57 — MOBILE
============================================================

Mobile is first-class.

Create dedicated layouts where necessary.

Do not simply shrink desktop components.

Test:

320
360
375
390
430
768

============================================================
58 — RESPONSIVE 3D
============================================================

Desktop:

full Portfolio Core

Tablet:

reduced complexity

Mobile:

minimal visual or static fallback

Low-end devices:

static visual

============================================================
59 — SEO
============================================================

Every page needs:

title
description
canonical
OpenGraph
Twitter/social metadata

Generate:

sitemap
robots.txt

Use structured data where appropriate.

============================================================
60 — SECURITY
============================================================

Never expose secrets.

No private API keys in frontend.

Sanitize external content.

Use secure forms.

Add spam protection architecture for contact.

============================================================
61 — ANALYTICS READY
============================================================

Create an analytics abstraction.

Track:

page_view
project_view
case_study_view
resume_download
demo_click
github_click
article_view
article_complete
contact_started
contact_submitted
theme_changed
3d_disabled

Do not hardcode a vendor.

============================================================
62 — TESTING
============================================================

Set up:

TypeScript checking
ESLint
unit tests
component tests
E2E tests
accessibility testing

Critical E2E flow:

Home
→ Projects
→ Project
→ Experience
→ Writing
→ Article
→ Resume
→ Contact

============================================================
63 — VISUAL QA
============================================================

Test:

320px
390px
768px
1024px
1440px
1920px

Verify:

spacing
alignment
typography
overflow
navigation
forms
images
motion
3D
fallbacks

============================================================
64 — BROWSER QA
============================================================

Verify:

Chrome
Edge
Firefox
Safari where available

Pay attention to:

WebGL
sticky positioning
backdrop-filter
fonts
video
scroll behavior

============================================================
65 — ACCESSIBILITY QA
============================================================

Verify:

keyboard-only navigation
screen-reader labels
focus order
contrast
forms
dialogs
menus
command palette
reduced motion

============================================================
66 — ROUTES
============================================================

Create:

/
/about
/projects
/projects/:slug
/experience
/skills
/design
/certifications
/writing
/writing/:slug
/lab
/lab/:slug
/github
/resume
/contact

Fallback:

/404
/500
/offline

============================================================
67 — HOMEPAGE CONTENT PRIORITY
============================================================

The visual hierarchy must be:

1. Identity
2. Strongest work
3. Capabilities
4. Experience
5. Design + Engineering
6. Case studies
7. Lab
8. Writing
9. GitHub
10. Contact

Do not bury the strongest projects.

============================================================
68 — RECRUITER UX
============================================================

A recruiter should be able to answer:

Who is this?
What does this person do?
What have they built?
What technologies do they know?
Where have they worked?
Can I see their work?
Can I download the resume?
How do I contact them?

within seconds.

============================================================
69 — ENGINEER UX
============================================================

A technical visitor should be able to inspect:

architecture
code
projects
GitHub
case studies
performance
design systems
technical writing

without being forced through decorative animation.

============================================================
70 — DESIGNER UX
============================================================

A design-focused visitor should see:

visual hierarchy
spacing
typography
interaction
motion
design systems
UX reasoning

The interface itself is part of the portfolio.

============================================================
71 — SIGNATURE EXPERIENCE
============================================================

Create one distinctive Portfolio OS interaction.

Recommended concept:

PORTFOLIO CORE

The homepage contains a central digital system.

Nodes represent:

WORK
EXPERIENCE
DESIGN
LAB
WRITING
SKILLS

Clicking a node provides a quick preview.

Then the visitor can open the complete section.

This creates a memorable experience without compromising navigation.

============================================================
72 — DESIGN × ENGINEERING
============================================================

Create a signature section:

DESIGN
↓
SYSTEM
↓
COMPONENTS
↓
CODE
↓
TEST
↓
DEPLOY

Make this visually compelling.

It should communicate the ability to translate design into production software.

============================================================
73 — PORTFOLIO OS FOOTER
============================================================

Footer should contain:

Name
Role
Short statement
Navigation
Social links
Email
Resume
Copyright

Optional:

Built with Portfolio OS

============================================================
74 — CONTENT RULE
============================================================

NEVER fabricate:

clients
companies
metrics
achievements
certifications
projects
testimonials
skills
job titles

Use placeholder content only when explicitly marked:

[CONTENT REQUIRED]

Never present placeholder content as real information.

============================================================
75 — PERFORMANCE RULE
============================================================

A beautiful website that performs badly is a failed implementation.

Prioritize:

performance
accessibility
content
navigation

over:

3D
particles
video
special effects

============================================================
76 — IMPLEMENTATION PHASES
============================================================

PHASE 01
Project initialization

PHASE 02
Design tokens

PHASE 03
Typography

PHASE 04
Global layout

PHASE 05
Navigation

PHASE 06
UI primitives

PHASE 07
Theme engine

PHASE 08
Motion engine

PHASE 09
Content models

PHASE 10
Local data layer

PHASE 11
Homepage

PHASE 12
Projects

PHASE 13
Project case studies

PHASE 14
Experience

PHASE 15
Skills

PHASE 16
Design

PHASE 17
Writing

PHASE 18
Lab

PHASE 19
GitHub

PHASE 20
Certifications

PHASE 21
About

PHASE 22
Resume

PHASE 23
Contact

PHASE 24
Error/loading/offline states

PHASE 25
Search

PHASE 26
Command palette

PHASE 27
Portfolio Core 3D

PHASE 28
Performance optimization

PHASE 29
Accessibility audit

PHASE 30
SEO

PHASE 31
Testing

PHASE 32
Production hardening

============================================================
77 — FIRST BUILD
============================================================

DO NOT attempt to implement all 32 phases in one pass.

Start with:

PHASE 01
PHASE 02
PHASE 03
PHASE 04
PHASE 05
PHASE 06
PHASE 07
PHASE 08
PHASE 09
PHASE 10
PHASE 11

The first milestone must produce:

A fully working Portfolio OS shell.

It must include:

- polished navigation
- responsive layout
- design system
- typography
- theme engine
- motion system
- typed content models
- local data layer
- homepage
- project preview
- experience preview
- writing preview
- footer

============================================================
78 — QUALITY GATE
============================================================

Before moving to the next phase:

Run:

npm install
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test

Fix ALL:

TypeScript errors
ESLint errors
build errors
runtime errors
console errors
hydration errors
broken routes
overflow
accessibility failures

Do not continue if the foundation is unstable.

============================================================
79 — NO FAKE COMPLETION
============================================================

Do not say:

"Everything is complete"

unless:

- all routes work
- all buttons work
- all links work
- theme switching works
- mobile works
- desktop works
- keyboard navigation works
- reduced motion works
- loading states work
- error states work
- production build succeeds
- no critical console errors exist

============================================================
80 — FINAL PRODUCT STANDARD
============================================================

Portfolio OS must feel like:

A premium digital product
+
A developer workspace
+
A design system
+
A technical publication
+
An interactive portfolio

It should be memorable because of:

clarity
craft
architecture
interaction
content
visual identity

—not because of excessive effects.

============================================================
81 — START NOW
============================================================

Create the project from scratch.

Start with the architecture.

Then create the design system.

Then create the global layout.

Then navigation.

Then the component primitives.

Then the theme engine.

Then the motion engine.

Then typed content models.

Then local data.

Then the homepage.

Do NOT jump directly into 3D.

Do NOT create every page with placeholder content.

Do NOT create fake portfolio achievements.

Build the foundation properly first.

After the first milestone is stable, continue phase-by-phase.

At every phase:

IMPLEMENT
TEST
FIX
VERIFY
THEN CONTINUE.

The final result must be production-ready, responsive, accessible, performant, modular, CMS-ready and visually distinctive.
```

### Recommended build sequence

```text
FOUNDATION
    ↓
DESIGN SYSTEM
    ↓
GLOBAL SHELL
    ↓
THEME ENGINE
    ↓
MOTION ENGINE
    ↓
CONTENT SYSTEM
    ↓
HOME
    ↓
PROJECTS
    ↓
CASE STUDIES
    ↓
EXPERIENCE
    ↓
DESIGN
    ↓
WRITING
    ↓
LAB
    ↓
GITHUB
    ↓
RESUME / CONTACT
    ↓
SEARCH
    ↓
3D PORTFOLIO CORE
    ↓
ADVANCED INTERACTIONS
    ↓
CMS INTEGRATION
    ↓
PRODUCTION HARDENING
```

This version is intentionally structured as a **new build**, rather than asking an AI coding agent to reconcile the previous implementation. It also keeps the frontend **CMS-ready from day one**, so the later Portfolio OS CMS can plug into the same typed content/data layer without rebuilding the UI.