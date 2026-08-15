---
name: Expo public environment variables
description: How client-safe Supabase configuration reaches the Expo web bundle in this project.
---

Expo web only inlines environment variables exposed as `EXPO_PUBLIC_*`. Secrets can remain stored under their protected names and be mapped to the public names in the Expo dev/build command; the resulting publishable Supabase key is intentionally client-visible.

**Why:** Keeping only protected names in the workflow shell makes the Supabase client appear unconfigured inside the browser bundle even though the same variables work from shell probes.

**How to apply:** Preserve protected secret names, map them to `EXPO_PUBLIC_*` at Expo startup, restart the managed Expo workflow after changes, and never map service-role credentials into the client bundle.