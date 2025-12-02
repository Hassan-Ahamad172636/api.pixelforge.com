import DBConnection from './database/server.js';
import app from './app.js';
import http from 'http';
import { initSocket } from './services/socket.js';

const startServer = async () => {
    try {
        await DBConnection();

        const PORT = process.env.PORT || 5000;

        // ✅ Create HTTP server from Express app
        const server = http.createServer(app);

        // ✅ Initialize Socket.IO
        initSocket(server);

        // ✅ Start HTTP server
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
