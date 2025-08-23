

import rateLimiter from "../db/redis.js";

const rateLimit = async(req, res, next) => {
    try {
        const { success } = await rateLimiter.limit("my-limit"); 
        if(!success){
            return res.status(429).json({
                message: "Too Many Requests"
            });
        }
        next();
    } catch (error) {
        console.log("⚠️ RateLimit disabled due to Redis error:", error.message);
        // Continue without rate limiting if Redis fails
        next();
    }
}

export default rateLimit;