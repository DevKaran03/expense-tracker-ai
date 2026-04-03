import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ GEMINI_API_KEY is not defined in environment variables. Expense parsing will fail.",
  );
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

export interface ParsedExpense {
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
}

const SYSTEM_PROMPT = `You are an expense parser. Extract expense information from natural language input.

RULES:
1. Extract the amount as a number (no currency symbols)
2. Default currency is INR unless explicitly mentioned (USD, EUR, etc.)
3. Categorize into EXACTLY one of these categories:
   - Food & Dining (restaurants, cafes, food delivery, groceries)
   - Transport (uber, ola, taxi, fuel, parking, metro)
   - Shopping (clothes, electronics, amazon, flipkart)
   - Entertainment (movies, netflix, spotify, games)
   - Bills & Utilities (electricity, water, internet, phone)
   - Health (medicine, doctor, gym, pharmacy)
   - Travel (flights, hotels, trips)
   - Other (anything that doesn't fit above)
4. Description should be a clean summary (not the raw input)
5. Merchant is the company/store name if mentioned, null otherwise

RESPOND ONLY WITH VALID JSON, no other text:
{
  "amount": <number>,
  "currency": "<string>",
  "category": "<string>",
  "description": "<string>",
  "merchant": "<string or null>"
}

If the input is invalid or you cannot extract an amount, respond:
{
  "error": "Could not parse expense. Please include an amount.",
  "amount": null
}`;

export const parseExpense = async (
  text: string,
): Promise<ParsedExpense | null> => {
  if (!apiKey) {
    console.error("Gemini API Key missing.");
    return null;
  }

  try {
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Parse this expense: ${text}` },
    ]);

    const content = result.response.text();
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (parsed.error || parsed.amount === null) {
      console.error("AI parsing error:", parsed.error);
      return null;
    }

    return {
      amount: Number(parsed.amount),
      currency: parsed.currency || "INR",
      category: parsed.category || "Other",
      description: parsed.description || text,
      merchant: parsed.merchant || null,
    };
  } catch (error: any) {
    console.error("Error calling Gemini API:", error?.message || error);
    return null;
  }
};
