# Supabase Account Setup

Forma uses Supabase Auth plus one user-owned JSON state row per account.

This is intentionally simple for the beta:

- Auth creates the user account.
- `forma_user_state.user_id` links app data to `auth.users.id`.
- `forma_user_state.data` stores the same app state Forma already uses locally.
- Row Level Security ensures users can only read/write their own row.

## Setup

1. Create a Supabase project.
2. In Supabase, open the SQL editor and run `docs/supabase-setup.sql`.
3. In `js/supabase-config.js`, set:

```js
const FORMA_SUPABASE_URL='https://your-project.supabase.co';
const FORMA_SUPABASE_ANON_KEY='your-public-anon-key';
```

Only use the public anon/publishable key in the browser. Never use the service-role key.

## Current Data Model

The first version uses a single state row:

```sql
public.forma_user_state (
  user_id uuid primary key,
  data jsonb not null,
  created_at timestamptz,
  updated_at timestamptz
)
```

This keeps the account migration small. Later, if Forma needs richer querying or collaboration, workouts can be normalized into dedicated tables.

## LocalStorage

The existing `ll_*` localStorage keys are still written as a local cache/fallback. When Supabase is configured and the user is signed in, Supabase is the source of truth.
