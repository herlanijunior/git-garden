# Planning Guide

An interactive, delightful Git visualization playground that makes learning Git history, branching, and complex operations feel like playing with adorable animals in a story-driven repository garden.

**Experience Qualities**:
1. **Playful and Approachable** - Git concepts are intimidating; this should feel like a friendly game with charming animal characters guiding you through complex version control concepts.
2. **Visually Enchanting** - Smooth animations, vibrant colors, and delightful micro-interactions that make commit graphs feel alive and understandable rather than abstract and technical.
3. **Progressively Educational** - Tooltips, explanations, and interactive scenarios that teach Git concepts through doing rather than reading dense documentation.

**Complexity Level**: Complex Application (advanced functionality, accounts)
This is a full-featured educational platform with interactive graph visualization, scenario simulation, timeline playback, filtering systems, and persistent user progress through various Git learning scenarios.

## Essential Features

### Interactive Commit Graph Visualization
- **Functionality**: Renders Git commits as nodes connected by directional edges, supporting branches and merges with pan/zoom controls
- **Purpose**: Makes abstract Git history concrete and visually understandable
- **Trigger**: Loads on app start with sample repository or user-selected scenario
- **Progression**: Initial graph render → user pans/zooms to explore → clicks commit node → detail panel slides in → displays author (with animal avatar), message, timestamp, file changes
- **Success criteria**: Smooth 60fps canvas rendering, supports 100+ commits without lag, clear visual distinction between branches

### Scenario Simulation System
- **Functionality**: Step-by-step animated visualization of Git operations (upstream sync, force push, revert, cherry-pick, merge conflicts)
- **Purpose**: Demystifies complex Git operations through visual storytelling
- **Trigger**: User selects scenario from sidebar menu
- **Progression**: Scenario selection → initial state displays → user clicks "Next Step" → animated transition shows operation → explanation tooltip appears → repeat until complete → quiz question (challenge mode)
- **Success criteria**: 6+ pre-built scenarios, clear before/after states, <300ms animation transitions

### Timeline Playback Feature
- **Functionality**: Animates commit history chronologically with play/pause controls
- **Purpose**: Shows how repositories evolve over time, making history tangible
- **Trigger**: User clicks "Play History" button
- **Progression**: Play button click → timeline scrubber appears → commits appear sequentially with timestamp annotations → branches form organically → user can pause/seek → speed controls available
- **Success criteria**: Adjustable playback speed (0.5x - 3x), smooth animations, scrubber shows preview on hover

### Advanced Filtering System
- **Functionality**: Filter commits by branch, author (animal characters), date range, or search query
- **Purpose**: Helps users focus on specific parts of large repositories
- **Trigger**: User opens filter panel or uses search bar
- **Progression**: Filter panel opens → user selects criteria → graph updates with fade animation → filtered commits highlighted → clear filter button appears
- **Success criteria**: Sub-100ms filter application, visual feedback for active filters, maintains graph layout coherence

### Educational Tooltips & Challenge Mode
- **Functionality**: Context-aware explanations and optional quiz questions
- **Purpose**: Teaches Git concepts through interaction and validation
- **Trigger**: Hover over UI elements or enable challenge mode toggle
- **Progression**: Hover on concept → tooltip fades in with animal mascot → clear explanation with example → challenge mode: question appears → user selects answer → immediate feedback with explanation
- **Success criteria**: 20+ educational tooltips, 10+ challenge questions, friendly tone without condescension

### Remote vs Local Visualization
- **Functionality**: Distinct visual styling for local branches, remote branches, and divergence indicators
- **Purpose**: Clarifies the crucial local/remote distinction that confuses Git learners
- **Trigger**: Automatic when repository has remote tracking
- **Progression**: Graph loads → local branches in solid colors → remote branches in dashed/outlined style → divergence shown with bidirectional arrows → click for sync options
- **Success criteria**: Clear visual distinction, ahead/behind commit counts, fetch/push action buttons

## Edge Case Handling

- **Empty Repository**: Show friendly "No commits yet!" message with cute animal waiting to start, offer to load sample data
- **Large Graphs (500+ commits)**: Implement virtualization and LOD system, aggregate distant commits into summary nodes
- **Complex Merge Conflicts**: Highlight conflict zones in orange/yellow, show file-level detail panel with resolution hints
- **Detached HEAD State**: Special visual indicator (floating animal avatar) with tooltip explaining the state
- **Orphan Branches**: Render as separate graph islands with connecting animation on hover showing they're in same repo
- **Long Commit Messages**: Truncate with "..." in node view, show full message in detail panel
- **Mobile Viewport**: Switch to vertical scrolling timeline view with collapsible branches

## Design Direction

The design should feel like a whimsical, hand-crafted storybook meets a polished modern developer tool—playful and warm with cute animal mascots, but maintaining the precision and clarity developers expect. Think Duolingo's friendly gamification applied to Git concepts. The interface should balance rich visual details (animals, colors, smooth animations) with information density, ensuring the graph remains readable even with educational overlays. Lean toward a rich interface that delights through subtle animations and character personalities while keeping Git data the hero.

## Color Selection

Analogous color scheme with nature-inspired palette (greens, teals, blues) that evokes growth and branching trees, with vibrant accent colors for different Git operations.

- **Primary Color**: Forest Green `oklch(0.55 0.12 155)` - Represents growth, version control as a living tree, used for main branch and primary actions
- **Secondary Colors**: 
  - Teal `oklch(0.65 0.10 200)` for feature branches (cool, exploratory)
  - Sky Blue `oklch(0.70 0.08 240)` for remote branches (distant, cloud-like)
  - Sage `oklch(0.75 0.05 140)` for supporting UI elements
- **Accent Color**: Sunny Orange `oklch(0.72 0.15 60)` for actions, highlights, and interactive elements that demand attention (cherry-pick, force push warnings)
- **Foreground/Background Pairings**:
  - Background (Cream `oklch(0.97 0.01 90)`): Charcoal text `oklch(0.25 0.01 270)` - Ratio 12.5:1 ✓
  - Card (White `oklch(1 0 0)`): Charcoal text `oklch(0.25 0.01 270)` - Ratio 14.8:1 ✓
  - Primary (Forest Green): White text `oklch(0.98 0 0)` - Ratio 4.8:1 ✓
  - Secondary (Teal): White text `oklch(0.98 0 0)` - Ratio 5.2:1 ✓
  - Accent (Sunny Orange): Charcoal text `oklch(0.25 0.01 270)` - Ratio 8.1:1 ✓
  - Muted (Light Sage `oklch(0.92 0.02 140)`): Medium Gray text `oklch(0.45 0.01 270)` - Ratio 6.2:1 ✓

## Font Selection

Typography should balance playful personality with technical clarity—rounded sans-serif for headings to match the friendly animal aesthetic, and a crisp monospace for commit data to maintain developer familiarity.

- **Typographic Hierarchy**:
  - H1 (App Title): Poppins Bold / 32px / -0.02em letter spacing / Used for main "Git Garden" title
  - H2 (Section Headers): Poppins SemiBold / 24px / -0.01em letter spacing / Scenario titles, panel headers
  - H3 (Commit Nodes): Inter Medium / 14px / normal / Short commit hashes and branch names
  - Body (Explanations): Inter Regular / 16px / 1.6 line height / Educational tooltips and descriptions
  - Monospace (Technical Data): JetBrains Mono / 14px / 1.5 line height / Commit hashes, timestamps, file paths
  - Caption (Metadata): Inter Regular / 13px / Muted color / Author names, relative timestamps

## Animations

Animations should feel organic and physics-based, like watching a garden grow or water flowing through branches—emphasizing the living, evolving nature of Git repositories while providing clear cause-and-effect for operations.

- **Purposeful Meaning**: Commits "bloom" into existence, branches split like growing vines, merges flow together like streams, and operations feel like tending a garden rather than executing commands
- **Hierarchy of Movement**: 
  - High importance: Git operations (commit creation, branch/merge animations) get 400-600ms with spring physics
  - Medium: UI transitions (panel slides, filter updates) at 250-350ms with ease-out
  - Low: Hover states and micro-interactions at 150-200ms with gentle ease

## Component Selection

- **Components**: 
  - Canvas-based commit graph (custom D3.js visualization, not shadcn)
  - Sidebar navigation with Collapsible for scenario categories
  - Sheet component for commit detail panel (slides from right)
  - Tabs for switching between Explore/Scenarios/Challenge modes
  - Card for educational tooltips with animal avatars
  - Button with Phosphor icons (Play, Pause, GitBranch, GitCommit, GitMerge, GitFork)
  - Select for filtering branches/authors
  - Slider for timeline scrubber and playback speed
  - Toggle for dark/light theme
  - Badge for branch names, commit counts, ahead/behind indicators
  - Tooltip for inline Git concept explanations
  - Dialog for challenge mode questions
  - Progress indicator for scenario completion

- **Customizations**: 
  - Custom SVG commit node component with animal avatar integration
  - Custom canvas graph renderer with zoom/pan controls (using D3 zoom behavior)
  - Animated timeline scrubber with preview popup
  - Custom animal avatar component system (randomized per author)

- **States**: 
  - Buttons: Default with soft shadow, hover lifts slightly, active scales down, disabled grays with 50% opacity
  - Commit nodes: Default with subtle pulse, hover enlarges 1.1x + tooltip, selected with glow ring, dimmed when filtered out
  - Edges: Default solid for local, dashed for remote, animated dotted during operations
  - Panels: Slide transitions with backdrop blur

- **Icon Selection**: 
  - GitBranch for branch operations
  - GitCommit for individual commits
  - GitMerge for merge scenarios  
  - Play/Pause for timeline controls
  - FastForward/Rewind for playback speed
  - FunnelSimple for filters
  - Question for challenge mode
  - Info for educational tooltips
  - ArrowsClockwise for sync operations
  - Warning for force push/dangerous operations

- **Spacing**: 
  - Container padding: `p-6` on desktop, `p-4` on mobile
  - Section gaps: `gap-8` for major sections, `gap-4` for related groups
  - Card padding: `p-5` for content cards
  - Graph margins: Minimum 40px clearance from viewport edges
  - Button groups: `gap-2` for related actions

- **Mobile**: 
  - Graph switches to vertical timeline layout
  - Sidebar becomes bottom sheet drawer
  - Commit details in full-screen sheet instead of side panel
  - Touch gestures: pinch to zoom, two-finger pan, tap for select, long-press for context menu
  - Reduce max visible commits to 50 on mobile
  - Stack filters in accordion vs. horizontal bar
