require('dotenv').config();
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE_ID;

// Container IDs from environment variables
const usersContainerId = process.env.USERS_CONTAINER_ID || "users";
const postsContainerId = process.env.POSTS_CONTAINER_ID || "posts";

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);

// Create container references
const usersContainer = database.container(usersContainerId);
const postsContainer = database.container(postsContainerId);

// Verify connection to both containers
async function verifyConnections() {
    try {
        await usersContainer.read();
        await postsContainer.read();
        console.log(`✅ Successfully connected to Cosmos DB`);
        console.log(`📁 Database: "${databaseId}"`);
        console.log(`👤 Users Container: "${usersContainerId}"`);
        console.log(`📷 Posts Container: "${postsContainerId}"`);
    } catch (error) {
        console.error("❌ Cosmos DB connection failed. Check:");
        console.error("1. .env file has correct values");
        console.error("2. Containers exist in Azure Portal");
        console.error("3. Azure Firewall settings allow your IP");
        console.error("Error Detail:", error.message);
        
        // Try to show which container failed
        try {
            await usersContainer.read();
            console.log("✅ Users container OK");
        } catch (usersErr) {
            console.error("❌ Users container failed:", usersErr.message);
        }
        
        try {
            await postsContainer.read();
            console.log("✅ Posts container OK");
        } catch (postsErr) {
            console.error("❌ Posts container failed:", postsErr.message);
        }
    }
}

verifyConnections();

// Export BOTH containers
module.exports = {
    usersContainer,
    postsContainer
};