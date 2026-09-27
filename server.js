// Backrooms Together — signaling + relay server
//
// Serves the static game (./public) and relays the handful of messages
// the two players need to exchange: who is Player A / Player B, the
// shared puzzle seed, chat lines, and "I solved my puzzle" events.
// No accounts, no database — just two browser tabs talking through a
// WebSocket that this server keeps open between them.

const path = require('path');
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

/** roomCode -> { A: WebSocket|null, B: WebSocket|null, seed: number } */
const rooms = new Map();

function getOrCreateRoom(code) {
  let room = rooms.get(code);
  if (!room) {
    room = { A: null, B: null, seed: Math.floor(Math.random() * 1e9) };
    rooms.set(code, room);
  }
  return room;
}

function send(ws, payload) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

wss.on('connection', function (ws, req) {
  const url = new URL(req.url, 'http://placeholder');
  const roomCode = (url.searchParams.get('room') || 'default').slice(0, 32);
  const room = getOrCreateRoom(roomCode);

  let role = null;
  if (!room.A) {
    role = 'A';
    room.A = ws;
  } else if (!room.B) {
    role = 'B';
    room.B = ws;
  } else {
    send(ws, { type: 'full' });
    ws.close();
    return;
  }

  ws.role = role;
  ws.roomCode = roomCode;

  const peer = role === 'A' ? room.B : room.A;
  send(ws, { type: 'welcome', role: role, seed: room.seed });
  if (peer) {
    send(peer, { type: 'peer_joined' });
    send(ws, { type: 'peer_joined' });
  }

  ws.on('message', function (raw) {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!msg || typeof msg.type !== 'string') return;

    const currentRoom = rooms.get(ws.roomCode);
    if (!currentRoom) return;
    const otherSide = ws.role === 'A' ? currentRoom.B : currentRoom.A;

    if (msg.type === 'chat' && typeof msg.text === 'string') {
      send(otherSide, { type: 'chat', role: ws.role, text: msg.text.slice(0, 200) });
    } else if (msg.type === 'solved' && Number.isInteger(msg.level)) {
      send(otherSide, { type: 'solved', role: ws.role, level: msg.level });
    }
  });

  ws.on('close', function () {
    const currentRoom = rooms.get(ws.roomCode);
    if (!currentRoom) return;
    if (currentRoom.A === ws) currentRoom.A = null;
    if (currentRoom.B === ws) currentRoom.B = null;
    const remaining = currentRoom.A || currentRoom.B;
    send(remaining, { type: 'peer_left' });
    if (!currentRoom.A && !currentRoom.B) rooms.delete(ws.roomCode);
  });

  ws.on('error', function () {
    /* let 'close' handle cleanup */
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log('Backrooms Together listening on port ' + PORT);
});
