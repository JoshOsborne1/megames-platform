---
name: Supabase Optimization
description: Efficient indexing, realtime payload optimization, and RLS best practices.
---

# Supabase Optimization Skill

This skill ensures that our Supabase backend is efficient and secure, especially for real-time multiplayer.

## 1. Database Indexing

- **Room Lookups**: Ensure `room_code` is indexed for fast joining.
- **Player Search**: Index `room_id` in the players table to avoid full table scans.

## 2. Realtime Optimization

- **Selective Broadcast**: Only broadcast the _delta_ (what changed) instead of the entire state whenever possible.
- **Channel Filters**: Use filters to subscribe only to relevant events to reduce client-side overhead.

## 3. Row Level Security (RLS)

- **Host-Only Access**: Ensure only the `host_id` can update a room's state.
- **Guest Read-Only**: Guests should only have `select` access to rooms unless they are updating their own player profile.

## 4. Connection Management

- **Clean Up**: Ensure old rooms (>24h) are cleaned up via a cron job (Edge Function) to prevent table bloat.
- **Presence**: Use Supabase Presence for transient player status rather than writing every small change to the database.
