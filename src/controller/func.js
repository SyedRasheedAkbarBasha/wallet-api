import { sql } from "../db/db.js";

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
    res.status(201).json();
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
  const { userId } = req.params;
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
    const balance = Number(incomeResult[0].income) + Number(expensesResult[0].expenses);
    res.json({
      balance,
      income: Number(incomeResult[0].income),
      expenses: Number(expensesResult[0].expenses),
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactionsByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} AND title != 'Dream Savings Payout' ORDER BY created_at DESC
    `;
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Dream Savings handlers

export const getDreamSavings = async (req, res) => {
  const { userId } = req.params;
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
  const { userId } = req.params;
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

export const deleteDreamSaving = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Dream saving ID is required" });
  }
  try {
    // Get the dream saving to delete
    const dreamSaving = await sql`
      SELECT * FROM dream_savings WHERE id = ${id}
    `;
    if (dreamSaving.length === 0) {
      return res.status(404).json({ error: "Dream saving not found" });
    }
    const userId = dreamSaving[0].user_id;

    // Calculate total saved amount for this dream saving
    const totalSavedResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total_saved FROM dream_savings WHERE user_id = ${userId}
    `;
    const totalSaved = totalSavedResult[0].total_saved;

    // Add total saved amount to user's balance (assuming transactions table)
    await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${userId}, 'Dream Savings Payout', ${totalSaved}, 'income')
    `;

    // Delete all dream savings for this user
    await sql`
      DELETE FROM dream_savings WHERE user_id = ${userId}
    `;

    res.status(200).json({ message: "Dream product and savings deleted", totalSaved });
  } catch (error) {
    console.error("Error deleting dream saving:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
