import { sql } from "../db/db.js";

// import { sql } from "../db/db.js";

export const createTransaction = async (req, res) => {
  const { user_id, title, amount, category } = req.body;
  if (!user_id || !title || !amount || !category) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const inserted = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }
  try {
    await sql`
      DELETE FROM transactions WHERE id = ${id}
    `;
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSummaryByUserId = async (req, res) => {
  const userId = req.params.user_id || req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;
    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;
    const balance = incomeResult[0].income + expensesResult[0].expenses;
    res.json({
      balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactionsByUserId = async (req, res) => {
  const userId = req.params.user_id || req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dream Savings handlers

export const getDreamSavings = async (req, res) => {
  const userId = req.user?.id || req.query.user_id;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const dreamSavings = await sql`
      SELECT * FROM dream_savings WHERE user_id = ${userId} ORDER BY created_date DESC
    `;
    res.json(dreamSavings);
  } catch (error) {
    console.error("Error fetching dream savings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addDreamSaving = async (req, res) => {
  const userId = req.user?.id || req.body.user_id;
  const { title, amount } = req.body;
  if (!userId || !title || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const inserted = await sql`
      INSERT INTO dream_savings (user_id, title, amount)
      VALUES (${userId}, ${title}, ${amount})
      RETURNING *;
    `;
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error("Error adding dream saving:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
