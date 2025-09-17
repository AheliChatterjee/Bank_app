const express = require('express');
const Loan = require('../routes/loan');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// ✅ Apply for a loan (MT or Own Fund)
router.post('/apply/:type', requireAuth, async (req, res) => {
    const { type } = req.params;
    const { principal, interestRate, durationMonths } = req.body;

    if (!['mt', 'own'].includes(type)) {
        return res.status(400).json({ error: 'Invalid loan type' });
    }

    try {
        const loan = new Loan({
            userId: req.user._id,
            type,
            principal,
            interestRate,
            durationMonths,
            startDate: new Date(), // assuming it's not auto-set in schema
            paidAmount: 0 // assuming this field exists in schema
        });

        await loan.save();
        res.status(201).json({ message: 'Loan application submitted successfully', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Get summary for loans of a particular type
router.get('/summary/:type', requireAuth, async (req, res) => {
    const { type } = req.params;

    if (!['mt', 'own'].includes(type)) {
        return res.status(400).json({ error: 'Invalid loan type' });
    }

    try {
        const loans = await Loan.find({ userId: req.user._id, type });

        const summary = loans.map(loan => {
            const totalPayable = loan.principal + (loan.principal * loan.interestRate / 100);
            const due = totalPayable - loan.paidAmount;

            const expectedCompletion = new Date(loan.startDate);
            expectedCompletion.setMonth(expectedCompletion.getMonth() + loan.durationMonths);

            return {
                principal: loan.principal,
                interestRate: loan.interestRate,
                due,
                expectedCompletion
            };
        });

        res.status(200).json({ summary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
