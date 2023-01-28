import { Server as HttpServer } from 'http';

import jwtAuthSocket from '@mathemon/turbo-server/middleware/socket.io/auth/jwt.js';
import wrap from '@mathemon/turbo-server/middleware/socket.io/wrap.js';
import { Server } from 'socket.io';

import userMiddleware from '../middlewares/user.js';

import battleMiddleware from './battle.js';

const socketServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    serveClient: false,
    path: '/websocket',
  });

  io.on('connection', (socket) => {
    // TODO: Add logging
    socket.on('disconnect', () => {
      // TODO: Add logging
    });
  });

  io.use(jwtAuthSocket());
  io.use(wrap(userMiddleware));
  io.use(battleMiddleware);
};

export default socketServer;
