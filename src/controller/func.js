import { sql } from "../db/db.js";

export const createTransaction = async (req, res) => {
  // existing createTransaction code
};

export const deleteTransaction = async (req, res) => {
  // existing deleteTransaction code
};

export const getSummaryByUserId = async (req, res) => {
  // existing getSummaryByUserId code
};

export const getTransactionsByUserId = async (req, res) => {
  // existing getTransactionsByUserId code
};

// Dream Savings handlers

export const getDreamSavings = async (req, res) => {
  try {
    const dreamSavings = await sql`SELECT * FROM dream_savings ORDER BY created_date DESC`;
    res.json(dreamSavings);
  } catch (error) {
    console.error("Error fetching dream savings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addDreamSaving = async (req, res) => {
  const { title, amount } = req.body;
  if (!title || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const inserted = await sql`
      INSERT INTO dream_savings (title, amount)
      VALUES (${title}, ${amount})
      RETURNING *;
    `;
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error("Error adding dream saving:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
