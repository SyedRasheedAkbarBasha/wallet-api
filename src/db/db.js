import { neon } from "@neondatabase/serverless";

//it import dotenv and it config like.config()
import dotenv from "dotenv";
dotenv.config();


//neon() means we write sql queries in postgreSql
//export means "sql" we can use anywhere
export const sql = neon(process.env.DATABASE_URL);
