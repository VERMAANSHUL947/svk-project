const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

(async () => {
    // Ensure data directory exists for persistence
    const dbPath = path.resolve(__dirname, '../data/portable_db');
    const binPath = path.resolve(__dirname, '../data/bin'); // Store binary here so we don't redownload every time

    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }
    if (!fs.existsSync(binPath)) {
        fs.mkdirSync(binPath, { recursive: true });
    }

    console.log('-------------------------------------------------------');
    console.log('🛠️  Starting Portable MongoDB (v4.4.18) for Older CPUs...');
    console.log('⏳  Please wait! First run downloads the binary (~70MB).');
    console.log('-------------------------------------------------------');

    try {
        const mongod = await MongoMemoryServer.create({
            instance: {
                port: 27017, // Fixed port to match .env.local
                dbPath: dbPath,
                storageEngine: 'wiredTiger',
            },
            binary: {
                version: '4.4.18', // Compatible with older CPUs (Ivy Bridge/No AVX2)
                downloadDir: binPath,
            }
        });

        console.log('\n✅  Portable MongoDB is RUNNING on port 27017');
        console.log(`📁  Database storage: ${dbPath}`);
        console.log('✅  You can now run "npm run dev" in another terminal!');
        console.log('🛑  Press Ctrl+C here to stop the database.');

        // Keep process alive
        process.on('SIGINT', async () => {
            console.log('\n👋 Stopping MongoDB...');
            await mongod.stop();
            process.exit(0);
        });
    } catch (err) {
        console.error('\n❌ Failed to start portable DB:', err);
        console.error('If this fails consistently, please use MongoDB Atlas (Cloud).');
        process.exit(1);
    }
})();
