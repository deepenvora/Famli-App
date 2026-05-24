# Famli — Family Wealth Management App

## What This Project Is

Famli is a fully interactive mobile-app prototype for a family wealth management product targeting Indian users. It runs entirely in the browser as a 390×844 phone frame on a dark stage. The prototype covers 25+ screens across wealth tracking, goals, mutual funds, transactions, credit, AI assistant, family groups, documents, and legacy planning (will creation). All data is mocked inline — there is no backend, no API calls, and no build step. Opening `index.html` directly in a browser (or via a local HTTP server) is all that is needed to run it.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| UI library | React 18.3.1 (UMD) | Loaded from unpkg CDN, available as global `React` and `ReactDOM` |
| JSX transpilation | Babel Standalone 7.29.0 | Scripts tagged `type="text/babel"` are transpiled in-browser at runtime |
| Styling | Tailwind CSS (CDN) + hand-written CSS custom properties | Tailwind for utility classes; design tokens live in `:root` in `index.html` |
| Icons | Lucide (latest UMD build) | Accessed via `window.lucide`; rendered by the `Icon` component |
| Font | Inter (Google Fonts) | Weights 400, 500, 600, 700, 800 |
| State | React `useState` + `useContext` | Single `AppCtx` context holds all global state |
| Routing | Custom history-stack inside `App` | No external router; `go/back/replace` methods on `useApp()` |

### File Structure

```
index.html               ← entry point; design tokens; CDN imports; script tags
src/
  shared.jsx             ← MOCK data, AppCtx/useApp, all shared components
  screens-wealth.jsx     ← Dashboard, Wealth (Assets/Liab), MF List, MF Detail
  screens-goals.jsx      ← Goals list, Goal Detail, Add Goal, Create Goal, Goal Success
  screens-misc.jsx       ← Transactions, Credit, AI Assistant, Profile, Settings,
                           Help & Support, ProfileSwitchSheet, ConfirmModal
  screens-extras.jsx     ← Family Groups (list/detail/create), Member Detail,
                           Notifications, Advisory, Documents, Document Detail
  screens-will.jsx       ← Will Intro, Will Creation (5-step wizard), Will Summary,
                           Will Success
  app.jsx                ← App component; router switch; ComingSoon; SideNote index
```

**Script loading order in `index.html` is strict:**
`shared.jsx` → `screens-wealth.jsx` → `screens-goals.jsx` → `screens-misc.jsx` → `screens-extras.jsx` → `screens-will.jsx` → `app.jsx`

Every file except `app.jsx` calls `Object.assign(window, {...})` at its bottom to expose its components globally. `app.jsx` mounts `ReactDOM.createRoot` and **must be last**.

---

## Design System

### CSS Custom Properties (`:root` in `index.html`)

These are the only source of truth for colour. Never hardcode a value that matches one of these.

| Token | Hex | Usage |
|---|---|---|
| `--brand` | `#5B2EE0` | Primary purple — buttons, active states, links, FAB, brand text |
| `--brand-deep` | `#4922B8` | Darker brand — hover states, shimmer gradient stop |
| `--brand-soft` | `#EDE8FB` | Light purple tint — chip backgrounds, icon circle backgrounds |
| `--brand-soft-2` | `#F6F3FE` | Even lighter tint — active card backgrounds, info banners |
| `--bg` | `#F4F5F7` | Page/screen background (inside the phone frame) |
| `--card` | `#FFFFFF` | Card surface colour |
| `--ink` | `#111111` | Primary text |
| `--ink-2` | `#6B7280` | Secondary text / labels |
| `--ink-3` | `#9CA3AF` | Tertiary text / placeholders / disabled |
| `--pos` | `#16A34A` | Positive / gain / success green |
| `--neg` | `#DC2626` | Negative / loss / danger red |
| `--warn` | `#D97706` | Warning / attention amber |
| `--border` | `#E5E7EB` | Dividers, input borders, card separators |

### Hard-coded colours used in context (not tokenised)

| Value | Where used |
|---|---|
| `#0f0d18` | Page stage background (outside the phone) |
| `#1c1830`, `#2a2541` | Phone frame bezel rings |
| `#5125CD` | Header gradient end (`linear-gradient(180deg, #5B2EE0 0%, #5125CD 100%)`) |
| `#FF4A6B` | Bell notification dot |
| `#FFD166` | Advisory sparkle dot |
| `rgba(40,42,60,0.55)` | Sheet / modal backdrop |
| `rgba(17,17,17,0.92)` | Toast background |
| `#6B36FF`, `#2D1280` | FAB shimmer gradient stops |

### Tag / chip colour palette (`Tag` component kinds)

| Kind | Background | Foreground |
|---|---|---|
| `neutral` | `var(--brand-soft)` | `var(--brand)` |
| `important` | `#FFE7C2` | `#9A5A00` |
| `essential` | `#E6F0FF` | `#1F4FBA` |
| `aspirational` | `#FFE4F0` | `#A6266A` |
| `success` | `#DCFCE7` | `#15803D` |
| `warn` | `#FEF3C7` | `#92400E` |
| `danger` | `#FEE2E2` | `#B91C1C` |

### Typography

- **Font family:** `'Inter', system-ui, sans-serif` (set on `html, body`)
- **Weights in use:** 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- **Common sizes in the app (px):**
  - 10 — overlines, tiny labels, footnotes
  - 11 — metadata, dates, secondary sub-labels
  - 12 — secondary body, input labels, chip text
  - 13 — body text, list sub-items
  - 14 — list primary labels, inputs, button text
  - 15 — section headings, list titles
  - 16 — card headings
  - 17 — page/screen title (inside header)
  - 18–22 — key values, metric numbers
  - 24–28 — large values (credit score, corpus, MF values)
  - 48 — CIBIL score display

### Spacing

No spacing scale is enforced programmatically. In practice:
- Screen horizontal padding: `px-4` (16px)
- Stack spacing between cards/sections: `mt-3` (12px) or `mt-4` (16px)
- Within a card: `p-4` (16px) or `p-3` (12px)
- Between list items: `py-2.5` (10px) or `py-3` (12px)
- Gap inside rows: `gap-3` (12px)

### Border Radius

| Element | Radius |
|---|---|
| Card (`.card`) | `16px` |
| Phone frame | `44px` |
| Bottom sheet | `24px` top corners |
| Pill chips | `999px` |
| Input fields | `10px` |
| Form buttons | `10–12px` |
| Icon circles | `50%` (round) |
| LogoTile | `8px` outer, `6px` inner |
| Small rounded elements | `8px` |

### Shadows

| Class / element | Shadow value |
|---|---|
| `.card` | `0 1px 4px rgba(17,17,17,0.06)` |
| `.phone` | `0 40px 80px -20px rgba(91,46,224,0.35), 0 0 0 10px #1c1830, 0 0 0 12px #2a2541` |
| `.fab-glow` | `0 10px 28px -6px rgba(91,46,224,0.6), inset 0 0 16px rgba(255,255,255,0.18)` |

### Animations (CSS keyframes)

| Class | Effect | Duration |
|---|---|---|
| `.fade-in` | `opacity 0→1`, `translateY(4px)→0` | 280ms ease |
| `.sheet-in` | `translateY(100%)→0` | 320ms cubic-bezier(0.2,0.8,0.2,1) |
| `.backdrop-in` | `opacity 0→1` | 220ms ease |
| `.toast-in` | `opacity 0→1`, `translateY(8px)→0` (centered) | 240ms ease |
| `.typing span` | blink bounce for AI typing dots | 1.2s infinite |

### Utility CSS Classes

| Class | Purpose |
|---|---|
| `.scroll-area` | Hides scrollbars on both Webkit and Firefox |
| `.phone` | Phone frame container: 390×844, radius 44, overflow hidden |
| `.stage-bg` | Fixed dark radial gradient behind the phone |
| `.label-overline` | Uppercase tracking label (10px, 600 weight, 0.06em spacing) |
| `.ink` / `.ink-2` / `.ink-3` | Shorthand text colour helpers |
| `.card` | White card with 16px radius and shadow |
| `.chip` | Pill shape: radius 999, 4px 10px padding, 11px font |
| `.divider` | 1px top border in `--border` |
| `.fab-glow` | FAB glow box-shadow |
| `.header-grad` | Purple vertical gradient background |
| `.shimmer` | Radial shimmer gradient (used on FAB) |
| `.ring-brand` | Inset 2px brand ring shadow |
| `.pill-tab` | 200ms ease transition for tab buttons |
| `.stripes` | Diagonal 135° stripe pattern in brand tint |

### Phone Frame Dimensions

- Width: `390px`
- Height: `844px`
- All screens use `position: absolute; inset: 0` inside the phone container

---

## Global State & Context (`AppCtx`)

Defined in `shared.jsx`, consumed everywhere via `const app = useApp()`.

### State values

| Field | Type | Default | Purpose |
|---|---|---|---|
| `screen` | string | `"dashboard"` | Current screen key |
| `params` | object | `{}` | Params passed to current screen (e.g. `{ goalId: "ret" }`) |
| `masked` | boolean | `false` | When `true`, `<Masked>` renders `••••••` instead of values |
| `profile` | string | `"Myself"` | Active profile context — `"Myself"` or `"Mehta Family"` |

### Methods

| Method | Signature | Effect |
|---|---|---|
| `go` | `(screen, params = {})` | Pushes new entry onto history stack |
| `back` | `()` | Pops top entry from history stack (no-op if only one entry) |
| `replace` | `(screen, params = {})` | Replaces top history entry (no new back entry) |
| `setMasked` | `(fn)` | Toggles masked state |
| `setProfile` | `(string)` | Switches profile context |
| `openSheet` | `(name)` | Sets global sheet name (only `"profileSwitch"` used globally) |
| `closeSheet` | `()` | Clears sheet |
| `toast` | `(msg)` | Shows toast for 1900ms then auto-dismisses |
| `confirm` | `(message, onYes)` | Opens `ConfirmModal` with message and callback |

---

## Routing

The router is a simple history stack inside `App` (`src/app.jsx`).

### How it works

1. `history` is an array of `{ screen, params }` objects, starting with `[{ screen: "dashboard", params: {} }]`.
2. `current = history[history.length - 1]` is the active entry.
3. `renderScreen()` is a `switch` on `current.screen` that returns the matching component.
4. The entire phone re-renders on screen change via `key={current.screen}` on the phone `div` (triggers `.fade-in` animation automatically).
5. The `ProfileSwitchSheet` is rendered globally inside the phone regardless of screen. It auto-closes on screen change via a `useEffect`.

### Screen Registry (complete list in `app.jsx`)

| Screen key | Component | File |
|---|---|---|
| `dashboard` | `<Dashboard />` | screens-wealth.jsx |
| `wealth` | `<Wealth tab="assets" />` | screens-wealth.jsx |
| `wealth-liab` | `<Wealth tab="liab" />` | screens-wealth.jsx |
| `goals` | `<Goals profile={profile} />` | screens-goals.jsx |
| `goal-detail` | `<GoalDetail />` | screens-goals.jsx |
| `add-goal` | `<AddGoal />` | screens-goals.jsx |
| `create-goal` | `<CreateGoal />` | screens-goals.jsx |
| `goal-success` | `<GoalSuccess />` | screens-goals.jsx |
| `transactions` | `<Transactions />` | screens-misc.jsx |
| `credit` | `<Credit />` | screens-misc.jsx |
| `ai` | `<AIAssistant />` | screens-misc.jsx |
| `profile` | `<Profile />` | screens-misc.jsx |
| `settings` | `<Settings />` | screens-misc.jsx |
| `help` | `<HelpSupport />` | screens-misc.jsx |
| `mf-list` | `<MFList profile="Myself" />` | screens-wealth.jsx |
| `mf-list-family` | `<MFList profile="Family" />` | screens-wealth.jsx |
| `mf-detail` | `<MFDetail />` | screens-wealth.jsx |
| `family-groups` | `<FamilyGroupList />` | screens-extras.jsx |
| `family-group-detail` | `<FamilyGroupDetail />` | screens-extras.jsx |
| `family-group-create` | `<FamilyGroupCreate />` | screens-extras.jsx |
| `member-detail` | `<MemberDetail />` | screens-extras.jsx |
| `notifications` | `<Notifications />` | screens-extras.jsx |
| `advisory` | `<Advisory />` | screens-extras.jsx |
| `documents` | `<Documents />` | screens-extras.jsx |
| `document-detail` | `<DocumentDetail />` | screens-extras.jsx |
| `will-intro` | `<WillIntro />` | screens-will.jsx |
| `will-create` | `<WillCreation />` | screens-will.jsx |
| `will-summary` | `<WillSummary />` | screens-will.jsx |
| `will-success` | `<WillSuccess />` | screens-will.jsx |
| `investments` | `<MFList profile="Myself" />` | (alias) |
| `insurance` | `<ComingSoon title="Insurance" />` | app.jsx |
| `family` | `<FamilyGroupList />` | (alias) |

### Navigation examples

```jsx
// Navigate forward (creates a back entry)
app.go("goal-detail", { goalId: "ret" });

// Navigate forward without a back entry (replace current)
app.replace("create-goal", { type: selected });

// Go back
app.back();

// Navigate to a top-level tab (always safe — adds to history)
app.go("dashboard");
app.go("wealth");
app.go("credit");
```

### How to read params in a screen

```jsx
const MyScreen = () => {
  const app = useApp();
  const id = app.params.goalId || "default";
  // ...
};
```

---

## Reusable Components

All components in `shared.jsx` are on `window` and available in every other file without imports.

### `Icon`
Renders a Lucide icon by name into a `<span>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | string | required | Lucide icon name in kebab-case (e.g. `"arrow-left"`, `"credit-card"`) |
| `size` | number | `20` | Width and height in px |
| `color` | string | — | SVG stroke colour |
| `stroke` | number | `2` | Stroke width |
| `className` | string | `""` | Extra CSS classes on the wrapper span |
| `style` | object | `{}` | Inline styles on the wrapper span |

```jsx
<Icon name="home" size={20} color="#5B2EE0" stroke={2.2} />
```

### `StatusBar`
Mock Android status bar with time, Bluetooth, Wi-Fi, 5G, signal, battery.

| Prop | Type | Default | Description |
|---|---|---|---|
| `dark` | boolean | `false` | `false` = white text (for purple headers), `true` = dark text (for white headers) |

### `PurpleHeader`
The main purple gradient header used on top-level screens (Dashboard, Wealth, Goals, Transactions, Credit).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | required | Screen label shown above the profile name (e.g. `"Dashboard"`) |
| `profile` | string | `"Myself"` | Profile name shown as the clickable switcher |
| `showProfile` | boolean | `true` | Shows the profile avatar button (navigates to `"profile"`) |
| `showEye` | boolean | `true` | Shows the eye toggle for masking values |
| `showShare` | boolean | `false` | Shows a share button |
| `showAdd` | boolean | `false` | Shows a plus/add button |
| `showBell` | boolean | `false` | Shows the bell button (navigates to `"notifications"`) with red dot |
| `showAdvisory` | boolean | `false` | Shows the sparkles button (navigates to `"advisory"`) with amber dot |

The profile name area always opens `profileSwitch` sheet on tap regardless of props.

### `IconBtn`
Circular glass button used inside headers. 36×36px, white 10% background, white 16% border.

| Prop | Type | Description |
|---|---|---|
| `onClick` | function | Click handler |
| `children` | ReactNode | Icon(s) to render |
| `...rest` | — | All other props forwarded to `<button>` |

### `SubHeader`
Purple gradient header for secondary/detail screens — shows a back arrow and title.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | required | Screen title text |
| `sub` | string | — | Optional smaller text above the title |
| `onBack` | function | `app.back()` | Custom back handler. Defaults to `app.back()` |
| `right` | ReactNode | `null` | Optional element(s) rendered on the right side |

```jsx
<SubHeader
  title="Goal Details"
  right={<IconBtn onClick={() => app.toast("More")}><Icon name="more-horizontal" size={20} color="#fff" /></IconBtn>}
/>
```

### `BottomNav`
Five-tab bottom navigation bar. 70px tall, absolute-positioned at bottom of phone.

| Prop | Type | Description |
|---|---|---|
| `active` | string | Key of the currently active tab. Must match a `NAV_ITEMS` key: `"dashboard"`, `"wealth"`, `"goals"`, `"transactions"`, `"credit"` |

Tapping any tab calls `app.go(key)`. The active tab has a brand-coloured indicator bar at the top.

### `FAB`
The floating action button (sparkle AI icon). Positioned `right: 18px`, above the bottom nav.

| Prop | Type | Default | Description |
|---|---|---|---|
| `bottom` | number | `86` | `bottom` position in px (adjust if no bottom nav present) |

Always navigates to `"ai"`. Uses `.shimmer` + `.fab-glow` classes.

### `Sparkline`
Inline SVG line chart with filled area gradient.

| Prop | Type | Default | Description |
|---|---|---|---|
| `width` | number | `110` | SVG width in px |
| `height` | number | `40` | SVG height in px |
| `color` | string | `"#5B2EE0"` | Stroke and fill gradient colour |
| `points` | number[] | null | Data array. Defaults to a built-in rising series |
| `fillOpacity` | number | `0.18` | Opacity at the top of the area fill gradient |

### `Masked`
Wraps any value and replaces it with `••••••` when `app.masked` is true.

| Prop | Type | Description |
|---|---|---|
| `children` | ReactNode | The value to potentially hide |
| `style` | object | Inline styles applied to the wrapper `<span>` |

```jsx
<Masked style={{ fontSize: 22, fontWeight: 700 }}>₹46 L</Masked>
```

### `Tag`
Coloured pill chip for labels like "Essential", "Important", "Aspirational", etc.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | string | required | Label text |
| `kind` | string | `"neutral"` | One of: `neutral`, `important`, `essential`, `aspirational`, `success`, `warn`, `danger` |

Uses the `.chip` CSS class for shape. See Tag colour palette above.

### `tagKind(label)`
Helper function (not a component). Converts a goal importance string (`"Essential"`, `"Important"`, `"Aspirational"`) to a `Tag` `kind` prop value. Returns `"neutral"` for anything unrecognised.

### `IconCircle`
A circular coloured backdrop containing a centred icon. Used in list rows for assets, insurance, etc.

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | string | required | Lucide icon name |
| `bg` | string | `"var(--brand-soft)"` | Circle background colour |
| `color` | string | `"var(--brand)"` | Icon stroke colour |
| `size` | number | `40` | Circle diameter; icon is rendered at `size * 0.5` |

### `Toast`
Auto-timed dismissal toast, positioned center-bottom. Managed by `app.toast()` — do not instantiate directly.

| Prop | Type | Description |
|---|---|---|
| `msg` | string | Text to display |

### `Sheet`
Generic bottom sheet wrapper with backdrop.

| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | boolean | required | Whether the sheet is visible |
| `onClose` | function | required | Called when backdrop is tapped |
| `children` | ReactNode | required | Sheet content |
| `height` | string | `"auto"` | CSS height of the sheet panel |

Renders `null` when `open` is false. Uses `.backdrop-in` and `.sheet-in` animations. Max height is 85% of phone. Always renders a drag handle bar.

### `LogoTile`
Square tile displaying a coloured initial, used for bank/fund logos.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | string | required | Brand colour for the inner square |
| `char` | string | required | Character to display (e.g. `"H"`, `"i"`) |
| `size` | number | `36` | Outer tile size in px |
| `rounded` | number | `8` | Border radius in px |

### `Avatar`
Circular avatar with a letter initial on a coloured background.

| Prop | Type | Default | Description |
|---|---|---|---|
| `initial` | string | required | Letter to display |
| `color` | string | `"#5B2EE0"` | Background colour |
| `size` | number | `28` | Diameter in px. Font size is `size * 0.45` |

### `AvatarStack`
Overlapping row of `Avatar` components (used for "who is this for" on goals, family members on a group, etc.).

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ initial, color }[]` | `[]` | Avatar data array |
| `size` | number | `22` | Diameter of each avatar |

Overlap is fixed at `-8px` (second+ avatars get `marginLeft: -8`).

### `Trend`
Arrow + value display for gains/losses.

| Prop | Type | Default | Description |
|---|---|---|---|
| `positive` | boolean | required | `true` = green up arrow, `false` = red down arrow |
| `value` | string | required | Text to show (e.g. `"+12%"`, `"Lagging"`) |
| `neutral` | boolean | `false` | When `true`, renders in `--ink-3` with no arrow |

---

### Components defined in `screens-wealth.jsx`

**`ScoreBar`** — Segmented 5-colour credit score bar (300–900 range) with a needle indicator.
- Props: `score` (number)

**`HygieneRow`** — A single account hygiene row (icon + label + issue count + chevron).
- Props: `icon`, `label`, `total`, `issues`, `onClick`

**`WealthCard`** — Scrollable carousel card showing a wealth metric with sparkline.
- Props: `title`, `value`, `change`, `period`, `positive`, `onClick`

**`TrendBadge`** — Small square badge with an up/down/neutral/warn trend SVG icon.
- Props: `kind` (`"up"` | `"neutral"` | `"warn"` | `"down"` | other), `color`

**`TabBtn`** — Pill tab button used in two-tab switchers (Assets/Liabilities, Credit/Score).
- Props: `active` (boolean), `onClick`, `label` (string or ReactNode)

**`Metric`** — Small label + coloured value pair used in the MF Detail stats grid.
- Props: `label`, `value`, `positive` (boolean)

---

### Components defined in `screens-goals.jsx`

**`ActionBtn`** — Bottom action strip button on goal cards (Delete / Edit / Fund).
- Props: `icon`, `label`, `onClick`

**`Field`** — Form field wrapper with a label above.
- Props: `label` (string), `children`

**`SliderField`** — Slider + numeric display field for age/year inputs.
- Props: `label`, `min`, `max`, `value`, `onChange`

**`ModifyCorpusSheet`** — Bottom sheet for editing the retirement corpus amount inline.
- Props: `open`, `onClose`, `value` (number), `setValue`

**`SuggestedInvestmentSheet`** — Bottom sheet with SIP/lump-sum calculator.
- Props: `open`, `onClose`, `value`, `setValue`, `sip` (boolean), `setSip`

**`Radio`** — Simple radio button with label.
- Props: `active` (boolean), `onClick`, `label`

---

### Components defined in `screens-misc.jsx`

**`AccountPill`** — Scrollable filter pill for bank account selection in Transactions.
- Props: `active`, `onClick`, `bank`, `owner` (`{ initial, color }` | undefined), `color`

**`FilterSheet`** — Month picker bottom sheet.
- Props: `open`, `onClose`, `month` (string), `setMonth`

**`Stat`** — Small stat box with label and value, used in the Transactions flow summary.
- Props: `label`, `value`, `pos` (boolean)

**`FilterChip`** — Horizontal scrollable filter chip (All cards / individual card).
- Props: `active`, `onClick`, `children`

**`CreditScoreTab`** — Full credit score content (score display, report summary, FAQs).
- Props: `isFamily` (boolean), `activeMember` (string), `setActiveMember`

**`SummaryStat`** — Icon + value + label tile used in the credit report summary grid.
- Props: `icon`, `color`, `label`, `value`

**`Tile`** — Simple two-line label/value tile used in the Credit summary strip.
- Props: `label`, `value`, `sub`

**`CreditCardTile`** — Full credit card display (card face + due/unbilled/pay button).
- Props: `c` (card object from `MOCK.creditCards`), `onPay`

**`SuggestionCard`** — AI suggestion category with a list of prompt chips.
- Props: `title`, `icon`, `prompts` (string[]), `onPick` (function receives prompt string)

**`Section`** — Profile/Settings section wrapper with an optional uppercase title.
- Props: `title`, `children`

**`Row`** — Profile/Settings list row (icon + label + chevron or custom right element).
- Props: `icon`, `label`, `onClick`, `right` (ReactNode, defaults to chevron)

**`Badge`** — Small credential/certification badge tile (SEBI, ISO).
- Props: `icon`, `title`, `sub`

**`Switch`** — Animated toggle switch (visual only; state managed by parent).
- Props: `on` (boolean)

**`ProfileSwitchSheet`** — Global bottom sheet for switching between "Myself" and "Mehta Family".
- Props: `open`, `onClose`

**`ConfirmModal`** — Centred overlay confirmation dialog with Cancel/Confirm buttons.
- Props: `open`, `message`, `onYes`, `onNo`

---

### Components defined in `screens-extras.jsx`

**`FamilyGroupAvatar`** — Circular group avatar (photo or coloured initial).
- Props: `group` (object with `color`, `initial`, optionally `photo`), `size` (default 44)

**`SmallTile`** — Small metric tile used in the Family Group "All" tab overview.
- Props: `label`, `value`, `suffix`, `onClick`

**`MembersTab`** — Renders the family members list (used both embedded and as a full tab).
- Props: `embedded` (boolean, default false), `onMember` (function receives member object)

**`StatusChip`** — Invite status pill: Pending / Added / Declined / Expired / Revoked.
- Props: `status` (string)

**`SimpleTabContent`** — Generic tab content renderer for assets or insurance list rows.
- Props: `title`, `rows` (array of objects with `icon`, `label`/`name`, `policy`/`alloc`, optionally `owners`, `sumAssured`/`value`)

**`LiabilityList`** — Renders `MOCK.liabilities` as a card list.
- No props.

**`SectionIntro`** (screens-extras.jsx version) — Icon + title + subtitle header block for wizard steps.
- Props: `icon`, `title`, `sub`

**`Checkbox`** (screens-extras.jsx version) — Circular checkbox (round variant).
- Props: `active` (boolean)

**`PlanCard`** — Advisory plan comparison card (Free vs Paid).
- Props: `active`, `onClick`, `title`, `price`, `suffix`, `features` (string[]), `highlight` (boolean), `badge`

**`DocShell`** — Aspect-ratio document card container (1.586:1 credit-card ratio).
- Props: `children`, `bg` (CSS background string)

Document face components (no props except `doc` or none):
`AadhaarFront`, `AadhaarBack`, `PANFront`, `PANBack`, `DLFront`, `DLBack`, `PassportFront`, `PassportBack`, `VoterFront`, `VoterBack`, `GenericFront` (takes `{ doc }`)

---

### Components defined in `screens-will.jsx`

**`StepBar`** — 5-step progress indicator for the Will Creation wizard.
- Props: `step` (0–4)

**`Field`** (screens-will.jsx version) — Form field wrapper (same pattern as goals version, locally scoped).
- Props: `label`, `children`, `hint` (optional footnote string)

**`TextInput`** — Styled `<input>` with standard border and radius.
- Props: All standard input props plus optional `style` override.

**`TextArea`** — Styled `<textarea>` with resize-none.
- Props: All standard textarea props plus `rows` (default 3).

**`SectionIntro`** (screens-will.jsx version) — Same as extras version, locally scoped.
- Props: `icon`, `title`, `sub`

**`Checkbox`** (screens-will.jsx version) — Square checkbox (6px radius variant, used in assets list).
- Props: `active` (boolean)

**`ReviewSection`** — Will review card section with a title, Edit button, and optional warning chip.
- Props: `title`, `onEdit`, `children`, `warning` (string | null)

**`ReviewRow`** — Key/value row inside a `ReviewSection`.
- Props: `k` (label), `v` (value), `wrap` (boolean — if true, value wraps below label)

**`Badge3`** — Small 3-column icon+text badge (SEBI Reviewed, Encrypted, Time estimate).
- Props: `icon`, `t` (text)

---

## Mock Data Structure (`MOCK` in `shared.jsx`)

All data lives in the `MOCK` constant in `src/shared.jsx`. Never import from anywhere else.

```
MOCK = {
  user:               { name, phone, initial }
  netWorth:           { value, change, period, positive }
  assetsTotal:        { value, change, period, positive }
  liabilitiesTotal:   { value, change, period, positive }
  myselfNet:          { value, change, positive }
  familyNet:          { value, change, positive }

  assetAllocation:    [{ label, pct, value, change, positive, color }]
  assetCategories:    [{ key, icon, label, count, alloc, value, change, positive, navTo? }]
  liabilities:        [{ icon, label, value, emi }]

  goalsDashboard:     [{ id, iconBg, emoji, name, date, value, tag }]       ← 3 items, for Dashboard widget
  goalsFull:          [{ id, iconBg, emoji, name, date, value, tag, status, funded }]  ← 4 items, for Goals screen

  fundInsights:       [{ label, sub, count, trend, color }]
  mutualFunds:        [{ id, logoColor, logoChar, name, type, value, invested }]
  fundDetail:         { name, type, current, invested, totalReturns, oneDay, xirr, performance, transactions[] }

  transactions:       [{ id, party, initials, color, amount, account, date, dir }]
  creditCards:        [{ id, bank, color, last4, due, unbilled, network }]
  creditTxns:         [{ party, initials, color, amount, card, date, src }]

  insurance:          [{ id, icon, label, policy, premium, sumAssured, expiry, owner, ownerColor }]
  insuranceFamily:    [{ id, icon, label, policy, premium, sumAssured, owners[] }]

  spending:           { month, value, change, positive }
  spendingFamily:     { month, value, change, positive, byMember[] }

  hygiene:            { banks: { total, issues }, folios: { total, issues }, demat: { total, issues } }

  creditScore:        { score, change, category, provider, asOf }
  creditScoreFamily:  [{ id, relation, name, score, category, change }]

  bankAccounts:       [{ id, bank, last4, color, balance, type }]

  familyGroups:       [{ id, name, value, members[], extra, color, initial }]
  familyMembersDetail:[{ id, name, role, initial, color, status, phone }]
  familyMembers:      [{ id, name, initial, color, net, funds }]   ← used in MF list family view

  notifications:      [{ id, kind, icon, color, title, body, time, unread, actions? }]
  documents:          [{ id, title, number, icon, color, expiry, updated }]

  goalTypes:          [{ key, emoji, title, desc }]
}
```

There are also two module-level singleton stores on `window` for mutable state that must survive screen remounts:

- `window.__famliFamilyGroups` — array of family group objects. Seeded from `MOCK.familyGroups`, appended by `FamilyGroupCreate`. Managed via `useFamilyGroups()` hook in `screens-extras.jsx`.
- `window.__famliWill` — single will object `{ created, personal, assets, assetsCustom, beneficiaries, guardian, updated }`. Managed via `useWill()` hook in `screens-will.jsx`.

---

## How to Add a New Screen

Follow these steps in order. Do not skip any.

### Step 1 — Write the component

Pick the right file based on theme, or create a new `src/screens-myfeature.jsx`:

- Wealth / investing content → `screens-wealth.jsx`
- Goals / planning content → `screens-goals.jsx`
- Utility / profile / settings content → `screens-misc.jsx`
- Family / documents / advisory content → `screens-extras.jsx`
- Legacy / legal content → `screens-will.jsx`

Every screen component must:

```jsx
const MyScreen = () => {
  const app = useApp();

  return (
    // Phone takes up all space absolutely — always start with this
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Use SubHeader for detail pages, PurpleHeader for top-level pages */}
      <SubHeader title="My Screen" />

      {/* Scrollable content area */}
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        {/* ...content... */}
      </div>

      {/* Include FAB and BottomNav on screens that are "home-like" */}
      <FAB />
      <BottomNav active="dashboard" />
    </div>
  );
};
```

Key rules for the layout:
- The root `div` must be `absolute inset-0` with `flex flex-col` — the phone is `position: relative; overflow: hidden`.
- The scrollable area needs `pb-24` (or at least `pb-4`) so content isn't hidden behind the bottom nav or FAB.
- Use `className="scroll-area flex-1 overflow-y-auto"` on the scroll container.
- Do not put the scroll container inside a nested `div` with a fixed height — let flexbox handle it.
- Always wrap values with `<Masked>` if they are financial amounts.

### Step 2 — Export the component

At the **bottom** of the file (after all component definitions, on the existing `Object.assign` line):

```js
// existing exports — add your component to the list
Object.assign(window, { ExistingA, ExistingB, MyScreen });
```

If you created a new file, add this line at the very bottom:

```js
Object.assign(window, { MyScreen });
```

### Step 3 — Register the route in `app.jsx`

Add a `case` inside the `renderScreen()` switch:

```js
case "my-screen": return <MyScreen />;
```

Use a lowercase kebab-case key.

### Step 4 — Add to the Screen Index

Add an entry to the `SCREENS` array in `app.jsx` (keep it in logical order):

```js
{ key: "my-screen", label: "S26 My Screen" },
```

The label follows the `"S<n> <Name>"` convention.

### Step 5 — If you created a new file, add it to `index.html`

Add a `<script>` tag **before** `src/app.jsx` and after the last existing screen file:

```html
<script type="text/babel" src="src/screens-myfeature.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

The loading order is mandatory: `shared.jsx` first, `app.jsx` last.

### Step 6 — Link to your screen

Navigate to it from an existing screen with `app.go("my-screen")` or `app.go("my-screen", { id: "something" })`.

---

## Bottom Nav on New Screens

- **Top-level tabs** (Dashboard, Wealth, Goals, Transactions, Credit): Include `<BottomNav active="<key>" />` and `<FAB />`.
- **Detail pages** reached by drilling in: Do NOT include `<BottomNav>`. Use `<SubHeader>` for back navigation.
- **Full-screen flows** (create/edit/wizard): Do NOT include `<BottomNav>`. Use a sticky bottom CTA bar instead (`absolute bottom-0 left-0 right-0`).

---

## Header Choice Rules

| Situation | Header to use |
|---|---|
| Top-level tab screen | `<PurpleHeader>` |
| Detail screen with back nav | `<SubHeader>` |
| Form/wizard with white top | Plain `<div style={{ background: "#fff" }}>` with `<StatusBar dark />` and manual back button |
| Screen with custom purple header + tabs | Inline `<div className="header-grad">` pattern (see `FamilyGroupDetail`, `MemberDetail`) |

---

## What Must Never Change

These are invariants. Changing them will silently break multiple screens.

### Design tokens
- Never change the CSS custom property values in `:root` in `index.html`.
- Never hardcode a colour value that should use a token (e.g. don't write `#5B2EE0` where `var(--brand)` should be used).

### CDN script integrity hashes
- The `integrity=` attributes on React and Babel CDN tags are subresource integrity hashes. Changing URLs, versions, or these hashes will break loading.

### Script loading order in `index.html`
- `shared.jsx` must always be first — it defines `window.MOCK`, `window.useApp`, and all shared components.
- `app.jsx` must always be last — it calls `ReactDOM.createRoot` which requires every component to be on `window` first.
- New screen files go between the last existing screen file and `app.jsx`.

### `Object.assign(window, {...})` at the bottom of every source file
- This is the cross-file module system. Every component used by `app.jsx` or by another file must be exposed here.
- Do not remove any existing export from these calls.
- Do not rename an exported component without updating both the `Object.assign` call and the router switch in `app.jsx`.

### `AppCtx` / `useApp` interface
- The context shape (`go`, `back`, `replace`, `masked`, `setMasked`, `profile`, `setProfile`, `toast`, `confirm`, `openSheet`, `closeSheet`, `params`, `screen`) must remain stable. All screens depend on it.
- Do not add required fields to the context without updating the value that `App` provides.

### `NAV_ITEMS` array in `shared.jsx`
- The five bottom nav items (Home, Wealth, Goals, Transactions, Credit) are fixed. Do not add, remove, or reorder them.
- The `active` prop passed to `<BottomNav>` must exactly match a `key` in `NAV_ITEMS`.

### `MOCK` data keys
- Other files access `MOCK.user`, `MOCK.goalsFull`, etc. by key name. Renaming a key without finding every reference will cause runtime errors.
- Do not change the shape (field names) of items in data arrays without updating every screen that iterates them.

### Existing screen keys in `SCREENS` and the router switch
- Screen keys are referenced by `app.go("key")` calls scattered across all files. Renaming a key without a global find-and-replace will break navigation silently (the router falls through to `<Dashboard />`).

### `window.__famliFamilyGroups` and `window.__famliWill` singleton pattern
- These two module-level stores survive screen remounts by living on `window`. Do not convert them to component state or they will reset on every navigation.

### The `.phone` container geometry (390×844)
- All screen layouts are designed for exactly this frame. Do not change the dimensions.
- Screens use `position: absolute; inset: 0` — they rely on the phone being `position: relative; overflow: hidden`.

### Lucide icon names
- Icons are fetched by name from `window.lucide.icons[PascalCase]`. An unrecognised name silently renders a `Circle`. Always verify a Lucide icon name exists before using it.

---

## File Map

| File | Contents |
|---|---|
| `shared.jsx` | MOCK data + all shared components (Tag, Card, Avatar, etc.) |
| `app.jsx` | AppCtx router, useApp hook, screen routing switch |
| `screens-goals.jsx` | Goals, GoalDetail, AddGoal, CreateGoal, GoalSuccess |
| `screens-wealth.jsx` | Wealth, MFList, MFDetail |
| `screens-misc.jsx` | Credit, Transactions, Profile, Settings, Help, AI |
| `screens-extras.jsx` | Notifications, Advisory, Documents, Family screens |
| `index.html` | design tokens (CSS vars), script imports, phone frame |

## Rules

- Always read CLAUDE.md before any task
- Only open the file relevant to the task — never read all files at once
- `screenshots/` folder contains reference images — always read relevant ones before building UI
- Never change `index.html` CSS variables or design tokens
- Never recreate shared components — already defined in `shared.jsx`
