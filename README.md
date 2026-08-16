# NGS Land Surveys — Mobile App

> **Niger State Ministry of Lands & Survey** · Official citizen & staff land-services portal for Minna, Niger State, Nigeria.

Built with **Expo (React Native)** · Expo Router file-based routing · TypeScript · pnpm

---

## App Screens

### Onboarding

| Splash Screen | Account Type |
|:---:|:---:|
| ![Splash](assets/screenshots/01-splash.jpg) | ![Account Type](assets/screenshots/03-account-type.jpg) |
| Ministry seal on landscape background, auto-advances after 12 s | Choose Citizen or Staff before proceeding |

---

### Auth Flow

| Create Account | Verify OTP | Sign In (Citizen) | Sign In (Staff) |
|:---:|:---:|:---:|:---:|
| ![Create Account](assets/screenshots/06-create-account.jpg) | ![Verify OTP](assets/screenshots/07-verify-otp.jpg) | ![Citizen Sign In](assets/screenshots/04-sign-in.jpg) | ![Staff Sign In](assets/screenshots/05-sign-in-staff.jpg) |
| First Name, Last Name, Email, Phone, Password | 6-box OTP · Email / SMS toggle · 60 s countdown · Resend | Email + Password · **Auto biometric prompt** on mount | Staff ID + Password · same biometric flow |

---

## Features

### 🧑‍💼 Citizen Portal
| Screen | Highlights |
|---|---|
| **Home** | Application summary cards, quick-pay shortcuts, ministry announcements, ChatBot FAB |
| **Services** | Searchable grid — C-of-O, Survey Plan, Deed of Assignment, Excision, Regularisation, etc. |
| **Applications** | Full tracker; tap to expand; Awaiting Payment status launches Remita payment modal |
| **Inbox** | Ministry-to-citizen messages with read/unread states |
| **Profile** | 7 sections — Personal Info · Change Password · Notifications · Privacy & Security · Help & Support · Terms · About |

### 🏛️ Staff Portal
| Screen | Highlights |
|---|---|
| **Work Summary** | Daily KPIs — tasks due, inspections pending, applications awaiting review |
| **Tasks** | Searchable task list with priority badges and due-date tags |
| **Inspections** | Scheduled site visits; tap any entry to open a hybrid satellite map at the parcel location |
| **Applications** | Review queue → approve / reject per checklist item, add observation notes, attach files, view map, submit |
| **Profile** | 8 sections — same as citizen + Staff ID & Department |

### 🔐 Auth Flow

#### Create Account (Citizen)
- First Name, Last Name, Email Address, Phone Number
- Password + Confirm Password (eye-toggle on both)
- Terms of Service checkbox
- On submit → OTP verification

#### OTP Verification
- 6-box one-time pin input with auto-advance between boxes
- Email / SMS channel toggle (green pill selector)
- 60-second countdown timer; **Resend Pin** link when expired
- **Verify** button activates only when all 6 digits entered

#### Sign In — Citizen & Staff
- Email (or Staff ID) + Password with eye-toggle
- **Forgot Password** link
- **Biometric login (NIMC-style green fingerprint button)**
  - Auto-prompts Touch ID / Face ID on screen mount (700 ms delay)
  - Pulsing concentric green rings; white fingerprint / Face ID icon
  - Detects hardware type automatically — `finger-print` vs `scan` icon
  - Falls back gracefully when biometric not enrolled
  - Manual tap re-triggers the prompt at any time

### 💳 Remita Payment Modal
4-channel payment flow — **Card**, **Bank Transfer**, **USSD**, **Direct Debit** — with real Remita logo, simulated processing animation, and a printable receipt view.

### 🤖 ChatBot FAB
Ministry-logo floating action button (bottom-right on all citizen screens). Opens a chat modal with:
- 5 quick-reply shortcuts
- Bot Q&A with typing indicator
- Ministry seal used as the bot avatar

### 🎨 Design System
| Token | Value |
|---|---|
| Primary | `#13bf43` NGS green |
| Background | `#f7faf7` mint white |
| Card | `#ffffff` |
| Text | `#0a0a0a` |
| Muted | `#66726b` |

- **`FigmaTabBar`** — custom tab bar; active tab = 56 × 56 green rounded square
- **Green pill header** + **green circle bell** on every main screen
- **SVG vector avatars** — gender-aware human illustrations (`react-native-svg`); replaced by camera photo via `expo-image-picker`
- **Camera FAB overlay** on avatar — Upload from Gallery · Take Photo · Delete Photo

---

## Project Structure

```
├── app/
│   ├── _layout.tsx               # Root Stack; Inter font loading
│   ├── index.tsx                 # Splash (12 s) → Welcome onboarding
│   ├── +not-found.tsx
│   │
│   ├── auth/
│   │   ├── _layout.tsx           # Slide-animation Stack
│   │   ├── account-type.tsx      # Citizen / Staff radio picker
│   │   ├── sign-in.tsx           # Sign in + auto biometric prompt
│   │   ├── create-citizen.tsx    # Citizen registration form
│   │   └── verify-otp.tsx        # 6-box OTP; countdown; Email/SMS toggle
│   │
│   ├── citizen/
│   │   ├── _layout.tsx           # FigmaTabBar — 5 tabs
│   │   ├── index.tsx             # Home dashboard
│   │   ├── services.tsx          # Services search & grid
│   │   ├── applications.tsx      # Application tracker + Remita modal
│   │   ├── inbox.tsx             # Ministry messages
│   │   └── profile.tsx           # Settings (7 sections) + avatar picker
│   │
│   └── staff/
│       ├── _layout.tsx           # FigmaTabBar — 5 tabs
│       ├── index.tsx             # Work summary dashboard
│       ├── tasks.tsx             # Searchable task list
│       ├── inspections.tsx       # Inspections + satellite map
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
│   ├── MapModal.web.tsx          # Web stub — maps not supported on web
│   └── RemitaPaymentModal.tsx    # 4-channel Remita payment flow
│
├── constants/
│   └── colors.ts                 # Design tokens
│
├── hooks/
│   └── useColors.ts              # Light/dark token resolver
│
└── assets/
    ├── fonts/                    # Inter 400 / 500 / 600 / 700
    ├── images/brand/             # Seals, logos, landscape background
    └── screenshots/              # App screen captures
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo` ~53 | Core SDK |
| `expo-router` | File-based navigation |
| `expo-local-authentication` | Touch ID / Face ID biometric login |
| `expo-image-picker` | Profile photo — camera & gallery |
| `expo-haptics` | Tactile feedback |
| `expo-linear-gradient` | Background washes |
| `react-native-maps` | Satellite map for inspections |
| `react-native-svg` | SVG human avatar illustrations |
| `@expo/vector-icons` | Ionicons throughout |
| `expo-font` | Inter font family |
| `react-native-safe-area-context` | Edge-to-edge layout |

---

## Getting Started

```bash
# Install (from project root or this directory)
pnpm install

# Start Expo dev server
pnpm run dev
```

Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).

### Type Check
```bash
pnpm run typecheck
```

---

## Test Credentials

| Role | Identifier | Password |
|---|---|---|
| Citizen | sagiru@gmail.com | any non-empty value |
| Staff | zaguru@mls.gov.ng · MLS-STAFF-00124 | any non-empty value |

> Auth is simulated — credentials are not validated. Biometric success navigates directly to the portal.

---

## Roadmap

| Item | Status |
|---|---|
| REMITA live API keys | 🔲 Deferred |
| Google Maps API key (iOS production) | 🔲 Deferred |
| Real backend / REST API | 🔲 Deferred |
| Push notifications | 🔲 Planned |
| Dark mode | 🔲 Planned |

---

**Organisation:** Niger State Ministry of Lands & Survey · Minna, Niger State, Nigeria
