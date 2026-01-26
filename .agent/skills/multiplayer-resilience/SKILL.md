---
name: Multiplayer Resilience
description: Robust handling of Supabase Realtime and multiplayer state edge cases
---

# Multiplayer Resilience Skill

This skill provides patterns for handling complex multiplayer scenarios in the PartyPack platform.

## Event Handling Patterns

### Host Disconnect (Handover)

When the host leaves, the next player in the `players` array should be promoted to host.

```typescript
const handlePlayersChange = (players: RoomPlayer[]) => {
  if (players.length > 0 && !players.find((p) => p.isHost)) {
    // Current user is the new host if they are first in the list
    if (players[0].id === currentUserId) {
      promoteToHost();
    }
  }
};
```

### Subscription Recovery

Always provide a callback for channel errors to notify the user.

```typescript
channel.on("system", { event: "subscribe" }, (status) => {
  if (status === "CHANNEL_ERROR") {
    toast.error("Connection lost. Trying to reconnect...");
  }
});
```

## State Synchronization

### Ephemeral vs. Persistent

- **Ephemeral**: Use Realtime broadcast for game moves (who clicked what).
- **Persistent**: Store scores and final game results in Supabase `multiplayer_rooms` table if continuity is needed across refreshes.

### Guest Optimistic Updates

Guests should update their local state immediately upon action, then reconcile with the next host broadcast.

```typescript
const sendMove = (move) => {
  setLocalState((prev) => applyMove(prev, move));
  manager.sendPlayerAction("MOVE", move);
};
```

## Best Practices

- **Room Codes**: Use uppercase 6-character alphanumeric codes for readability.
- **Presence**: Periodically check `isOnline` status; don't wait for players who have timed out.
- **Latency**: Keep broadcast payloads small. Don't send the entire history, just the state delta or current frame.
