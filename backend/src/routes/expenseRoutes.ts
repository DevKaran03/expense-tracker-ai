import express, { Request, Response } from 'express';
import { parseExpense } from '../services/aiService';
import { createExpense, getAllExpenses, deleteExpense } from '../database/db';

const router = express.Router();

// POST /api/expenses - parse text and save
router.post('/expenses', async (req: Request, res: Response) => {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
        return res.status(400).json({ success: false, error: 'Input text is required' });
    }

    try {
        const parsed = await parseExpense(input);
        if (!parsed) {
            return res.status(400).json({
                success: false,
                error: 'Could not parse expense. Please include an amount.'
            });
        }

        const expense = createExpense({
            ...parsed,
            original_input: input
        });

        return res.status(201).json({ success: true, data: expense });
    } catch (error) {
        console.error('Error processing expense:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// GET /api/expenses - list all
router.get('/expenses', (req: Request, res: Response) => {
    try {
        const expenses = getAllExpenses();
        return res.json({ success: true, data: expenses });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// DELETE /api/expenses/:id - delete by ID
router.delete('/expenses/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ success: false, error: 'Invalid ID' });
    }

    try {
        const deleted = deleteExpense(Number(id));
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Expense not found' });
        }
        return res.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

export default router;
