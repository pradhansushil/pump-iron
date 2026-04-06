# Pump & Iron — Gym Management Web App

Pump & Iron is a full-stack gym management web app built with React and Firebase. It supports three user roles — guests, members, and admins — each with their own protected space and tailored experience. Members can book classes, track payments, and manage their membership. Admins get a full dashboard to manage members, employees, payments, and tour requests. The app is deployed on Vercel and reflects real-world patterns like role-based routing, Firestore data modeling, and secondary Firebase app instances for admin workflows.

Live demo: https://pump-iron.vercel.app/

---

## Table of Contents

- [Features](#features)
- [Core System Architecture](#core-system-architecture)
- [Tech Stack](#tech-stack)
- [Developer Workflow & Standards](#developer-workflow--standards)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [What I Learned](#what-i-learned)
- [Problems and Fixes](#problems-and-fixes)
- [What I Might Add](#what-i-might-add)
- [Refactoring Notes](#refactoring-notes)
- [Known Issues](#known-issues)
- [License](#license)

---

## Features

### Customer Side

- Browse gym information, pricing plans, and class schedules
- Book a tour through a modal form
- Sign up for a membership with payment method selection
- Register for personal training
- Join group classes (yoga, pilates, etc.)
- View payment history and track membership status
- Cancel class bookings from the member dashboard

### Admin Side

- Dashboard with monthly revenue overview and recent activity widgets
- View and filter all member accounts
- Create new member accounts without disrupting the admin's own session
- Record and track payments (mark members as active/inactive)
- Manage employees
- Handle tour booking requests
- Upload gallery images (UI-only; see [Known Issues](#known-issues))

---

## Core System Architecture

Pump & Iron is a client-side React application that communicates directly with Firebase using the Firebase SDK — there is no separate backend server.

### Authentication & Roles

Authentication is handled through Firebase Auth using email and password. When signing up, new members provide their full name, email, password, a membership plan, and a payment method. Upon login, the app reads the user's role from Firestore and redirects them to their designated space:

- **Guests** — unauthenticated visitors who can browse the landing page, pricing, and class schedules
- **Members** — redirected to `/dashboard` after login
- **Admins** — redirected to `/admin/dashboard` after login

### Route Protection

React Router is used for all navigation. Routes are protected by role — guests cannot access member or admin pages, members cannot access admin or guest-only pages, and admins are similarly scoped to their own section. Each role can only access its own space.

### Global State

An `AuthContext` wraps the application and makes the logged-in user's identity and role available across all components without prop drilling.

### Data Layer

React communicates with Firestore directly via the Firebase SDK. The database is organized into seven collections:

- `users` — authentication-linked user records
- `members` — member profiles, membership plans, and booking history
- `classes` — available classes that members can book
- `payments` — payment records linked to members
- `employees` — staff records managed by admins
- `tourRequests` — tour booking submissions from guests
- `gallery` — image metadata for the gym gallery

---

## Tech Stack

- **React 19** — component-based UI
- **Vite** — build tool and development server
- **Firebase** — Firestore (database), Firebase Auth (authentication)
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing
- **react-hot-toast** — toast notifications
- **Font Awesome** — icons
- **WAVE Evaluation Tool** — Chrome extension for testing accessibility
- **Google Gemini** — AI-generated images
- **Chrome DevTools** — debugging and layout inspection

---

## Developer Workflow & Standards

### Version Control

Git was used throughout the project with regular commits as features were built. Commits follow the Conventional Commits standard with types `feat`, `fix`, `refactor`, and `chore` to keep history readable and intentional.

### Code Quality

ESLint and Prettier were installed as npm dev dependencies rather than just VS Code extensions, ensuring consistent versions across any environment. Prettier ran on save throughout development. ESLint surfaced real issues during development — unused imports and prematurely declared `useState` constants were common catches that kept the codebase clean as components evolved.

### Project Structure

The project follows a feature- and role-scoped folder structure under `src/`:

- `components/` — UI components organized into subdirectories: `admin/`, `footer/`, `home/`, `members/`, `modals/`, `navbar/`, `payment-forms/`, and `routes/`
- `pages/` — top-level route views, split into `admin/` and `public/` subdirectories
- `context/` — `AuthContext.jsx`, which makes the logged-in user's identity and role available across all components
- `services/` — Firebase service logic separated from component files
- `data/` — static data files
- `utils/` — helper functions such as `dateHelpers.js`

### Environment Variables

Firebase configuration values are stored in a `.env` file and referenced via `import.meta.env.VITE_*` variables. The `.env` file is excluded from version control via `.gitignore`. This was not the initial setup — see [Problem 17](#problem-17-hardcoded-firebase-credentials-exposed-in-public-repository).

### Manual Testing Workflow

Features were tested manually in the browser in three passes: logic first, then UX and interaction, then visual styling. Chrome DevTools was used throughout for debugging JavaScript and inspecting layout and CSS.

---

## Prerequisites

- Node.js v20+
- npm
- A Firebase project with Firestore and Authentication enabled

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/pradhansushil/pump-iron
cd pump-and-iron
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add your Firebase config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

4. **Run the development server**

```bash
npm run dev
```

---

## What I Learned

### ESLint & Prettier Project Setup

Always install ESLint and Prettier as npm dev dependencies in every project, not just as VS Code extensions. This ensures all developers use the same versions and configurations — when team members run `npm install`, they automatically get the correct tools.

After installing, create `.prettierrc.json` manually through VS Code (not the terminal) with `{}` inside to avoid encoding issues. PowerShell's `echo` command creates files with UTF-16 BOM encoding that VS Code cannot read.

---

### File Encoding

Avoid creating config files with PowerShell's `echo` command. Use VS Code's New File dialog or `touch` in Git Bash to ensure proper UTF-8 encoding.

---

### JavaScript Promises and Async/Await

Promises must be awaited to get their resolved value. Without `await`, you get the Promise wrapper object, not the data inside.

```js
// ❌ Wrong
const result = cancelBooking();
if (result.success) { ... } // result is a Promise, not data

// ✅ Correct
const result = await cancelBooking();
if (result.success) { ... }
```

When wrapping an async function in another function, the wrapper must also be `async` and must `await` the inner call. Otherwise, you create an orphaned Promise whose results and errors are silently ignored.

---

### Single Source of Truth

When display and logic use different data sources, they get out of sync. Pick one source (e.g., `member.bookedClasses`) and use it for both reading and writing. If you show bookings from one query but cancel them using a different array, the UI will not reflect the change.

---

### Understanding ID Fields

When working with bookings, two ID fields serve different purposes:

- `id` — uniquely identifies a specific booking instance (needed to cancel the right one if a user books the same class twice)
- `classId` — references which class document to update (e.g., to increment capacity back after a cancellation)

Always match the field you set in the dashboard with the field you search in the service layer.

---

### Data Transformation

When recurring events are stored as day/time strings, you must calculate specific dates for display and filtering. This means transforming the data structure from a "recurring class" shape to a "scheduled booking instance" shape with calculated timestamps.

```js
// Input (class object):
{ day: "Monday", time: "5:00 PM - 6:00 PM" }

// Output (booking object):
{ dateTime: Timestamp(Feb 9, 2026 at 5:00 PM), ... }
```

Use `.map()` to loop through the original data, calculate new values, and return new objects. The original data is not modified.

---

### Working with Firestore Timestamps

Firestore Timestamps and JavaScript Dates are different types. Convert explicitly:

```js
// JavaScript Date → Firestore Timestamp
Timestamp.fromDate(yourDateObject);

// Firestore Timestamp → JavaScript Date
yourTimestamp.toDate();
```

If a component calls `.toDate()` on a field, it expects a Firestore Timestamp — passing a plain JavaScript Date will crash it.

---

### Date Manipulation in JavaScript

Useful built-in methods when working with dates:

- `.setDate()` — changes the day of the month
- `.setHours()` — changes the hour (24-hour format internally)
- `.getDay()` — returns the day of the week as a number (0 = Sunday, 6 = Saturday)

**Converting 12-hour to 24-hour format:**

- PM: add 12 to the hour (except 12 PM stays as 12)
- AM: use the hour as-is (except 12 AM becomes 0)

---

### Efficient Object Mapping

The `dayMap` pattern is clean and fast:

```js
const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};
const dayNumber = dayMap[dayName];
```

No if/else chains or switch statements needed. Object lookups are O(1) and easy to read.

---

### String Parsing with `.split()`

`.split()` is useful for breaking down structured strings:

```js
const time = "5:00 PM - 6:00 PM";
const [startTime] = time.split(" - "); // "5:00 PM"
const [time12, period] = startTime.split(" "); // ["5:00", "PM"]
const [hours, minutes] = time12.split(":"); // ["5", "00"]
```

---

### When to Use the `key` Attribute in `.map()`

`key` is only needed when `.map()` renders JSX — not when transforming data.

```js
// ✅ Needs key — JSX rendering
{
  bookings.map((b) => <div key={b.id}>{b.className}</div>);
}

// ✅ No key needed — data transformation
const bookings = classes.map((c) => ({ id: c.id, className: c.name }));
```

---

### Array Sorting Without Mutating State

`.sort()` mutates the original array. In React, never mutate state directly.

```js
// ❌ Mutates state
payments.sort(...)

// ✅ Sort a copy
[...payments].sort(...)
```

Use the spread operator to create a shallow copy before sorting.

---

### Array `.sort()` with Comparison Functions

`.sort()` takes a comparison function `(a, b)`. Return a negative number to put `a` first, positive to put `b` first, or zero to keep the order.

```js
// Newest first
[...payments].sort((a, b) => b.date.toDate() - a.date.toDate())

// Oldest first
[...payments].sort((a, b) => a.date.toDate() - b.date.toDate())

// Alphabetical
[...items].sort((a, b) => a.name.localeCompare(b.name))
```

Subtraction works for dates and numbers because the result's sign is what `.sort()` uses — not the value.

---

### React Form Labels — `htmlFor` vs Nesting

Two valid ways to connect a label to an input:

**Option 1 — Separate with `htmlFor` (most common):**

```jsx
<label htmlFor="cardNumber">Card Number</label>
<input id="cardNumber" type="text" />
```

**Option 2 — Nested:**

```jsx
<label>
  Card Number
  <input type="text" />
</label>
```

Both cause clicking the label text to focus the input. Nesting is useful for checkboxes, radio buttons, and custom toggle controls. The `htmlFor` approach is standard for vertical form layouts.

---

### React Props — Receiving Props in Child Components

React bundles all passed props into a single object. Three ways to receive them:

```jsx
// Option 1 — Destructure in parameters (most common)
function MyComponent({ name, value }) { ... }

// Option 2 — Use props object
function MyComponent(props) { return <input value={props.value} /> }

// Option 3 — Destructure inside
function MyComponent(props) {
  const { name, value } = props;
}
```

---

### JSX Curly Braces `{}`

In JSX, `{}` means "evaluate this as JavaScript, not as a string."

```jsx
<Component name={userName} />   // Passes the value of the variable
<Component name="userName" />   // Passes the string "userName" literally
<Component age={25} />          // Passes the number 25
<Component isActive={true} />   // Passes the boolean true
```

Use `{}` when rendering JavaScript expressions inside JSX (conditionals, variables, calculations).

---

### Payment Processing — Stripe Integration Pattern (Production)

Real apps never store raw card numbers. The correct pattern:

1. User enters card details in the frontend
2. Card data goes directly to Stripe (never touches your backend)
3. Stripe returns a token (Payment Method ID like `pm_1A2B3C...`)
4. Store only the token, last 4 digits, and card brand in your database
5. To charge the card, tell Stripe to process the stored token

**What to store:**

- Payment method type (`credit card`, `cash`, etc.)
- Stripe Payment Method ID
- Last 4 digits (display only)
- Card brand (display only)

**What never to store:** full card number, CVV, expiry date.

This project saves only `paymentMethodType` to Firestore. A production version would integrate the Stripe SDK.

---

### Conventional Commits

Standard format:

```
type: short description in lowercase
```

Common types: `feat`, `fix`, `refactor`, `chore`, `docs`

Examples:

```
feat: add Create Member button and modal open/close state to AdminMembers
fix: prevent modal from rendering on initial load
refactor: lift fetchAllMembers out of useEffect into component body
chore: update .gitignore to exclude env files
```

No period at the end. Description always lowercase.

---

### Toast Duration

The default toast duration in `react-hot-toast` is 4000ms. To extend it:

```js
toast.success("Your message", { duration: 6000 });
```

Use this for messages the user needs more time to read, such as confirmation that a follow-up action is coming.

---

## Problems and Fixes

### Problem 1: Prettier Auto-Format Not Working in VS Code

After I reinstalled VS Code, Prettier stopped formatting files on save. The extension was still installed, and "Format on Save" was turned on.

**Why it occurred:** PowerShell's `echo` command saved `.prettierrc` using UTF-16 BOM encoding instead of UTF-8, and VS Code couldn't read it.

**Solution:** I added it as a dev dependency using `npm install -D prettier`, then removed the invalid config file, and reconstructed `.prettierrc.json` in VS Code by choosing New File, and entering `{}`.

---

### Problem 2: Cancel Booking Bug (Five Separate Issues)

Clicking "Cancel" on a booking and confirming in the modal had no visible effect — the booking stayed in the UI and no toast appeared.

**2A — Missing `await` in `handleCancelBooking`**

**Why it occurred:** It was given the Promise object itself and not the result of the promise, so `result.success` was always `undefined`.

**Solution:** Added `await` before `cancelBooking()`.

**2B — Arrow function wrapper not `async`**

**Why it occurred:** The `onConfirm` prop called `handleCancelBooking` without awaiting it leading to an orphaned Promise, whose result and errors were not logged.

**Solution:** Wrapped the wrapper function in `async` and added `await`.

**2C — Data source mismatch**

**Why it occurred:** Bookings were displayed from `getBookingsByMember’ but were then cancelled using `member.bookedClasses’ which was already out of sync from being cancelled.

**Solution:** Merged into one to make `member.bookedClasses` the single source of truth for both displaying and cancelling bookings.

**2D — Wrong field in `find` method**

**Why it occurred:** The dashboard passed `booking.id` to the cancel function, but the service was searching using `b.classId`. These fields hold different values and never matched.

**Solution:** Updated `find` and `filter` to use `b.id` consistently.

**2E — Missing `classId` field in Firestore**

**Why it occurred:** Booking objects in `bookedClasses` were missing the `classId` field entirely, so the cancel logic was trying to update a class document using `undefined` as the ID.

**Solution:** Added `classId` to the booking objects in the Firestore test data.

---

### Problem 3: Dashboard Crashing — Missing `dateTime` Field

`MemberDashboard` crashed on load because it expected booking objects to have a `dateTime` Firestore Timestamp, but `getBookingsByMember()` was returning raw class objects that only had `day` and `time` as plain strings.

**Why it occurred:** Classes in Firestore are stored as recurring schedules with day names and time ranges — not specific dates. The dashboard needed concrete timestamps to sort and filter bookings.

**Solution:** I wrote a `calculateNextOccurrence(day, time)` utility in `utils/dateHelpers.js` that maps day names to numbers, parses the time string from 12-hour to 24-hour format, and returns a JavaScript `Date` for the next occurrence of that weekday. I then updated `getBookingsByMember()` to run each class object through `.map()`, call `calculateNextOccurrence()`, and convert the result to a Firestore Timestamp before returning it.

---

### Problem 4: Array Method Mismatch After Data Structure Change

`cancelBooking` was throwing "Booking not found" even though the class was clearly booked in the dashboard.

**Why it occurred:** `bookedClasses` had been refactored from an array of objects to a flat array of ID strings, but the service layer wasn't updated to match. Calling `.id` on a string returns `undefined`, so `.find()` always failed.

**Solution:** I updated the function signature to `cancelBooking(classId, userId)`, replaced `.find()` with `.includes()` to check membership in the string array, and updated the corresponding `.filter()` to remove by string value rather than by object field.

---

### Problem 5: Browser Validation Overriding Custom Error Messages

Submitting the signup form without a selected payment method showed Chrome's built-in validation popup instead of the custom error message.

**Why it occurred:** HTML5's native `required` attribute intercepts form submission before the `onSubmit` handler even runs, so the browser displays its own UI instead of the custom one.

**Solution:** Added `noValidate` to the form element to disable browser-native validation and let the custom handler control all error display.

---

### Problem 6: Firestore Composite Index Required for Payment Queries

Fetching payment history threw `FirebaseError: The query requires an index` and nothing displayed.

**Why it occurred:** Firestore requires a composite index whenever a query combines a `where()` filter on one field with an `orderBy()` on a different field. There was also a field name mismatch — the query filtered on `memberId` but documents stored `userId`.

**Solution:** I corrected the query to filter on `userId`, created the required composite index in the Firebase Console (`userId` ascending, `date` descending), and standardized the payment document schema to use `userId` consistently.

---

### Problem 7: Dropdown Not Showing Correct Default Payment Method

`UpdatePaymentMethodModal` always opened with the dropdown defaulted to the first option instead of the user's actual payment method.

**Why it occurred:** Firestore stored `"cash"` in lowercase, but the dropdown option had `value="Cash"` with a capital C. React's controlled `select` uses strict equality, so the values never matched and the component fell back to the first option.

**Solution:** Updated all option `value` attributes to exactly match the lowercase strings stored in Firestore, while leaving the visible display text capitalized.

---

### Problem 8: Admin Session Lost When Creating a New Member

After an admin created a new member through `CreateMemberModal`, the admin was immediately logged out and redirected to the landing page.

**Why it occurred:** Firebase's `createUserWithEmailAndPassword` automatically signs in the newly created account. Since the app used a single shared `auth` instance, creating a member overwrote the admin's session and the `AuthContext` listener redirected away from the dashboard.

**Solution:** I initialized a secondary Firebase app instance using `initializeApp(firebaseConfig, "Secondary")` and routed all admin account creation through that secondary `auth` instance. I added a `setDoc` call inside `adminCreateUser()` to write the role document (which the secondary auth flow would otherwise skip), and called `signOut(secondaryAuth)` immediately after creation to clean up.

---

### Problem 9: "No Results" Message Replacing the Entire Page

When a search or filter returned no members, the entire page — including the search input, filter dropdown, and Create Member button — was replaced by the empty-state message.

**Why it occurred:** The empty-state check was a guard clause before the main JSX return, so when `fetchedMembers.length === 0` the component exited early and rendered nothing else.

**Solution:** I removed the guard clause and moved the empty-state message inside the main JSX return as a ternary, so the surrounding UI always renders regardless of result count.

---

### Problem 10: New Members Saving Without a Membership Plan

Members created through `CreateMemberModal` were saving with a blank Plan field in Firestore, even though the dropdown visually appeared to default to "Basic."

**Why it occurred:** `membershipPlan` was initialized as `useState("")`. The dropdown's first option had `value="basic"`, but because the user never interacted with it, `setMembershipPlan` was never called and the empty string was what got written to Firestore.

**Solution:** Changed the initial state to `useState("basic")` to match the first option's value, so the correct default is saved even without user interaction.

---

### Problem 11: "Book a Tour" Button Appearing to Do Nothing

Clicking "Book a Tour" had no visible effect — no modal appeared and no errors were thrown.

**Why it occurred:** The modal was actually mounting and rendering correctly, but no CSS had been written for `.modal-overlay` and `.modal-box`, so it rendered at the bottom of the document flow completely out of view.

**Solution:** Added `position: fixed` and `z-index` to `.modal-overlay` to render it as a proper overlay above the page.

---

### Problem 12: Form Submission Appending Query Parameters to the URL

Submitting the "Book a Tour" form was appending all field values to the URL as query parameters.

**Why it occurred:** React's synthetic event system pools and nullifies events after the handler returns. In an `async` handler, the event's properties are cleared before the async logic runs, so `e.preventDefault()` wasn't reliably stopping the default form submission behavior.

**Solution:** Added `e.persist()` at the top of `handleSubmit` to keep the event alive long enough for `e.preventDefault()` to take effect.

---

### Problem 13: Login Page Form Fields Not Centered

Form fields on the login page were left-aligned inside the right panel, and after adding flex centering utilities the "Don't have an account?" line remained slightly offset.

**Why it occurred:** Block-level elements like `<form>` and `<div>` each determine their own width independently inside a flex container, so siblings can end up with different alignment anchors.

**Solution:** Wrapped all children inside the right panel in a single `<div className="w-full max-w-sm">`, which gave every sibling the same parent width and a consistent left edge.

---

### Problem 14: Gallery Grid Asymmetry With 8 Images

An 8-image 3-column grid left the final row with two images and a large empty gap. Multiple attempts to center the last items or adjust column spans failed.

**Why it occurred:** Standard centering utilities like `mx-auto` don't reposition grid items. Tailwind's JIT compiler also silently purges dynamically constructed class strings like `` `md:col-span-${span}` `` because it can't detect them statically at build time.

**Solution:** After several failed attempts — `md:col-span-2`, `md:col-start-2`, a placeholder `<div>`, and a dynamic class string — I added a safelist comment above `getSpanClasses()` so Tailwind registers the required span classes and includes them in the production build.

---

### Problem 15: Dashboard "Dead Space" and Duplicated Widget Headers

After switching the admin dashboard to a 3-column grid, the Tour Requests widget stretched across the full bottom row leaving large empty space, and the section header and "View All" button were duplicating on every mapped item.

**Why it occurred:** CSS Grid forces `col-span` elements to fill their full defined width regardless of content. The header and button were inside the `.map()` loop, so they rendered once per record instead of once per section.

**Solution:** I refactored `TourRequestsWidget` to return a React Fragment of individual cards so they fill grid slots dynamically, moved the header and "View All" button outside the `.map()` loop into a single `col-span-3` wrapper, switched the internal card container from `grid` to `flex flex-wrap`, and applied `max-w-[280px]` per card to keep them compact.

---

### Problem 16: Gallery Upload Has No Live Upload Logic

The `GalleryUpload` component UI was built — file validation, progress bar, loading states, and a Firestore metadata write — but the actual upload handler was never implemented.

**Why it occurred:** Firebase Storage requires a billing method that wasn't available during development, so images were served via raw GitHub URLs as a workaround instead.

**Solution:** The UI is kept as-is since it accurately reflects the intended production implementation. The upload handler is stubbed out, making Firebase Storage integration a single swap once storage is provisioned.

---

### Problem 17: Hardcoded Firebase Credentials Exposed in Public Repository

Firebase configuration values — including the API key and project identifiers — were initially hardcoded directly in `firebase.js` and committed to the public repository.

**Why it occurred:** It wasn't known at the time that hardcoding secrets in source files and pushing them to a public repo exposes them permanently in Git history. This is a serious security mistake that in a production environment with billing enabled could lead to unauthorized access or unexpected charges.

**Solution:** GitHub's secret scanning detected the exposed credentials and sent an automated security alert by email. The config values were moved to a `.env` file, the file was added to `.gitignore` to prevent future commits, and `firebase.js` was updated to read from `import.meta.env.VITE_*` environment variables instead. The Firebase credentials were also rotated to invalidate the exposed values.

---

## What I Might Add

- **Calendar view for classes** — convert the class card grid into a weekly/monthly calendar layout
- **Virtual gym tour** — embed a video walkthrough of the gym so prospective members don't need to visit in person to get a feel for the space
- **Additional OAuth providers** — allow members to sign in using existing accounts such as Google, Outlook, and Yahoo as alternatives to email and password.

---

## Known Issues

### Login Redirect After Unauthenticated Booking Attempt

When an unauthenticated user tries to book a class, they're redirected to login but then sent to the dashboard instead of back to the booking flow.

**Future fix:** Implement return URL state management to redirect users back to the classes page (or auto-complete the booking) after login.

---

### Payment Status Not Automated

Member status (active/inactive) is set manually when an admin records a payment. It does not update automatically based on payment activity.

**Future fix:** Integrate a payment processor (e.g., Stripe) and use Firebase Cloud Functions to automatically switch member status when a payment is overdue or confirmed.

---

### Member Deletion Does Not Remove Firebase Auth Account

Deleting a member through the admin panel removes the Firestore document but leaves the Firebase Auth account active. The member could technically still log in.

**Future fix:** Implement a Firebase Cloud Function using the Admin SDK to delete the user from Firebase Auth when an admin removes a member.

---

### Book a Tour Form Shows One Error at a Time

The `validate()` function in `BookTourModal` uses early returns, meaning only one field error is shown per submission attempt rather than all errors at once.

**Future fix:** Refactor `validate()` to collect all errors into a single object without early returns, and return the full errors object in one pass.

---

### Gallery Upload Is UI-Only

The gallery upload component is a frontend-only implementation. No images are actually uploaded or stored — Firebase Storage has not been provisioned.

**Future fix:** Integrate Firebase Storage. The upload handler is already stubbed out, so the integration is a single swap once storage is provisioned.

---

### `getPaymentStatus()` Called Twice in `RecentPaymentsCard`

The function is called twice where it should be called once and stored in a variable. The correct argument to pass when storing the result is not yet determined.

---

## License

MIT
