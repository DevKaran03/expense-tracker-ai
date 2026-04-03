import { Expense } from "../types/expense";

const API_BASE_URL = "http://localhost:3000/api"; // Configurable URL
const TIMEOUT_MS = 10000;

const fetchWithTimeout = async (
  resource: string,
  options: RequestInit = {},
) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const apiService = {
  getExpenses: async (): Promise<Expense[]> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses`);
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || "Failed to fetch expenses");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out after 10 seconds");
      }
      throw error;
    }
  },

  addExpense: async (input: string): Promise<Expense> => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });
      const result = await response.json();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error || "Failed to add expense");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out after 10 seconds");
      }
      throw error;
    }
  },

  deleteExpense: async (id: number): Promise<void> => {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/expenses/${id}`,
        {
          method: "DELETE",
        },
      );
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete expense");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out after 10 seconds");
      }
      throw error;
    }
  },
};
