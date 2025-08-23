import rateLimiter from "../db/redis.js";

const rateLimit = async(req,res,next)=>{
    try {
        //put your ipadress in this ("")
       const{sucess} = await rateLimiter.limit("my-limit"); 
       if(!sucess){
           return res.status(429).json({
            message:"Too Many Request"
           });
       }
    } catch (error) {
        console.log("RateLimit Error",error);
        next(error);
    }
}

export default rateLimit;