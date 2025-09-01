import { sql } from './src/db/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function printSummary() {
  try {
    const userId = 'user_320YyBTSjamAryEbe535PtzSYmd';

    console.log(`Fetching summary for user: ${userId}`);

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    console.log('=== DATABASE SUMMARY ===');
    console.log('Income:', incomeResult[0].income);
    console.log('Expenses:', expensesResult[0].expenses);
    console.log('Balance:', balanceResult[0].balance);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

printSummary();
