import express from "express";
import dotenv from "dotenv";
import { sql } from "./db/db.js";
import rateLimit from "./middleware/middle.js";
import transactionRouters from "./routes/transactionRouter.js"
dotenv.config();
const app = express();

//middleware
//it convert the json into req.body
app.use(express.json());
//middleware of ratelimiter
app.use(rateLimit);
//if port doesnt have then 5001
const PORT = process.env.PORT || 5001;

//create database
async function initDB() {
    try {
        //if table already exist doesnt create
        await sql`CREATE TABLE IF NOT EXISTS transactions(
           id SERIAL PRIMARY KEY,
           user_id VARCHAR(255) NOT NULL,
           title VARCHAR(255) NOT NULL,
           amount DECIMAL(10,2) NOT NULL,
           category VARCHAR(255) NOT NULL,
           created_at DATE NOT NULL DEFAULT CURRENT_DATE 
        )`;
        console.log("Database initialized sucessfully");

    } catch (error) {
        console.log("Error initialized DB",error);
        process.exit(1);// 1 means failure
    }
}

app.use("/api/transactions",transactionRouters);
initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
