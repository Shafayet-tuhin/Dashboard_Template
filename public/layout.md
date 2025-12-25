# Layout Architecture Pattern Documentation

## Overview

The Loge Frontend uses a sophisticated responsive layout system that combines a collapsible left sidebar menu with a fixed top header. This document explains the architectural pattern, design decisions, and how the components work together.

## Layout Structure

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│          LayoutComponent (Main Container)       │
├──────────────┬────────────────────────────────────┤
│              │                                     │
│  LeftMenu    │  TopHeader (Fixed)                  │
│  (Fixed)     │  ┌──────────────────────────────────┤
│              │  │                                   │
│  Collapsible │  │  Main Content Area               │
│  12rem/4rem  │  │  (router-outlet)                 │
│              │  │                                   │
│              │  │  Responsive padding              │
│              │  │  Scrollable content              │
│              │  │                                   │
└──────────────┴────────────────────────────────────┘
```

## Component Organization

### 1. **LayoutComponent** (Main Orchestrator)
**Location:** `src/app/layout/layout.component.ts|html|css`

**Responsibilities:**
- Acts as the main wrapper for the application layout
- Manages sidebar collapsed state
- Handles mobile drawer menu visibility
- Provides responsive layout structure
- Manages inactive user state display

**Key Features:**
- Standalone Angular component
- Imports TopHeaderComponent, LeftMenuComponent, MobileDrawerMenuComponent
- Uses CSS Grid/Flexbox for layout management
- Responsive design with mobile considerations

**State Management:**
```typescript
isCollapsed = false;           // Sidebar collapse state
mobileDrawerOpen = false;      // Mobile drawer visibility
isUserInactive = computed(...) // User activity status
```

**Event Handling:**
- `onCollapsed(collapsed)` - Receives sidebar collapse state from LeftMenu
- `toggleMobileDrawer()` - Toggles mobile drawer visibility
- `closeMobileDrawer()` - Closes mobile drawer (used after navigation)

### 2. **LeftMenuComponent** (Navigation Sidebar)
**Location:** `src/app/layout/left-menu/left-menu.component.ts`

**Responsibilities:**
- Displays main navigation menu with role-based access
- Manages sidebar collapse/expand toggle
- Handles language selection
- Emits collapse state to parent (LayoutComponent)

**Key Features:**
- Role-based menu item filtering
- Dynamic icon switching (active/inactive states)
- Language selector integration
- Smooth transition animations

**Menu Items:**
- Dashboard (All roles)
- Bookings (Member, Ambassador, Admin, Root Admin)
- Booking Log (Golf Club Manager only)
- Users (Admin, Root Admin)
- Golf Clubs (Admin, Root Admin)
- Golf Club Rules (Admin, Root Admin)
- Hotels (Admin, Root Admin)
- Overview Map (Admin, Root Admin)
- Partner Network (Member, Ambassador, Admin, Root Admin)
- Settings (Root Admin only)

**Output Events:**
```typescript
@Output() collapsed = new EventEmitter<boolean>();       // Sidebar toggle
@Output() menuItemClicked = new EventEmitter<void>();   // Menu navigation
```

### 3. **TopHeaderComponent** (Fixed Navigation Bar)
**Location:** `src/app/layout/top-header/top-header.component.ts`

**Responsibilities:**
- Displays breadcrumb navigation
- Shows user profile information
- Manages logout functionality
- Provides mobile menu toggle button
- Handles language switching

**Key Features:**
- Dynamic breadcrumb generation based on current route
- Support for dynamic breadcrumb labels (golf club names, user names, etc.)
- Logout confirmation modal
- Responsive mobile menu trigger
- Translation support for breadcrumbs

**Breadcrumb Logic:**
- Automatically generates breadcrumb trail from URL segments
- Maps route segments to translated labels
- Supports dynamic labels through BreadcrumbService
- Special handling for detail pages (golf clubs, hotels, users, bookings)

**Output Events:**
```typescript
@Output() mobileMenuToggle = new EventEmitter<void>();  // Trigger mobile drawer
```

### 4. **MobileDrawerMenuComponent** (Mobile Navigation)
**Location:** `src/app/layout/mobile-drawer-menu/`

**Responsibilities:**
- Provides mobile-friendly navigation drawer
- Replaces left menu on small screens
- Manages drawer open/close animations

**Features:**
- Slide-in drawer animation
- Close on navigation
- Same menu items as desktop LeftMenu

## Layout CSS Architecture

### Responsive Design Strategy

**CSS Classes:**
- `.main-content` - Main container that adjusts based on sidebar state
- `.sidebar-collapsed` - State class when sidebar is collapsed
- `.mobile-drawer-open` - State class when mobile drawer is open

**CSS Grid/Flexbox Layout:**

```css
/* Main flex container */
display: flex;
min-h-screen;

/* Main content responsive margins */
@media (min-width: 768px) {
  .main-content {
    margin-left: 12rem;  /* Full sidebar width */
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 4rem;   /* Collapsed sidebar width */
  }
}

@media (max-width: 767px) {
  .main-content {
    margin-left: 0;      /* No sidebar margin on mobile */
  }
}
```

**Horizontal Overflow Prevention:**
```css
/* Comprehensive overflow prevention */
:host {
  width: 100%;
  overflow-x: hidden;
}

main {
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  max-width: 100%;
}

/* All content respects boundaries */
main *,
.flex * {
  word-wrap: break-word;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
}
```

## Design Patterns Used

### 1. **State Management Pattern**
- Parent component (LayoutComponent) maintains layout state
- State is passed down to child components via `[class]` bindings
- Child components emit events to notify parent of state changes

### 2. **Responsive Design Pattern**
- Media queries for breakpoint handling (768px for mobile/desktop split)
- CSS transitions for smooth animations (0.2s ease-in-out)
- TailwindCSS for utility classes (`hidden md:block`, `sm:p-[var(...)]`)

### 3. **Event-Driven Communication**
```typescript
// Parent listening to child events
(collapsed)="onCollapsed($event)"
(mobileMenuToggle)="toggleMobileDrawer()"
(closeDrawer)="closeMobileDrawer()"

// Parent passing state to children
[class.sidebar-collapsed]="isCollapsed"
[isOpen]="mobileDrawerOpen"
```

### 4. **Conditional Rendering Pattern**
```html
<!-- Desktop: Hidden on mobile -->
<app-left-menu class="hidden md:block">

<!-- Mobile: Only shown on small screens -->
<app-mobile-drawer-menu [isOpen]="mobileDrawerOpen">

<!-- Content wrapper with dynamic class -->
<div class="main-content" [class.sidebar-collapsed]="isCollapsed">
```

### 5. **Angular Signals for Computed State**
```typescript
isUserInactive = computed(() => isUserInactive(this.authService.getUserStatus()));
```

## Data Flow

### Sidebar Collapse Flow
```
LeftMenuComponent
  └─> @Output() collapsed
      └─> LayoutComponent.onCollapsed()
          └─> isCollapsed = collapsed
              └─> [class.sidebar-collapsed]="isCollapsed"
                  └─> CSS adjusts margin-left
```

### Mobile Menu Flow
```
TopHeaderComponent
  └─> @Output() mobileMenuToggle
      └─> LayoutComponent.toggleMobileDrawer()
          └─> mobileDrawerOpen = !mobileDrawerOpen
              └─> [isOpen]="mobileDrawerOpen"
                  └─> MobileDrawerMenuComponent animates
```

### Breadcrumb Update Flow
```
Navigation Event
  └─> TopHeaderComponent.ngOnInit()
      └─> Router.events.subscribe()
          └─> updateBreadcrumbs()
              └─> Parses URL segments
                  └─> Maps to translations
                      └─> Updates breadcrumbs array
```

## Responsive Breakpoints

### Breakpoint Strategy
- **Mobile First** approach with breakpoint at 768px (md in Tailwind)
- **Desktop**: Full sidebar (12rem width), left menu visible
- **Mobile**: No sidebar margin, mobile drawer menu instead

### Layout Transitions
```
Mobile (< 768px)        Tablet/Desktop (≥ 768px)
├─ No sidebar margin    ├─ 12rem sidebar margin
├─ Mobile drawer        ├─ Collapsible to 4rem
└─ Hidden left-menu     └─ Desktop navigation
```

## Key Implementation Details

### 1. Fixed Positioning
- **LeftMenu**: `position: fixed; left: 0; top: 0; z-50;`
- **TopHeader**: Fixed height for consistent content spacing
- Prevents overlapping and maintains hierarchy

### 2. Smooth Animations
```css
.main-content {
  transition: margin-left 0.2s ease-in-out;
}
```

### 3. Overflow Management
- Prevents horizontal scroll on all screen sizes
- Handles word wrapping for long content
- Maintains box-sizing consistency

### 4. Z-Index Hierarchy
```
z-50  ← Sidebar, Mobile Drawer (highest)
z-40  ← TopHeader
z-0   ← Main Content (default)
```

## Integration with Angular Features

### Standalone Components
All layout components are standalone:
- No NgModules required
- Explicit imports of dependencies
- Modern Angular 19 approach

### Dependency Injection
```typescript
private authService = inject(AuthService);
private translateService = inject(TranslateService);
private router = inject(Router);
private breadcrumbService = inject(BreadcrumbService);
```

### Router Integration
- Responds to route changes via `Router.events`
- Updates breadcrumbs dynamically
- Supports nested routing with layout wrapper

### Translation Support
- All labels translated via `TranslateModule`
- Language change detection and breadcrumb update
- Supports multiple languages (en, de, it)

## Common Use Cases

### Adding a New Menu Item
1. Add to `LeftMenuComponent.menuItems` array
2. Define required role(s)
3. Add translation key to language files
4. Update breadcrumb translations if needed

### Modifying Responsive Behavior
1. Adjust breakpoint in `@media (min-width: 768px)`
2. Modify sidebar widths (12rem, 4rem)
3. Update TailwindCSS utility classes (`md:`, `sm:`)

### Changing Sidebar Width
1. Update CSS margin values in `.main-content`
2. Update LeftMenuComponent width
3. Ensure consistent spacing

## Best Practices

1. **State Management**: Keep layout state in LayoutComponent, not in children
2. **Mobile-First**: Always consider mobile design when modifying layout
3. **Accessibility**: Ensure sidebar toggle is keyboard accessible
4. **Performance**: Use OnPush change detection when possible
5. **Responsive**: Test layout changes on multiple screen sizes
6. **Overflow**: Always test long content names and labels
7. **Translations**: Add breadcrumb translations for new routes

## Potential Improvements

1. **Layout Service**: Extract layout state management to a service
2. **Memory Optimization**: Implement virtual scrolling for large menus
3. **Animation Library**: Use Angular animations instead of CSS transitions
4. **Accessibility**: Add ARIA attributes for screen readers
5. **Mobile Touch**: Add swipe gestures for drawer menu
6. **Customizable**: Allow theme/sidebar width configuration

## Files Reference

- **Main Layout**: `src/app/layout/layout.component.ts|html|css`
- **Left Menu**: `src/app/layout/left-menu/left-menu.component.ts|html|css`
- **Top Header**: `src/app/layout/top-header/top-header.component.ts|html|css`
- **Mobile Drawer**: `src/app/layout/mobile-drawer-menu/`
- **Services**: `src/app/core/services/` (AuthService, BreadcrumbService, etc.)
