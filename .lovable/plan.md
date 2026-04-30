## Add a self-serve CMS portal (WordPress-style editing) to the landing page

Goal: let your client log in to a private admin area and edit every piece of text, every image, and section content on the landing page — no developer needed, no code edits, no redeploys. Changes go live immediately.

### Approach

Build the CMS **inside this Lovable project** using Lovable Cloud (managed database + auth + file storage). All current hardcoded content in `src/pages/Index.tsx` becomes data rows the client edits from `/admin`. The public homepage reads from the database and renders the latest content.

This avoids Sanity/Contentful/WordPress entirely — one project, one login, one bill.

```text
┌─────────────────────────┐         ┌──────────────────────────┐
│  /  (public homepage)   │ ◀────── │  Lovable Cloud (DB +     │
│  reads content from DB  │         │  Storage + Auth)         │
└─────────────────────────┘         └──────────────────────────┘
                                              ▲
┌─────────────────────────┐                   │
│  /admin (client login)  │ ──── edits ───────┘
│  WYSIWYG-style forms    │
└─────────────────────────┘
```

### What the client can edit (mapped to current page)

- **Site settings**: logo, phone, consultation URL, footer text, social links
- **Header**: nav menu items (label + anchor/url)
- **Hero**: headline, subheadline, CTA label, CTA link, slider images + captions
- **Trust strip**: list of items (icon/text)
- **Services / Cards**: add / edit / remove / reorder cards (title, description, icon, link)
- **Outcomes / Features**: editable list
- **About**: rich text + image
- **Insights**: full mini-blog — create / edit / delete posts (title, slug, cover image, body, published toggle)
- **CTA band**: heading, subheading, button label + link
- **Footer**: columns of links, copyright

Everything is a database row — adding a new card or insight is a button click.

### Admin UX (the WordPress-like part)

- `/admin/login` — email + password (Google sign-in optional)
- `/admin` dashboard — list of editable sections + insights
- Each section opens a form with:
  - Inline text inputs / textareas with live preview
  - **Rich text editor** (bold, italic, links, lists, headings) for long-form fields (About, Insights body)
  - **Image uploader** with drag-and-drop, auto-upload to storage, instant URL
  - Add / remove / reorder list items (cards, nav links, insights) via buttons + drag handle
  - "Save" button → writes to DB → public site updates on next page load
- Optional **Preview** toggle that opens `/` in a new tab

Only logged-in admin users can access `/admin` and write to the DB (enforced by row-level security + a `user_roles` table with an `admin` role).

### Data model (Lovable Cloud tables)

- `site_settings` (singleton row) — logo_url, phone, footer_html, social_json, …
- `nav_links` — id, label, href, sort_order
- `sections` — id, type (`hero` | `trust` | `services` | `outcomes` | `about` | `cta`), data (jsonb), sort_order, visible
- `cards` — id, section_id, title, description, icon, link, sort_order
- `insights` — id, slug, title, cover_url, body_html, published, published_at
- `user_roles` — user_id, role (`admin`) — gates `/admin`
- Storage bucket `media` — images uploaded from the admin

RLS:
- Public `SELECT` on content tables (so the homepage can read)
- `INSERT/UPDATE/DELETE` only for users with the `admin` role

### What you (the client) won't need a developer for, ever again

- Changing any text on the homepage
- Swapping the logo or any image
- Adding / removing / reordering service cards
- Writing new insight posts (with images)
- Updating phone, consultation link, footer
- Toggling sections on/off

You **will** still need a developer for: brand-new page sections that don't exist yet, layout/design overhauls, or new functionality (e.g. payments). For pure content, no.

### Build steps

1. **Database & auth**: create the tables above + RLS policies + `user_roles` + media storage bucket.
2. **Seed**: copy the current hardcoded text/images from `Index.tsx` into the new tables so the homepage looks identical on first load.
3. **Public refactor**: rewrite `Index.tsx` to fetch from the DB (React Query) and render dynamically. Loading skeletons match current layout.
4. **Auth**: add `/admin/login` (email+password, with the standard signup→email-confirm flow off so you can pre-create the client's account).
5. **Admin shell**: `/admin` layout with sidebar (Site, Header, Hero, Sections, Cards, Insights, Footer, Media, Users).
6. **Admin forms**: one screen per section. Use shadcn `Form` + `Input` + `Textarea`, add a rich text editor (TipTap) for long-form fields, and an image picker that uploads to the `media` bucket.
7. **List management**: drag-to-reorder + add/remove for cards, nav links, insights.
8. **Role gate**: route guard + RLS so only admins reach `/admin` and only admins can write.
9. **Create the client's admin user** + share login.

### Trade-offs to know

- This is **not** WordPress — no plugin marketplace, no themes store. It's a tailor-made editor for *this* site, which is exactly why it stays simple.
- Rich-text editing covers formatting + links + images, but not arbitrary HTML/shortcodes.
- New section *types* (e.g. a brand-new "Pricing" block with a unique layout) still need a developer to design the component once; after that the client can fill it in.

### What I'll need from you to start

- Confirm the email address that should be the first admin (I'll create the account and send you the password to change on first login).
- Confirm you want this built inside the current Lovable project (recommended) vs a separate one.
- Optional: should `/admin` live at `/admin` or under a different path (e.g. `/dashboard`)?

Once you approve, I'll build it in this order: DB + auth → seed + public refactor → admin shell → per-section editors → insights + media → role gate + first user.