
import app from './app.js';
import http from 'http';
import { initSocket } from './services/socket.js';
import { connectDB } from './database/server.js';

const startServer = async () => {
    try {
        await connectDB();

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
