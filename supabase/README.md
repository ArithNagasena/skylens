# Supabase setup

The admin panel at `/admin` and every editable section of the public site read
from one Supabase project. This is the whole setup, start to finish — about ten
minutes, once.

Until it is done nothing breaks: the public site falls back to the content in
`src/content`, and `/admin` says what is missing instead of showing forms that
cannot save.

---

## 1. Create the project

1. Sign in at [supabase.com](https://supabase.com) and create a new project.
   Pick the region closest to your visitors — Singapore or Mumbai for Sri
   Lanka.
2. Save the database password somewhere safe. You will not need it for this
   application, but it cannot be recovered.

## 2. Create the tables

In the dashboard, open **SQL Editor → New query**, then run these two files in
order, pasting the contents of each and pressing **Run**:

| File | What it does |
| --- | --- |
| `migrations/0001_init.sql` | Tables, security policies and the `media` storage bucket. Required. |
| `migrations/0002_seed.sql` | Fills the content tables with what the site ships with today, so the panel opens populated. Optional. |

Both are safe to run more than once. `0001` recreates its policies; `0002` only
inserts into tables that are still empty, so it can never duplicate a row or
overwrite an edit you have made.

## 3. Point the site at it

In the dashboard, go to **Settings → API** and copy the two values into
`.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Then restart the dev server — Next.js reads environment variables at start-up.

The anon key belongs in the browser; that is what it is for. Row-level security
decides who may write, not the key. **Never** put the `service_role` key in this
file or anywhere else in the repository: it bypasses every policy in `0001`.

## 4. Create your admin account

1. **Authentication → Users → Add user**, and create one with an email and
   password. Tick *Auto Confirm User* so no confirmation email is needed.
2. Copy the new user's **UID**.
3. Back in the SQL editor, grant it access:

```sql
insert into public.admins (user_id, email, full_name)
values ('paste-the-uid-here', 'you@skylens.lk', 'Your Name');
```

Signing in without that row gets you as far as the panel and no further — it
tells you plainly that the account has no access, rather than failing as if the
password were wrong.

Repeat for each person who needs access. To revoke it, delete their row from
`public.admins`; the account survives but the panel closes to them immediately.

## 5. Sign in

Go to `/admin/login`. That is it.

---

## How it fits together

**Content the panel edits, and where it shows up**

| Table | On the site |
| --- | --- |
| `hero_images` | The rotating frames in the landing-page hero |
| `latest_work_images` | The "Our Latest Work" scrolling strip |
| `showreel_videos` | The four films under "Recently completed projects" |
| `services` | The landing-page service grid, the /services cards, and the categories and prices on the quote form |
| `projects` | Cards on /work, above the shipped case studies |

Each of these falls back to `src/content` when its table is empty, so deleting
the last row restores the shipped content rather than leaving a blank section.

**Documents and accounts** — `quotations`, `bills` and the `finance_*` tables —
are admin-only. No policy grants anonymous access to a single row of them, so
they are not readable through the public anon key at all.

**Images** go to the public `media` bucket, in a folder per section. Anyone with
the URL can view them, which is the point — they end up on the public site.
Only signed-in admins can upload, replace or delete.

**Caching.** Public pages cache their content for a minute. The panel clears
that cache after every save, so an edit appears immediately; the minute only
applies to a change made directly in the Supabase dashboard.

## Backups

Supabase's free tier keeps daily backups for seven days. If the finance figures
here become the studio's actual bookkeeping, take a manual export as well —
**Database → Backups** in the dashboard — before anything you would not want to
re-enter by hand.
