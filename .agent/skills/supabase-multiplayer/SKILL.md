---
name: Supabase Multiplayer
description: Working with realtime multiplayer rooms in PartyPack
---

# Supabase Multiplayer Skill

## Key Files

| File                                  | Purpose                               |
| ------------------------------------- | ------------------------------------- |
| `src/lib/multiplayer/room-manager.ts` | Core RoomManager class                |
| `src/lib/multiplayer/types.ts`        | RoomPlayer, RoomState, BroadcastEvent |
| `src/hooks/useMultiplayerRoom.ts`     | React hook wrapper                    |
| `src/context/RoomContext.tsx`         | Global room state context             |

## Core Types

```typescript
interface RoomPlayer {
  id: string;
  name: string;
  isHost: boolean;
  joinedAt: number;
}

interface RoomState {
  roomCode: string;
  gameId: string;
  players: RoomPlayer[];
  hostId: string;
  status: "waiting" | "playing" | "finished";
  gameState: unknown;
  createdAt: number;
}

type BroadcastEvent =
  | { type: "GAME_STATE_UPDATE"; payload: unknown }
  | { type: "PLAYER_ACTION"; payload: { playerId: string; action: string } }
  | { type: "HOST_START_GAME"; payload: { gameState: unknown } };
```

## RoomManager API

### Creating a Room (Host)

```typescript
const manager = new RoomManager(userId, playerName);
const roomCode = await manager.createRoom(gameId);
```

### Joining a Room (Guest)

```typescript
const manager = new RoomManager(userId, playerName);
await manager.joinRoom(roomCode);
```

### Setting Event Handlers

```typescript
manager.setHandlers({
  onPlayersChange: (players) => setPlayers(players),
  onGameStateChange: (state) => setGameState(state),
  onRoomStatusChange: (status) => setStatus(status),
  onPlayerAction: (playerId, action, data) =>
    handleAction(playerId, action, data),
  onError: (error) => toast.error(error),
});
```

### Broadcasting State (Host Only)

```typescript
if (manager.isHost()) {
  manager.broadcastGameState(newGameState);
}
```

### Sending Player Actions

```typescript
manager.sendPlayerAction("GUESS", { answer: selectedOption });
```

## Patterns

### Host-Authoritative State

- Only the host can modify and broadcast game state
- Guests send actions, host processes and broadcasts result
- Prevents desyncs and cheating

### Presence Tracking

- Players automatically tracked via Supabase presence
- `onPlayersChange` called when players join/leave
- Use `player.isOnline` to show connection status

### Room Lifecycle

1. Host creates room → Gets 6-char code
2. Guests join with code → Added to players list
3. Host starts game → Status becomes "playing"
4. Game progresses → State broadcasts to all
5. Game ends → Status becomes "finished"
6. Anyone can leave → Room cleaned up when empty

## Database Schema

```sql
-- Rooms are ephemeral, stored in Supabase Realtime channels
-- No persistent database table needed for basic rooms
-- For persistence, use multiplayer_rooms table:
CREATE TABLE multiplayer_rooms (
  room_code TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  initial_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Debugging

- Check browser console for `RoomManager` logs
- Supabase Dashboard → Realtime → Channels shows active rooms
- Player presence visible in channel inspector
