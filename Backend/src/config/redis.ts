import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

const connectRedis = async () => {
    try {

        await redisClient.connect();    
        console.log("Connected to Redis");

    } 
    catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
};

export { connectRedis };
export default redisClient;