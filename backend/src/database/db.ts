import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../expenses.db');
const db = new Database(dbPath);

// Initialize database & table
export const initDB = () => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount DECIMAL(10, 2) NOT NULL,
            currency TEXT DEFAULT 'INR',
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            merchant TEXT,
            original_input TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

export interface ExpenseInput {
    amount: number;
    currency: string;
    category: string;
    description: string;
    merchant: string | null;
    original_input: string;
}

export interface Expense extends ExpenseInput {
    id: number;
    created_at: string;
}

export const createExpense = (expense: ExpenseInput): Expense => {
    const stmt = db.prepare(`
        INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
        expense.amount,
        expense.currency,
        expense.category,
        expense.description,
        expense.merchant,
        expense.original_input
    );
    return {
        ...expense,
        id: info.lastInsertRowid as number,
        created_at: new Date().toISOString()
    };
};

export const getAllExpenses = (): Expense[] => {
    const stmt = db.prepare('SELECT * FROM expenses ORDER BY created_at DESC');
    return stmt.all() as Expense[];
};

export const deleteExpense = (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
    const info = stmt.run(id);
    return info.changes > 0;
};

export default db;
