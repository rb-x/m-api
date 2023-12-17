import app from './app';
import { Server } from 'http';

let server: Server;

export function startServer(port: string|number): void {
  server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export function stopServer(): void {
  if (server) {
    server.close();
  }
}