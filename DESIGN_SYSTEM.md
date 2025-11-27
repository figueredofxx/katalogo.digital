# Katalogo Design System

## 1. Core Principles
*   **Mobile-First:** All interactions are designed for touch targets (min 40px) and small screens.
*   **App-Like Feel:** Components use tighter spacing, rounded corners (12px), and smooth transitions to feel like a native app.
*   **Minimalist:** White space is active space. High contrast text. No gradients.
*   **Feedback-Driven:** Every action (click, save, error) has visual feedback (Toast, Loader, Ripple).

## 2. Typography
*   **Font Family:** Inter (`sans-serif`).
*   **Scale:**
    *   Heading 1: `text-2xl` (24px) | Weight: 700 | Tracking: `tight`
    *   Heading 2: `text-lg` (18px) | Weight: 700
    *   Body: `text-sm` (14px) | Weight: 400/500
    *   Caption: `text-xs` (12px) | Weight: 500 | Color: `gray-500`

## 3. Colors
*   **Primary:** Dynamic CSS Variable `var(--primary-color)` (Default: `#2563eb`).
*   **Surface:** White (`#ffffff`) and Gray-50 (`#f9fafb`).
*   **Text:**
    *   Primary: Gray-900 (`#111827`)
    *   Secondary: Gray-500 (`#6b7280`)
*   **Status:**
    *   Success: Green-600 (`#16a34a`) / Green-50
    *   Error: Red-600 (`#dc2626`) / Red-50
    *   Warning: Orange-600 (`#ea580c`) / Orange-50

## 4. Components

### Buttons
*   **Height:** `h-10` (40px) - Compact "App" style.
*   **Radius:** `rounded-xl`.
*   **Variants:**
    *   `Primary`: Brand Color, White Text, Subtle Shadow.
    *   `Secondary`: Gray-100, Gray-900 Text.
    *   `Outline`: Border Gray-200.

### Inputs
*   **Height:** `h-10` (40px).
*   **Border:** Gray-200.
*   **Focus:** Ring-1 Ring-Gray-900.
*   **Radius:** `rounded-xl`.

### Cards
*   **Background:** White.
*   **Border:** Gray-100 or Gray-200.
*   **Shadow:** `shadow-sm`.
*   **Radius:** `rounded-2xl`.

## 5. Navigation
*   **Desktop:** Fixed Sidebar `w-64`.
*   **Mobile:** Bottom Navigation Bar (Fixed height, Icon + Label).

## 6. Animation
*   `animate-fade-in`: Opacity 0 -> 1 (300ms).
*   `animate-slide-up`: TranslateY 100% -> 0 (300ms).
