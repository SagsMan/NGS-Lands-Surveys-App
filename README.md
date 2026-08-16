# NGS Land Surveys — Mobile App

> **Niger State Ministry of Lands & Survey** · Official citizen & staff land-services portal

Built with **Expo (React Native)** · Expo Router · TypeScript · pnpm monorepo

---

## Screenshots

### Onboarding Flow

| Splash | Account Type | Citizen Sign In | Staff Sign In |
|:---:|:---:|:---:|:---:|
| ![Splash](assets/screenshots/01-splash.jpg) | ![Account Type](assets/screenshots/03-account-type.jpg) | ![Sign In – Citizen](assets/screenshots/04-sign-in.jpg) | ![Sign In – Staff](assets/screenshots/05-sign-in-staff.jpg) |

---

## Features

### 🧑‍💼 Citizen Portal
| Feature | Description |
|---|---|
| **Home Dashboard** | Overview of active applications, quick-pay shortcuts, and ministry announcements |
| **Services** | Searchable grid of land services (C-of-O, survey plan, deed of assignment, etc.) |
| **Applications** | Full application tracker; tap any entry to expand details; "Awaiting Payment" launches Remita modal |
| **Inbox** | Ministry-to-citizen messages with read/unread states |
| **Profile** | 7-section settings (Personal Info, Change Password, Notifications, Privacy & Security, Help & Support, Terms, About) with photo picker |
| **Remita Payment** | 4-channel payment modal — Card, Bank Transfer, USSD, Direct Debit — with simulated receipt |
| **ChatBot FAB** | Ministry-logo floating button opens an AI-style Q&A chat with quick replies |

### 🏛️ Staff Portal
| Feature | Description |
|---|---|
| **Work Summary** | Daily KPIs — tasks due, inspections pending, applications awaiting review |
| **Tasks** | Searchable task list with priority badges and due-date tags |
| **Inspections** | Scheduled site inspections; tap to open satellite map modal at the parcel location |
| **Applications** | Paginated review queue; tap to expand full review checklist (approve / reject per item), observation notes, file upload, satellite map, and submit |
| **Profile** | 8-section settings (same as citizen + Staff ID & Department) |

### 🔐 Auth Flow
| Screen | Details |
|---|---|
| **Splash** | Animated landscape background with ministry seal; auto-advances after 12 s |
| **Welcome** | "Land Services, Made Simple" tagline with Get Started / Sign In actions |
| **Account Type** | Radio card picker — Citizen or Staff |
| **Sign In** | Email/password with eye-toggle; **biometric login (Touch ID / Face ID)** via `expo-local-authentication`; auto-detects hardware availability |
| **Register (Citizen)** | Full registration form with name, phone, email, NIN, address, password |
| **OTP Verify** | 6-box one-time code input; 60-second countdown; Email / SMS toggle |

### 🎨 Design System
- **Primary colour** — `#13bf43` (NGS green)
- **Background** — `#f7faf7` (mint white)
- **Custom `FigmaTabBar`** — active tab rendered as a 56 × 56 green rounded square
- **Green pill header label** + **green circle bell button** on every main screen
- **SVG vector avatars** — gender-aware human illustrations (male / female) generated with `react-native-svg`; replaced by user's own photo via `expo-image-picker`
- **Camera FAB overlay** on avatar — Upload from Gallery, Take Photo, Delete Photo

---

## Project Structure

```
artifacts/ngs-land-surveys-mobile/
├── app/
│   ├── _layout.tsx               # Root Stack; font loading (Inter)
│   ├── index.tsx                 # Splash → Welcome (OnboardingScreen)
│   ├── +not-found.tsx
│   │
│   ├── auth/
│   │   ├── _layout.tsx           # Slide-animation Stack
│   │   ├── account-type.tsx      # Citizen / Staff radio picker
│   │   ├── sign-in.tsx           # Sign in + biometric login
│   │   ├── create-citizen.tsx    # Citizen registration form
│   │   └── verify-otp.tsx        # 6-box OTP; countdown; toggle Email/SMS
│   │
│   ├── citizen/
│   │   ├── _layout.tsx           # FigmaTabBar, 5 tabs
│   │   ├── index.tsx             # Home dashboard
│   │   ├── services.tsx          # Services search & grid
│   │   ├── applications.tsx      # Application tracker + Remita payment
│   │   ├── inbox.tsx             # Ministry messages
│   │   └── profile.tsx           # Settings (7 sections) + avatar picker
│   │
│   └── staff/
│       ├── _layout.tsx           # FigmaTabBar, 5 tabs
│       ├── index.tsx             # Work summary dashboard
│       ├── tasks.tsx             # Task list
│       ├── inspections.tsx       # Inspections + satellite map modal
│       ├── applications.tsx      # Application review checklist
│       └── profile.tsx           # Settings (8 sections) + avatar picker
│
├── components/
│   ├── AvatarPicker.tsx          # SVG human avatar + camera action sheet
│   ├── ChatBotFAB.tsx            # Ministry-logo FAB → chat modal
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── FigmaTabBar.tsx           # Custom bottom tab bar
│   ├── KeyboardAwareScrollViewCompat.tsx
│   ├── MapModal.tsx              # Native satellite map (react-native-maps)
│   ├── MapModal.web.tsx          # Web stub (maps not supported on web)
│   └── RemitaPaymentModal.tsx    # 4-channel Remita payment flow
│
├── constants/
│   └── colors.ts                 # Design tokens (primary, background, card …)
│
├── hooks/
│   └── useColors.ts              # Reads colors.ts light/dark tokens
│
├── assets/
│   ├── fonts/                    # Inter (400 / 500 / 600 / 700)
│   ├── images/brand/
│   │   ├── landscape.jpg         # Hero background photo
│   │   ├── ministry-logo.png     # Full ministry logo
│   │   ├── ministry-logo-clear.png  # Logo with black bg removed
│   │   ├── ministry-seal.png     # Circular ministry seal
│   │   ├── remita-logo.png       # Official Remita logo (256 × 256 RGBA)
│   │   ├── splash-logo.png
│   │   ├── get-started.png
│   │   └── sign-in.png
│   └── screenshots/
│       ├── 01-splash.jpg
│       ├── 03-account-type.jpg
│       ├── 04-sign-in.jpg
│       └── 05-sign-in-staff.jpg
│
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo` ~53 | Core Expo SDK |
| `expo-router` | File-based routing (Stack + Tabs) |
| `expo-local-authentication` | Touch ID / Face ID biometric login |
| `expo-image-picker` | Camera & gallery for profile photo |
| `expo-haptics` | Tactile feedback on interactions |
| `expo-linear-gradient` | Background gradient washes |
| `react-native-maps` | Satellite map in inspections & app review |
| `react-native-svg` | SVG human avatar illustrations |
| `@expo/vector-icons` (Ionicons) | All UI icons |
| `expo-font` | Inter font family loading |
| `react-native-safe-area-context` | Edge-to-edge safe area handling |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 9
- Expo Go app on your phone (for quick preview)

### Install & Run

```bash
# From monorepo root
pnpm install

# Start the Expo dev server
pnpm --filter @workspace/ngs-land-surveys-mobile run dev
```

Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).

### Web Preview (limited)

```bash
# Web build works but react-native-maps screens show a stub
pnpm --filter @workspace/ngs-land-surveys-mobile run dev
# Press 'w' in the terminal to open web
```

### Type Check

```bash
pnpm --filter @workspace/ngs-land-surveys-mobile run typecheck
```

---

## Test Accounts

| Role | Identifier | Password |
|---|---|---|
| Citizen | sagiru@gmail.com | any value |
| Staff | zaguru@mls.gov.ng or MLS-STAFF-00124 | any value |

> Auth is simulated — any non-empty credentials navigate to the respective portal.

---

## Pending / Roadmap

| Item | Status |
|---|---|
| REMITA API integration (live keys) | 🔲 Deferred |
| Google Maps API key (iOS production) | 🔲 Deferred |
| Real backend / API server wiring | 🔲 Deferred |
| Push notifications | 🔲 Planned |
| Dark mode | 🔲 Planned |

---

## Repository

**GitHub:** https://github.com/SagsMan/NGS-Lands-Surveys-App

**Organisation:** Niger State Ministry of Lands & Survey, Minna, Niger State, Nigeria
