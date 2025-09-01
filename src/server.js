import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sql } from "./db/db.js";
import rateLimit from "./middleware/middle.js";
import transactionRouters from "./routes/transactionRouter.js"
import job from "./db/cron.js"
dotenv.config();
const app = express();

// Enable CORS for all origins (adjust for production if needed)
app.use(cors({
  origin: "*", // Allow all origins for development
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true
}));

//activate cron

if(process.env.NODE_ENV==="production") job.start();

//middleware
//it convert the json into req.body
app.use(express.json());
//middleware of ratelimiter
app.use(rateLimit);
//if port doesnt have then 5001
const PORT = process.env.PORT || 5001;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

async function initDB() {
    try {
        // Test connection
        await sql`SELECT 1 as test`;
        console.log("Database connected successfully");
        
        // Check if transactions table exists
        const transactionsTableExists = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'transactions'
            );
        `;
        
        if (!transactionsTableExists[0].exists) {
            console.log("Creating transactions table...");
            await sql`CREATE TABLE transactions(
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                amount DECIMAL(10,2) NOT NULL,
                category VARCHAR(255) NOT NULL,
                created_at DATE NOT NULL DEFAULT CURRENT_DATE 
            )`;
            console.log("Transactions table created successfully");
        } else {
            console.log("Transactions table already exists");
        }

        // Check if dream_savings table exists
        const dreamSavingsTableExists = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'dream_savings'
            );
        `;

        if (!dreamSavingsTableExists[0].exists) {
            console.log("Creating dream_savings table...");
            await sql`
                CREATE TABLE IF NOT EXISTS dream_savings (
                   id SERIAL PRIMARY KEY,
                   user_id VARCHAR(255) NOT NULL,
                   title VARCHAR(255) NOT NULL,
                   amount DECIMAL(10,2) NOT NULL,
                   created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
            `;
            console.log("Dream_savings table created successfully");
        } else {
            console.log("Dream_savings table already exists");
        }

    } catch (error) {
        console.log("Error initializing DB:", error);
        process.exit(1);
    }
}


app.use("/api/transactions",transactionRouters);
initDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


