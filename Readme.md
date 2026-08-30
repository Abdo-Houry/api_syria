You are an expert senior frontend architect and React/TypeScript engineer.

I am building a tourism web application connected to physical printed tourism booklets.

IMPORTANT: This frontend is for USERS ONLY. It is NOT an Admin Dashboard.

The user experience must feel like a premium interactive tourism experience, not an administrative dashboard.

## CORE BUSINESS FLOW

The user purchases a physical tourism booklet from a bookstore.

Each physical booklet copy has:

* Serial Number
* Version
* QR Codes

There is a QR code for the province and QR codes for the places included in the booklet.

The user's journey starts from the booklet they purchased.

There is NO generic "explore Syria" flow.

The booklet is the main context of the user's journey.

Example:

User purchases:

"Halab Tourism Booklet"

The experience becomes:

Booklet
→ Halab Province
→ Halab Places
→ Halab Challenges
→ Halab Stamps
→ Halab Partners
→ FAQ
→ User Progress

If the user later purchases another booklet:

"Damascus Tourism Booklet"

then Damascus becomes a completely independent journey.

Progress, visits, challenges, stamps and achievements must NOT be mixed between different booklets/provinces.

---

# BOOK ACTIVATION

The user opens the website and scans the QR associated with the booklet.

The system validates:

* QR type
* target ID
* serial
* version

If the user is not authenticated:

* show Login / Register
* after authentication, request profile completion if required
* then associate the booklet with the user's account

Do NOT modify the backend.

The frontend must adapt to the existing backend APIs exactly as they currently exist.

---

# PROVINCE EXPERIENCE

After activating a booklet, the user sees the province associated with that booklet.

The province page should contain:

* Province name
* Hero image
* Description
* Province information
* Places
* Challenges
* Stamps
* Partners
* FAQ
* Any additional data returned by the backend

This must look like a premium tourism experience, not CRUD UI.

---

# PLACES

There are TWO ways to access a place.

## METHOD 1 — FROM THE PROVINCE

Inside the province page, display all places belonging to that province.

Example:

Halab:

* Citadel of Aleppo
* Ancient Market
* Umayyad Mosque
* etc.

The user can click a place and explore its details.

This allows the user to discover a place before physically visiting it.

## METHOD 2 — PLACE QR CODE

Each place can have its own QR code.

When the user physically reaches the place, they can open the QR Scanner and scan the place QR.

The backend validates the QR.

If valid and associated with the user's current booklet:

* open the place
* register the visit
* associate the visit with the current user/booklet

The QR is therefore not just a URL.

It is part of the visit tracking system.

---

# PLACE DETAILS

The place page should include:

* Place name
* Hero image
* Image gallery
* Videos
* Description
* Historical information
* Province
* Related challenges
* Related stamps
* Any additional API content

Clearly show whether the user has already visited the place.

Examples:

"Visited ✓"

or:

"Visit this place and scan its QR code to complete the visit."

---

# QR SCANNER

Build a professional camera-based QR scanner.

It must support:

* Booklet QR
* Province QR
* Place QR

The scanner should:

* access the camera
* scan QR codes
* parse the QR data
* send the correct data to the backend
* handle invalid QR codes
* handle unsupported QR types
* handle QR codes belonging to another booklet
* handle valid QR codes
* navigate to the correct destination

Do not assume every QR represents the same target.

---

# CHALLENGES

Challenges are part of the tourism/game experience.

They may be associated with:

* booklet
* province
* place

Each challenge may display:

* title
* description
* associated place
* question/task
* completion status
* result/score when applicable

The UI should feel like an interactive adventure/game rather than a data management system.

---

# STAMPS

Stamps are an important collectible part of the experience.

Create a visual collection/album experience.

Example:

"My Stamps"

Unlocked stamp:

✓

Locked stamp:

🔒

Each stamp can display:

* name
* image
* associated place
* acquisition/completion state

The design should be visual and engaging.

---

# PARTNERS

Display partners associated with the booklet/province.

Each partner can contain:

* name
* logo
* image
* description
* contact information
* offer
* website link

Use a tourism-friendly presentation.

---

# FAQ

Provide a FAQ section for the current province/booklet.

Use shadcn/ui Accordion or an appropriate interactive component.

---

# MY JOURNEY

Do NOT call this "Dashboard".

Use:

"My Journey"

This page should show the user's progress within the current booklet.

For example:

My Journey — Halab

Places:
5 / 12

Challenges:
4 / 10

Stamps:
3 / 8

Progress:
42%

The UI should feel like a travel journey, not a collection of admin statistic cards.

---

# MY BOOKLETS

The user can see all booklets they own.

Example:

Halab Booklet
Province: Halab
Progress: 42%

[Continue Journey]

If the user owns multiple booklets:

* Halab
* Damascus
* Homs

Each booklet must have completely independent progress.

---

# ADD / ACTIVATE NEW BOOKLET

The user must be able to activate another booklet.

Use the QR scanner.

After scanning:

If valid and unused:

→ associate booklet with the user.

If already assigned:

→ show an appropriate error.

If invalid:

→ show a clear error.

---

# AUTHENTICATION

Implement:

* Login
* Registration
* Profile completion
* Logout
* Authentication persistence
* Protected routes

Do NOT change the backend authentication system.

Use the existing API exactly as provided.

---

# API ARCHITECTURE

Create a clean API layer.

Example:

src/api/

auth.api.ts
books.api.ts
provinces.api.ts
places.api.ts
qr.api.ts
challenges.api.ts
stamps.api.ts
partners.api.ts
user-books.api.ts
visits.api.ts

Do not invent endpoints.

Do not modify backend routes/controllers/services/entities/validation.

If a required response structure is unknown, ask for the backend code or JSON response before implementing that feature.

---

# TECHNOLOGY

Use:

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* React Router
* Axios or the existing project HTTP client
* Lucide React

Use reusable components.

Avoid monolithic components.

---

# DESIGN

The design must be:

* Premium
* Modern
* Tourism-focused
* Mobile-first
* Fully responsive
* RTL
* Arabic-first
* Elegant
* Interactive

Do NOT create an admin-style UI.

Do NOT use a large administrative sidebar.

Do NOT make everything look like tables and CRUD cards.

Use:

* large imagery
* galleries
* progress indicators
* badges
* interactive sections
* subtle animations
* skeleton loading
* empty states
* error states
* proper loading states
* toast notifications

The experience should feel like a digital companion to a physical tourism booklet.

---

# NAVIGATION

Navigation should be simple and user-oriented.

At minimum:

* My Journey
* My Booklets
* Places
* Challenges
* Stamps
* QR Scanner
* Profile

The current booklet and province context should be clearly visible.

---

# ROUTING

Suggested routes:

/login
/register
/complete-profile

/books
/books/:id

/journey
/journey/:bookId

/provinces/:id

/places/:id

/challenges
/challenges/:id

/stamps
/partners
/faq

/scanner

/profile

Adapt these routes to the actual application architecture and backend.

Do not invent backend endpoints.

---

# IMPORTANT STATES

Handle all important states:

* unauthenticated user
* authenticated user
* incomplete profile
* no booklet
* one booklet
* multiple booklets
* valid QR
* invalid QR
* booklet QR
* province QR
* place QR
* already-used booklet
* visited place
* unvisited place
* completed challenge
* incomplete challenge
* unlocked stamp
* locked stamp
* API error
* network error
* loading
* empty state

---

# CRITICAL BUSINESS RULE

Do NOT assume the user enters the website to explore Syria generally.

The user starts from the physical booklet they purchased.

The booklet determines the province.

The province determines:

* places
* challenges
* stamps
* partners
* FAQ
* related content

A place can be accessed in two ways:

1. From the list of places inside the province page.
2. By scanning the QR code physically located at the place.

Selecting a place from the province allows the user to explore its information.

Scanning the place QR confirms/records the visit and associates it with the current booklet.

Different booklets must have completely independent journeys.

Never mix:

* visits
* progress
* challenges
* stamps
* achievements

between different booklets/provinces.

---

# DEVELOPMENT ORDER

Build the project incrementally.

Start with:

## FOUNDATION

* application structure
* routing
* API client
* authentication infrastructure
* TypeScript types
* state/context
* theme
* RTL
* shadcn/ui
* error handling
* loading system
* layouts

Then implement:

1. Authentication
2. Booklet activation
3. Province
4. Places
5. QR Scanner
6. Challenges
7. Stamps
8. Partners
9. My Journey
10. Profile

Do NOT build everything in one file.

Use reusable components.

Use clean feature-based organization where appropriate.

The final code must be production-ready, scalable and maintainable.

MOST IMPORTANT:

Do NOT modify the backend.

Do NOT invent APIs.

Do NOT invent response structures.

If you need an unknown backend response, ask me for the actual backend code or JSON response before implementing that integration.
