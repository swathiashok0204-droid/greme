---
name: Supabase REST permission diagnostics
description: How to distinguish PostgREST table privilege failures from RLS failures with the publishable client.
---

A publishable-key request to an exposed table can confirm the live REST schema, but it cannot reveal `pg_policies`. PostgreSQL error `42501` / “permission denied for table” means table or schema privileges fail before an RLS policy can return rows; an RLS-only read denial typically presents as an empty result.

**Why:** A compatibility migration can add a column successfully while grants or policies are absent, partially applied, or applied in a different SQL-editor context.

**How to apply:** Probe the exact REST table with the publishable key, inspect `/rest/v1/` definitions for columns, and keep service-role keys out of the app. Use the SQL editor to inspect or repair grants and policies.