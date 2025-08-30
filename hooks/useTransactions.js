// react custom hook file

import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
// import {API}
import { API_URL } from "../constants/api";

// const API_URL = "https://wallet-api-cxqp.onrender.com/api";

// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced fetch with timeout, retry logic, and mobile-specific headers
  const fetchWithTimeout = async (url, options = {}, maxRetries = 3) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        console.log(`Attempt ${attempt}/${maxRetries} for ${url}`);
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add mobile-specific headers
            'User-Agent': Platform.OS === 'ios' ? 'iOS App' : 'Android App',
            'Cache-Control': 'no-cache',
            ...options.headers,
          },
        });
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;

        if (error.name === 'AbortError') {
          console.log(`Attempt ${attempt} timed out`);
          if (attempt === maxRetries) {
            throw new Error('Request timeout after multiple attempts - please check your internet connection');
          }
        } else if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      console.log(`Fetching transactions for user: ${userId}`);
      const response = await fetchWithTimeout(`${API_URL}/transactions/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      // Handle empty response
      if (!text.trim()) {
        console.log('Empty transactions response');
        setTransactions([]);
        return;
      }

      try {
        const data = JSON.parse(text);
        console.log(`Fetched ${data.length} transactions`);
        setTransactions(data);
      } catch (parseError) {
        console.error("Error parsing transactions JSON:", parseError);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(error.message);
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      console.log(`Fetching summary for user: ${userId}`);
      const response = await fetchWithTimeout(`${API_URL}/transactions/summary/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      // Handle empty response
      if (!text.trim()) {
        console.log('Empty summary response');
        setSummary({ balance: 0, expenses: 0, income: 0 });
        return;
      }

      try {
        const data = JSON.parse(text);
        console.log('Fetched summary:', data);
        setSummary(data);
      } catch (parseError) {
        console.error("Error parsing summary JSON:", parseError);
        setSummary({ balance: 0, expenses: 0, income: 0 });
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setError(error.message);
      setSummary({ balance: 0, expenses: 0, income: 0 });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      console.log(`Deleting transaction: ${id}`);
      const response = await fetchWithTimeout(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, error, loadData, deleteTransaction };
};