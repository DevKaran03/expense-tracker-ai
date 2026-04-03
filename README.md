# AI Expense Tracker

A full-stack expense tracking app that uses AI to parse natural language input. Simply type "Spent 500 on groceries at BigBazaar" and the app will automatically categorize and log the expense.

Built by: **Karan Singh**
GitHub: [karan-singh](https://github.com/DevKaran03)
Time to build: **22 minutes** (with AI assistance)

## 🎥 Demo

![Demo Placeholder](https://github.com/user-attachments/assets/0bc8ac14-7333-476c-abd0-c48f4f35a0f0)
_Watch how natural language input is converted into structured expense data._

## 🛠️ Tech Stack

- **Mobile:** React Native, Expo, TypeScript, Lucide Icons, React Navigation, Expo Router
- **Backend:** Node.js, Express, TypeScript, Sequelize (ORM)
- **Database:** SQLite
- **AI:** Google Gemini (via `gemini-flash-latest`)

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Google Gemini API Key

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Mobile

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the API URL:
   Ensure `mobile/src/services/api.ts` points to your machine's local IP address or `localhost`.
4. Start the Expo server:
   ```bash
   npx expo start
   ```
5. Scan the QR code with the **Expo Go** app (Android/iOS).

## 📁 Project Structure

- `mobile/`: The React Native application. Uses **Expo Router** for navigation and **Lucide React Native** for icons.
- `backend/`: The Express.js server. Handles AI parsing logic and persists data in a local SQLite database using **Sequelize**.

## 🤖 AI Prompt Design

I used this system prompt for expense parsing:

```typescript
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
```

**Why this approach:**
I chose a strictly structured JSON response format to ensure the backend could reliably parse data without hallucination, and mapped natural language to a fixed set of categories to enable consistent, emoji-driven UI icons.

## ⏱️ Time Breakdown

| Task             | Time           |
| ---------------- | -------------- |
| Setup            | 2 min          |
| Backend          | 5 min          |
| AI Integration   | 5 min          |
| Mobile App       | 8 min          |
| Testing & Polish | 2 min          |
| **Total**        | **22 minutes** |

## 🔮 What I'd Add With More Time

- [ ] **Multi-currency Support:** Automatically handle exchange rates for international expenses.
- [ ] **Visualization Dashboard:** Bar and pie charts for weekly/monthly spending trends.
- [ ] **Voice Entry:** Integration with speech-to-text for completely hands-free expense logging.

## 📝 AI Tools Used

- **Google Gemini 1.5 Flash**: Orchestration of natural language to structured JSON.
- **Antigravity (AI Coding Assistant)**: Used for rapid full-stack scaffolding, debugging TypeScript errors, and generating configuration files.

Most helpful prompt: _"Explain what this problem is and help me fix it: Type '{ size: number; color: string; }' is not assignable to type 'IntrinsicAttributes & LucideProps'."_

## 📜 License

MIT - Feel free to use this for your own projects!
