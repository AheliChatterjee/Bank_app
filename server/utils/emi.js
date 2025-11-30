// utils/emi.js
// returns monthly EMI rounded to 2 decimals
function calculateEMI(principal, annualRatePercent, tenureMonths) {
  if (!principal || !annualRatePercent || !tenureMonths) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return +(principal / tenureMonths).toFixed(2);
  const pow = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = principal * monthlyRate * pow / (pow - 1);
  return +emi.toFixed(2);
}

module.exports = { calculateEMI };
