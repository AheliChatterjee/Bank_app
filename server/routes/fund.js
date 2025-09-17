const express = require('express');
const Fund = require('../routes/fund');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// ✅ Create a fund entry (Share or Thrift)
router.post('/:type', requireAuth, async (req, res) => {
    
    const { amount } = req.body;
    const { type } = req.params;

    if (!['share', 'thrift'].includes(type)) {
        return res.status(400).json({ error: 'Invalid fund type' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    try {
        const fund = new Fund({
            userId: req.user._id,
            type,
            amount
        });

        await fund.save();
        res.status(201).json({ message: 'Fund created successfully', fund });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get summary (total + last 12 months) for a fund type
router.get('/summary/:type', requireAuth, async (req, res) => {
    const { type } = req.params;

    if (!['share', 'thrift'].includes(type)) {
        return res.status(400).json({ error: 'Invalid fund type' });
    }

    try {
        const all = await Fund.find({ userId: req.user._id, type });

        const total = all.reduce((sum, item) => sum + item.amount, 0);

        const monthWise = Array(12).fill(0);
        const now = new Date();

        all.forEach(({ date, amount }) => {
            const diff =
                (now.getFullYear() - date.getFullYear()) * 12 +
                (now.getMonth() - date.getMonth());

            if (diff >= 0 && diff < 12) {
                monthWise[11 - diff] += amount;
            }
        });

        res.status(200).json({
            total,
            monthWise
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
