let billCounter = 1001; // Initial bill number

function generateBillNumber() {
    const billNumber = `BILL-${billCounter}`;
    billCounter++; // Increment for the next bill
    return billNumber;
}


module.exports = { generateBillNumber };